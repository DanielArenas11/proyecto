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
exports.uploadActivityAttachment = uploadActivityAttachment;
exports.fetchActivityAttachment = fetchActivityAttachment;
exports.fetchActivityAttachments = fetchActivityAttachments;
exports.deleteActivityAttachment = deleteActivityAttachment;
const Database_1 = __importDefault(require("../schemas/Database"));
const Attachments_1 = require("../tools/Attachments");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
function uploadActivityAttachment(attachment, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield Database_1.default.connect();
        try {
            yield client.query("begin");
            const result = yield client.query(`insert into activity_attachments (attachment_id, name, mimetype, activity_id) values ($1, $2, $3, $4) returning *`, [attachment.id, attachment.name, attachment.mimetype, attachment.activity_id]).then(r => r.rows[0]);
            if (!result)
                return null;
            const dataQueue = [];
            for (const adata of data) {
                dataQueue.push(client.query(`insert into activity_attachment_data (attachment_id, buffer, chunk_index) values ($1, $2, $3)`, [result.attachment_id, adata.buffer, adata.chunk_index]));
            }
            yield Promise.all(dataQueue);
            yield client.query("commit");
            return attachment;
        }
        catch (err) {
            yield client.query("rollback");
            console.log(err);
            return null;
        }
        finally {
            client.release();
        }
    });
}
function fetchActivityAttachment(attachmentId) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield Database_1.default.query(`select * from activity_attachments a join activity_attachment_data ad on ad.attachment_id = a.attachment_id where a.attachment_id = $1 
        order by ad.chunk_index asc;`, [attachmentId]);
        if (!result.rows[0])
            return null;
        const data = result.rows[0];
        const attachment = {
            id: data.attachment_id,
            name: data.name,
            mimetype: data.mimetype,
            buffer: (0, Attachments_1.unifyAttachmentData)(result.rows.map(d => {
                return { attachment_id: d.attachment_id, buffer: d.buffer, chunk_index: d.chunk_index };
            }))
        };
        return attachment;
    });
}
function fetchActivityAttachments(activityId) {
    return __awaiter(this, void 0, void 0, function* () {
        const attachmentUrls = [];
        const result = yield Database_1.default.query(`select * from activity_attachments where activity_id = $1`, [activityId]);
        if (!result.rows[0])
            return [];
        for (const data of result.rows) {
            const attachment = {
                name: data.name,
                url: `${process.env.API_URL}/api/v1/attachments/activities/${data.attachment_id}`
            };
            attachmentUrls.push(attachment);
        }
        return attachmentUrls;
    });
}
function deleteActivityAttachment(attachmentId) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield Database_1.default.query(`delete from activity_attachments where attachment_id = $1 returning *`, [attachmentId]);
        if (!result.rows[0])
            return null;
        const data = result.rows[0];
        const attachmentDTO = {
            id: data.attachment_id,
            name: data.name,
            mimetype: data.mimetype,
            activity_id: data.activity_id
        };
        return attachmentDTO;
    });
}
