"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatBytes = formatBytes;
exports.fragmentAttachment = fragmentAttachment;
exports.unifyAttachmentData = unifyAttachmentData;
const constants_1 = require("../constants");
function formatBytes(bytes) {
    const kb = bytes / 1024;
    const mb = kb / 1024;
    const gb = mb / 1024;
    return (gb > 1 && `${gb.toFixed(2)}GB`) || (mb > 1 && `${mb.toFixed(2)}MB`) || (kb > 1 && `${kb.toFixed(2)}KB`) || `${bytes}`;
}
function fragmentAttachment(attachment) {
    const attachmentData = [];
    if (!attachment.buffer)
        return [];
    let bi = 0; //Buffer index
    for (let i = 0; i < attachment.buffer.length; i += constants_1.MAX_ATTACHMENT_BUFFER_SIZE) {
        const data = {
            attachment_id: attachment.id,
            buffer: attachment.buffer.subarray(i, i + constants_1.MAX_ATTACHMENT_BUFFER_SIZE),
            chunk_index: bi++
        };
        attachmentData.push(data);
    }
    return attachmentData;
}
function unifyAttachmentData(data) {
    const result = Buffer.concat(data.map(d => d.buffer));
    return result;
}
