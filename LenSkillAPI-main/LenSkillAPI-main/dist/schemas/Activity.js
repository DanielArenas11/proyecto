"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DateFormatter_1 = require("../tools/DateFormatter");
const SignID_1 = require("../tools/SignID");
class Activity {
    constructor(options) {
        this.id = (0, SignID_1.getSnowflake)();
        this.title = options.title;
        this.description = options.description;
        this.course_id = options.course_id;
        this.created_at = (0, DateFormatter_1.formatToLocale)(new Date(Date.now()));
        this.deadline = options.deadline;
    }
}
exports.default = Activity;
