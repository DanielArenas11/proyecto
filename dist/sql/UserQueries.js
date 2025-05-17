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
exports.isEmailUsed = isEmailUsed;
exports.createUser = createUser;
exports.fetchUser = fetchUser;
exports.fetchUserByEmail = fetchUserByEmail;
exports.fetchUsers = fetchUsers;
const Database_1 = __importDefault(require("../schemas/Database"));
const DateFormatter_1 = require("../tools/DateFormatter");
function isEmailUsed(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield Database_1.default.query("select * from users where email = $1", [email]);
        return !!result.rows[0];
    });
}
function createUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        yield Database_1.default.query(`insert into users (user_id, first_name, last_name, email, password, role, created_at, last_login)
        values ($1, $2, $3, $4, $5, $6, $7, $8) returning *`, [
            user.id, user.first_name, user.last_name,
            user.credentials.email, user.credentials.password,
            user.account.role, new Date(user.account.created_at), new Date(user.account.last_login)
        ]);
    });
}
function fetchUser(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield Database_1.default.query(`select * from users where user_id = $1`, [userId]);
            if (!result.rows[0])
                return null;
            const data = result.rows[0];
            const userDTO = {
                id: data.user_id,
                first_name: data.first_name,
                last_name: data.last_name,
                credentials: {
                    email: data.email,
                    password: data.password
                },
                account: {
                    role: data.role,
                    created_at: (0, DateFormatter_1.formatToLocale)(data.created_at),
                    last_login: (0, DateFormatter_1.formatToLocale)(data.last_login)
                }
            };
            return userDTO;
        }
        catch (err) {
            return null;
        }
    });
}
function fetchUserByEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield Database_1.default.query(`select * from users where email = $1`, [email]);
            if (!result.rows[0])
                return null;
            const data = result.rows[0];
            const userDTO = {
                id: data.user_id,
                first_name: data.first_name,
                last_name: data.last_name,
                credentials: {
                    email: data.email,
                    password: data.password
                },
                account: {
                    role: data.role,
                    created_at: (0, DateFormatter_1.formatToLocale)(data.created_at),
                    last_login: (0, DateFormatter_1.formatToLocale)(data.last_login)
                }
            };
            return userDTO;
        }
        catch (err) {
            return null;
        }
    });
}
function fetchUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        const collection = {};
        const result = yield Database_1.default.query(`select * from users`);
        for (const data of result.rows) {
            const userDTO = {
                id: data.user_id,
                first_name: data.first_name,
                last_name: data.last_name,
                credentials: {
                    email: data.email,
                    password: data.password
                },
                account: {
                    role: data.role,
                    created_at: (0, DateFormatter_1.formatToLocale)(data.created_at),
                    last_login: (0, DateFormatter_1.formatToLocale)(data.last_login)
                }
            };
            collection[userDTO.id] = userDTO;
        }
        return collection;
    });
}
