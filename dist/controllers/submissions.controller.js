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
exports.registerSubmission = registerSubmission;
exports.getSubmission = getSubmission;
exports.putSubmission = putSubmission;
exports.removeSubmission = removeSubmission;
const Submission_1 = __importDefault(require("../schemas/Submission"));
const SubmissionsQueries_1 = require("../sql/SubmissionsQueries");
const SubmissionAttachment_1 = __importDefault(require("../schemas/SubmissionAttachment"));
const constants_1 = require("../constants");
const Attachments_1 = require("../tools/Attachments");
const SubmissionAttachmentsQueries_1 = require("../sql/SubmissionAttachmentsQueries");
function registerSubmission(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = request.body;
            const me = request.user;
            const submission = new Submission_1.default(data);
            submission.user_id = me.id;
            yield (0, SubmissionsQueries_1.createSubmission)(submission);
            //Upload files if neccessary
            const attachments = request.files;
            for (const attData of attachments) {
                const attachment = Object.assign(Object.assign({}, new SubmissionAttachment_1.default({
                    name: attData.originalname,
                    submission_id: submission.id,
                    mimetype: attData.mimetype
                })), { buffer: attData.buffer });
                if (attachment.buffer.length > constants_1.MAX_ATTACHMENT_UPLOAD_SIZE)
                    return response.status(413).send({ message: `Attachment size's too large: ${(0, Attachments_1.formatBytes)(attachment.buffer.length)}. (>${(0, Attachments_1.formatBytes)(constants_1.MAX_ATTACHMENT_UPLOAD_SIZE)})` });
                if (constants_1.BLACKLISTED_MIMETYPES.some(t => attachment.mimetype === t))
                    return response.status(415).send({ message: `Mimetype "${attachment.mimetype}" is not allowed for upload.` });
                if (attachment.name.length > 128)
                    return response.status(403).send({ message: `Attachment name is too large.` });
                const attachmentBufferData = (0, Attachments_1.fragmentAttachment)(attachment);
                yield (0, SubmissionAttachmentsQueries_1.uploadSubmissionAttachment)(attachment, attachmentBufferData);
            }
            response.status(200).send({ message: `Submission created.`, submission });
        }
        catch (err) {
            response.status(500).send({ message: "An error ocurred on our end.", error: err.message });
        }
    });
}
function getSubmission(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { submissionId } = request.params;
            const { ga, gs } = request.query;
            if (!submissionId)
                return response.status(400).send({ message: `Submission ID not provided.` });
            const submission = yield (0, SubmissionsQueries_1.fetchSubmission)(submissionId, {
                getActivity: !!(+ga),
                getSender: !!(+gs)
            });
            if (!submission)
                return response.status(400).send({ message: `Submission not found.` });
            response.status(200).send({ message: `Submission fetched.`, submission });
        }
        catch (err) {
            response.status(500).send({ message: "An error ocurred on our end.", error: err.message });
        }
    });
}
function putSubmission(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { submissionId } = request.params;
            const data = request.body;
            if (!submissionId)
                return response.status(400).send({ message: `Submission ID not provided.` });
            const submission = yield (0, SubmissionsQueries_1.updateSubmision)(submissionId, data);
            if (!submission)
                return response.status(400).send({ message: `Submission not found.` });
            response.status(200).send({ message: `Submission updated.`, submission });
        }
        catch (err) {
            response.status(500).send({ message: "An error ocurred on our end.", error: err.message });
        }
    });
}
function removeSubmission(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { submissionId } = request.params;
            if (!submissionId)
                return response.status(400).send({ message: `Submission ID not provided.` });
            const submission = yield (0, SubmissionsQueries_1.deleteSubmission)(submissionId);
            if (!submission)
                return response.status(400).send({ message: `Submission not found.` });
            response.status(200).send({ message: `Submission deleted.`, submission });
        }
        catch (err) {
            response.status(500).send({ message: "An error ocurred on our end.", error: err.message });
        }
    });
}
