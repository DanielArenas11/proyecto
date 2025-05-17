"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BLACKLISTED_MIMETYPES = exports.MAX_ATTACHMENT_BUFFER_SIZE = exports.MAX_ATTACHMENT_UPLOAD_SIZE = exports.ACTIVITY_DEADLINE_WINDOW = exports.TOKEN_EXPIRATION_TIME = void 0;
exports.TOKEN_EXPIRATION_TIME = 30 * 24 * 60 * 60 * 1000;
//D * H * M * S * MS
exports.ACTIVITY_DEADLINE_WINDOW = 1 * 24 * 60 * 60 * 1000;
//GB * MB * KB * B
exports.MAX_ATTACHMENT_UPLOAD_SIZE = 50 * 1024 * 1024;
exports.MAX_ATTACHMENT_BUFFER_SIZE = 5 * 1024 * 1024;
exports.BLACKLISTED_MIMETYPES = ["application/x-msdos-program", "application/zip"];
