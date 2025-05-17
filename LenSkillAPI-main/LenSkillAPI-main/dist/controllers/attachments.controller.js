"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCourseAttachment = registerCourseAttachment;
exports.getCourseAttachment = getCourseAttachment;
exports.getCourseAttachments = getCourseAttachments;
exports.removeCourseAttachment = removeCourseAttachment;
exports.registerActivityAttachment = registerActivityAttachment;
exports.getActivityAttachment = getActivityAttachment;
exports.getActivityAttachments = getActivityAttachments;
exports.removeActivityAttachment = removeActivityAttachment;
exports.getSubmissionAttachment = getSubmissionAttachment;
exports.getSubmissionAttachments = getSubmissionAttachments;
exports.removeSubmissionAttachment = removeSubmissionAttachment;
const CoursesQueries_1 = require("../sql/CoursesQueries");
const CourseAttachment_1 = __importDefault(require("../schemas/CourseAttachment"));
const Attachments_1 = require("../tools/Attachments");
const CourseAttachmentsQueries_1 = require("../sql/CourseAttachmentsQueries");
const constants_1 = require("../constants");
const AttachmentCache_1 = require("../cache/AttachmentCache");
const ActivityAttachment_1 = __importDefault(require("../schemas/ActivityAttachment"));
const ActivitiesQueries_1 = require("../sql/ActivitiesQueries");
const dotenv_1 = require("dotenv");
const Access_1 = require("../tools/Access");
const User_1 = require("../schemas/User");
const ActivitiesAttachmentsQueries_1 = require("../sql/ActivitiesAttachmentsQueries");
const SubmissionAttachmentsQueries_1 = require("../sql/SubmissionAttachmentsQueries");
const SubmissionsQueries_1 = require("../sql/SubmissionsQueries");
(0, dotenv_1.config)();
//#region Course attachments
function registerCourseAttachment(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const data = request.body;
            const { courseId } = request.params;
            const me = request.user;
            const [accessGranted, requiredRoles] = (0, Access_1.hasAccess)(me, [User_1.UserRole.INSTRUCTOR, User_1.UserRole.ADMINISTRATOR]);
            if (!accessGranted)
                return response.status(401).send({ message: `Missing access. Only users with ${requiredRoles.join(", ")} can access.` });
            const course = yield (0, CoursesQueries_1.fetchCourse)(courseId);
            if (!course)
                return response.status(404).send({ message: `Course not found.` });
            if (request.files.length > 1)
                return response.status(403).send({ message: `Upload limited to 1 attachment per request.` });
            const attData = (_a = request.files) === null || _a === void 0 ? void 0 : _a[0];
            const attachment = Object.assign(Object.assign({}, new CourseAttachment_1.default({
                name: attData.originalname,
                course_id: courseId,
                mimetype: attData.mimetype
            })), { buffer: attData.buffer });
            if (attachment.buffer.length > constants_1.MAX_ATTACHMENT_UPLOAD_SIZE)
                return response.status(413).send({ message: `Attachment size's too large: ${(0, Attachments_1.formatBytes)(attachment.buffer.length)}. (>${(0, Attachments_1.formatBytes)(constants_1.MAX_ATTACHMENT_UPLOAD_SIZE)})` });
            if (constants_1.BLACKLISTED_MIMETYPES.some(t => attachment.mimetype === t))
                return response.status(415).send({ message: `Mimetype "${attachment.mimetype}" is not allowed for upload.` });
            if (attachment.name.length > 128)
                return response.status(403).send({ message: `Attachment name is too large.` });
            const attachmentBufferData = (0, Attachments_1.fragmentAttachment)(attachment);
            const upload = yield (0, CourseAttachmentsQueries_1.uploadCourseAttachment)(attachment, attachmentBufferData);
            if (!upload)
                return response.status(400).send({ message: `Failed to upload attachment.` });
            response.status(200).send({
                message: `Attachment uploaded.`,
                attachment: Object.assign(Object.assign({}, attachment), { buffer: undefined }),
                chunkSize: attachmentBufferData.length,
                url: `${process.env.API_URL}/api/v1/attachments/courses/${attachment.id}`
            });
        }
        catch (err) {
            response.status(500).send({ message: "An error ocurred on our end.", error: err.message });
        }
    });
}
function getCourseAttachment(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { attachmentId } = request.params;
            const attachmentOnCache = (0, AttachmentCache_1.getAttachmentCache)(attachmentId);
            if (attachmentOnCache) {
                response.setHeader("Content-Type", attachmentOnCache.mimetype);
                response.setHeader('Content-Disposition', `inline; filename="${attachmentOnCache.name}"`);
                response.status(200).send(attachmentOnCache.buffer);
            }
            else {
                const attachment = yield (0, CourseAttachmentsQueries_1.fetchCourseAttachment)(attachmentId);
                if (!attachment)
                    return response.status(404).send({ message: `Attachment not found.` });
                if (!attachment.buffer)
                    return response.status(410).send({ message: `Attachment not found.` });
                response.setHeader("Content-Type", attachment.mimetype);
                response.setHeader('Content-Disposition', `inline; filename="${attachment.name}"`);
                (0, AttachmentCache_1.setAttachmentCache)(attachmentId, attachment);
                response.status(200).send(attachment.buffer);
            }
        }
        catch (err) {
            response.status(500).send({ message: "An error ocurred on our end.", error: err.message });
        }
    });
}
function getCourseAttachments(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { courseId } = request.params;
            const course = yield (0, CoursesQueries_1.fetchCourse)(courseId);
            if (!course)
                return response.status(404).send({ message: `Course not found.` });
            const attachments = yield (0, CourseAttachmentsQueries_1.fetchCourseAttachments)(courseId);
            response.status(200).send({ message: `Course attachments fetched.`, attachments });
        }
        catch (err) {
            response.status(500).send({ message: "An error ocurred on our end.", error: err.message });
        }
    });
}
function removeCourseAttachment(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { attachmentId } = request.params;
            const me = request.user;
            const [accessGranted, requiredRoles] = (0, Access_1.hasAccess)(me, [User_1.UserRole.INSTRUCTOR, User_1.UserRole.ADMINISTRATOR]);
            if (!accessGranted)
                return response.status(401).send({ message: `Missing access. Only users with ${requiredRoles.join(", ")} can access.` });
            const attachment = yield (0, CourseAttachmentsQueries_1.deleteCourseAttachment)(attachmentId);
            if (!attachment)
                return response.status(404).send({ message: `Attachment not found.` });
            (0, AttachmentCache_1.deleteAttachmentCache)(attachmentId);
            response.status(200).send({ message: `Attachment deleted.`, attachment });
        }
        catch (err) {
            response.status(500).send({ message: "An error ocurred on our end.", error: err.message });
        }
    });
}
//#region Activities attachments
function registerActivityAttachment(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const data = request.body;
            const { activityId } = request.params;
            const me = request.user;
            const [accessGranted, requiredRoles] = (0, Access_1.hasAccess)(me, [User_1.UserRole.INSTRUCTOR, User_1.UserRole.ADMINISTRATOR]);
            if (!accessGranted)
                return response.status(401).send({ message: `Missing access. Only users with ${requiredRoles.join(", ")} can access.` });
            const activity = yield (0, ActivitiesQueries_1.fetchActivity)(activityId, { getCourse: true });
            if (!activity)
                return response.status(404).send({ message: `Activity not found.` });
            if (request.files.length > 1)
                return response.status(403).send({ message: `Upload limited to 1 attachment per request.` });
            const joined = yield (0, CoursesQueries_1.alreadyJoined)(activity.course.id, me.id);
            if (!joined)
                return response.status(401).send({ message: `Cannot upload to foreign course.` });
            const attData = (_a = request.files) === null || _a === void 0 ? void 0 : _a[0];
            const attachment = Object.assign(Object.assign({}, new ActivityAttachment_1.default({
                name: attData.originalname,
                activity_id: activityId,
                mimetype: attData.mimetype
            })), { buffer: attData.buffer });
            if (attachment.buffer.length > constants_1.MAX_ATTACHMENT_UPLOAD_SIZE)
                return response.status(413).send({ message: `Attachment size's too large: ${(0, Attachments_1.formatBytes)(attachment.buffer.length)}. (>${(0, Attachments_1.formatBytes)(constants_1.MAX_ATTACHMENT_UPLOAD_SIZE)})` });
            if (constants_1.BLACKLISTED_MIMETYPES.some(t => attachment.mimetype === t))
                return response.status(415).send({ message: `Mimetype "${attachment.mimetype}" is not allowed for upload.` });
            if (attachment.name.length > 128)
                return response.status(403).send({ message: `Attachment name is too large.` });
            const attachmentBufferData = (0, Attachments_1.fragmentAttachment)(attachment);
            const upload = yield (0, ActivitiesAttachmentsQueries_1.uploadActivityAttachment)(attachment, attachmentBufferData);
            if (!upload)
                return response.status(400).send({ message: `Failed to upload attachment.` });
            response.status(200).send({
                message: `Attachment uploaded.`,
                attachment: Object.assign(Object.assign({}, attachment), { buffer: undefined }),
                chunkSize: attachmentBufferData.length,
                url: `${process.env.API_URL}/api/v1/attachments/activities/${attachment.id}`
            });
        }
        catch (err) {
            response.status(500).send({ message: "An error ocurred on our end.", error: err.message });
        }
    });
}
function getActivityAttachment(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { attachmentId } = request.params;
            const attachmentOnCache = (0, AttachmentCache_1.getAttachmentCache)(attachmentId);
            if (attachmentOnCache) {
                response.setHeader("Content-Type", attachmentOnCache.mimetype);
                response.setHeader('Content-Disposition', `inline; filename="${attachmentOnCache.name}"`);
                response.status(200).send(attachmentOnCache.buffer);
            }
            else {
                const attachment = yield (0, ActivitiesAttachmentsQueries_1.fetchActivityAttachment)(attachmentId);
                if (!attachment)
                    return response.status(404).send({ message: `Attachment not found.` });
                if (!attachment.buffer)
                    return response.status(410).send({ message: `Attachment not found.` });
                response.setHeader("Content-Type", attachment.mimetype);
                response.setHeader('Content-Disposition', `inline; filename="${attachment.name}"`);
                (0, AttachmentCache_1.setAttachmentCache)(attachmentId, attachment);
                response.status(200).send(attachment.buffer);
            }
        }
        catch (err) {
            response.status(500).send({ message: "An error ocurred on our end.", error: err.message });
        }
    });
}
function getActivityAttachments(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { activityId } = request.params;
            const activity = yield (0, ActivitiesQueries_1.fetchActivity)(activityId);
            if (!activity)
                return response.status(404).send({ message: `Activity not found.` });
            const attachments = yield (0, ActivitiesAttachmentsQueries_1.fetchActivityAttachments)(activityId);
            response.status(200).send({ message: `Activity attachments fetched.`, attachments });
        }
        catch (err) {
            response.status(500).send({ message: "An error ocurred on our end.", error: err.message });
        }
    });
}
function removeActivityAttachment(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { attachmentId } = request.params;
            const me = request.user;
            const [accessGranted, requiredRoles] = (0, Access_1.hasAccess)(me, [User_1.UserRole.INSTRUCTOR, User_1.UserRole.ADMINISTRATOR]);
            if (!accessGranted)
                return response.status(401).send({ message: `Missing access. Only users with ${requiredRoles.join(", ")} can access.` });
            const attachment = yield (0, ActivitiesAttachmentsQueries_1.deleteActivityAttachment)(attachmentId);
            if (!attachment)
                return response.status(404).send({ message: `Attachment not found.` });
            (0, AttachmentCache_1.deleteAttachmentCache)(attachmentId);
            response.status(200).send({ message: `Attachment deleted.`, attachment });
        }
        catch (err) {
            response.status(500).send({ message: "An error ocurred on our end.", error: err.message });
        }
    });
}
//#region Activities attachments
function getSubmissionAttachment(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { attachmentId } = request.params;
            const attachmentOnCache = (0, AttachmentCache_1.getAttachmentCache)(attachmentId);
            if (attachmentOnCache) {
                response.setHeader("Content-Type", attachmentOnCache.mimetype);
                response.setHeader('Content-Disposition', `inline; filename="${attachmentOnCache.name}"`);
                response.status(200).send(attachmentOnCache.buffer);
            }
            else {
                const attachment = yield (0, SubmissionAttachmentsQueries_1.fetchSubmissionAttachment)(attachmentId);
                if (!attachment)
                    return response.status(404).send({ message: `Attachment not found.` });
                if (!attachment.buffer)
                    return response.status(410).send({ message: `Attachment not found.` });
                response.setHeader("Content-Type", attachment.mimetype);
                response.setHeader('Content-Disposition', `inline; filename="${attachment.name}"`);
                (0, AttachmentCache_1.setAttachmentCache)(attachmentId, attachment);
                response.status(200).send(attachment.buffer);
            }
        }
        catch (err) {
            response.status(500).send({ message: "An error ocurred on our end.", error: err.message });
        }
    });
}
function getSubmissionAttachments(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { submissionId } = request.params;
            const submission = yield (0, SubmissionsQueries_1.fetchSubmission)(submissionId);
            if (!submission)
                return response.status(404).send({ message: `Submission not found.` });
            const attachments = yield (0, SubmissionAttachmentsQueries_1.fetchSubmissionAttachments)(submissionId);
            response.status(200).send({ message: `Submission attachments fetched.`, attachments });
        }
        catch (err) {
            response.status(500).send({ message: "An error ocurred on our end.", error: err.message });
        }
    });
}
function removeSubmissionAttachment(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { attachmentId } = request.params;
            const attachment = yield (0, SubmissionAttachmentsQueries_1.deleteSubmissionAttachment)(attachmentId);
            if (!attachment)
                return response.status(404).send({ message: `Attachment not found.` });
            (0, AttachmentCache_1.deleteAttachmentCache)(attachmentId);
            response.status(200).send({ message: `Attachment deleted.`, attachment });
        }
        catch (err) {
            response.status(500).send({ message: "An error ocurred on our end.", error: err.message });
        }
    });
}
