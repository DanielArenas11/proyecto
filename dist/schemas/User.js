"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRole = void 0;
const DateFormatter_1 = require("../tools/DateFormatter");
const SignID_1 = require("../tools/SignID");
var UserRole;
(function (UserRole) {
    UserRole["USER"] = "USER";
    UserRole["INSTRUCTOR"] = "INSTRUCTOR";
    UserRole["ADMINISTRATOR"] = "ADMINISTRATOR";
})(UserRole || (exports.UserRole = UserRole = {}));
// Clase general
class User {
    constructor(options) {
        this.id = (0, SignID_1.getSnowflake)();
        this.first_name = options.first_name;
        this.last_name = options.last_name;
        this.credentials = {
            email: options.email,
            password: options.password
        };
        this.account = {
            role: UserRole.USER,
            created_at: (0, DateFormatter_1.formatToLocale)(new Date(Date.now())),
            last_login: (0, DateFormatter_1.formatToLocale)(new Date(Date.now()))
        };
    }
}
exports.default = User;
