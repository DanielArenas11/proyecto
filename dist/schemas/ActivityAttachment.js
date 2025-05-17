"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const SignID_1 = require("../tools/SignID");
class ActivityAttachment {
    constructor(options) {
        this.id = (0, crypto_1.createHash)("sha256").update((0, SignID_1.getSnowflake)()).digest("hex");
        this.name = options.name;
        this.mimetype = options.mimetype;
        this.activity_id = options.activity_id;
    }
}
exports.default = ActivityAttachment;
