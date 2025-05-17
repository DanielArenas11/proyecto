"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAttachmentCache = setAttachmentCache;
exports.getAttachmentCache = getAttachmentCache;
exports.deleteAttachmentCache = deleteAttachmentCache;
const attachmentCache = {};
function setAttachmentCache(id, data) { attachmentCache[id] = data; }
function getAttachmentCache(id) { return attachmentCache[id]; }
function deleteAttachmentCache(id) { attachmentCache && delete attachmentCache[id]; }
