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
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSessionToken = generateSessionToken;
exports.validateSession = validateSession;
const jsonwebtoken_1 = require("jsonwebtoken");
const constants_1 = require("../constants");
const UserQueries_1 = require("../sql/UserQueries");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
function generateSessionToken(data) { return (0, jsonwebtoken_1.sign)(data, process.env.API_TOKEN_SECRET, { expiresIn: constants_1.TOKEN_EXPIRATION_TIME }); }
function validateSession(request, response, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const { headers } = request;
            const token = (_a = headers.authorization) !== null && _a !== void 0 ? _a : null;
            if (!token)
                return response.status(400).send({ message: `Authentication token not provided.` });
            const payload = (0, jsonwebtoken_1.verify)(token, process.env.API_TOKEN_SECRET);
            if (!payload || !payload.id)
                return response.status(401).send({ message: `Token is not authorized.` });
            const user = yield (0, UserQueries_1.fetchUser)(payload.id);
            if (!user)
                return response.status(400).send({ message: "User not found." });
            request.user = { id: user.id, role: user.account.role, name: `${user.first_name} ${user.last_name}`, email: user.credentials.email };
            next();
        }
        catch (err) {
            response.status(500).send({ message: `Middleware error: ${err.message}` });
        }
    });
}
