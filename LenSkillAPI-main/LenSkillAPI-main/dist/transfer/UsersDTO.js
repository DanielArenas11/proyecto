"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toAPIUser = toAPIUser;
function toAPIUser(user) {
    return {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        account: user.account
    };
}
