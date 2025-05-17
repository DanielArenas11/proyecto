"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DateFormatter_1 = require("../tools/DateFormatter");
const SignID_1 = require("../tools/SignID");
class Submission {
    constructor(options) {
        this.id = (0, SignID_1.getSnowflake)();
        this.user_id = options.user_id;
        this.activity_id = options.activity_id;
        this.comment = options.comment;
        this.created_at = (0, DateFormatter_1.formatToLocale)(new Date(Date.now()));
        this.score = 0;
    }
}
exports.default = Submission;
