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
exports.createSubmission = createSubmission;
exports.fetchSubmissions = fetchSubmissions;
exports.fetchSubmission = fetchSubmission;
exports.updateSubmision = updateSubmision;
exports.deleteSubmission = deleteSubmission;
const Database_1 = __importDefault(require("../schemas/Database"));
const DateFormatter_1 = require("../tools/DateFormatter");
const ActivitiesQueries_1 = require("./ActivitiesQueries");
const SubmissionAttachmentsQueries_1 = require("./SubmissionAttachmentsQueries");
const UserQueries_1 = require("./UserQueries");
function createSubmission(submission) {
    return __awaiter(this, void 0, void 0, function* () {
        yield Database_1.default.query(`insert into submissions (submission_id, user_id, activity_id, score, comment, created_at)
        values ($1, $2, $3, $4, $5, $6)`, [submission.id, submission.user_id, submission.activity_id, submission.score, submission.comment, new Date(submission.created_at)]);
    });
}
function fetchSubmissions(activityId) {
    return __awaiter(this, void 0, void 0, function* () {
        const collection = {};
        const result = yield Database_1.default.query(`select * from submissions where activity_id = $1`, [activityId]);
        if (!result.rows[0])
            return {};
        for (const data of result.rows) {
            const submissionDTO = {
                id: data.activity_id,
                user_id: data.user_id,
                activity_id: data.activity_id,
                comment: data.comment,
                score: data.score,
                created_at: (0, DateFormatter_1.formatToLocale)(data.created_at)
            };
            collection[submissionDTO.id] = submissionDTO;
        }
        return collection;
    });
}
function fetchSubmission(submissionId, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield Database_1.default.query(`select * from submissions where submission_id = $1`, [submissionId]);
        if (!result.rows[0])
            return null;
        const data = result.rows[0];
        const attachments = yield (0, SubmissionAttachmentsQueries_1.fetchSubmissionAttachments)(submissionId);
        const submissionDTO = {
            id: data.submission_id,
            comment: data.comment,
            score: data.score,
            created_at: (0, DateFormatter_1.formatToLocale)(data.created_at),
            attachments
        };
        if (options === null || options === void 0 ? void 0 : options.getActivity) {
            const activity = yield (0, ActivitiesQueries_1.fetchActivity)(data.activity_id);
            submissionDTO.activity = activity || undefined;
        }
        if (options === null || options === void 0 ? void 0 : options.getSender) {
            const user = yield (0, UserQueries_1.fetchUser)(data.user_id);
            submissionDTO.user = (user) || undefined;
        }
        return submissionDTO;
    });
}
function updateSubmision(submissionId, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const valuesData = Object.entries(options).map(value => { return { name: value[0], value: value[1] }; });
        const setClause = valuesData.map((val, i) => `${val.name} = $${i + 1}`);
        const result = yield Database_1.default.query(`update submissions set ${setClause} where submission_id = $${setClause.length + 1} returning *`, [...valuesData.filter(val => val.value).map(val => val.value), submissionId]);
        if (!result.rows[0])
            return null;
        const data = result.rows[0];
        const submissionDTO = {
            id: data.activity_id,
            user_id: data.user_id,
            activity_id: data.activity_id,
            comment: data.comment,
            score: data.score,
            created_at: (0, DateFormatter_1.formatToLocale)(data.created_at)
        };
        return submissionDTO;
    });
}
function deleteSubmission(submissionId) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield Database_1.default.query(`delete from submissions where submission_id = $1 returning *`, [submissionId]);
        if (!result.rows[0])
            return null;
        const data = result.rows[0];
        const submissionDTO = {
            id: data.activity_id,
            user_id: data.user_id,
            activity_id: data.activity_id,
            comment: data.comment,
            score: data.score,
            created_at: (0, DateFormatter_1.formatToLocale)(data.created_at)
        };
        return submissionDTO;
    });
}
