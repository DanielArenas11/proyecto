"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DateFormatter_1 = require("../tools/DateFormatter");
const SignID_1 = require("../tools/SignID");
class Course {
    constructor(options) {
        this.id = (0, SignID_1.getSnowflake)();
        this.name = options.name;
        this.description = options.description;
        this.instructor_id = options.instructor_id;
        this.created_at = (0, DateFormatter_1.formatToLocale)(new Date(Date.now()));
    }
}
exports.default = Course;
