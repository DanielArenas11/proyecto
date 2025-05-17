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
exports.register = register;
exports.login = login;
const User_1 = __importDefault(require("../schemas/User"));
const UserQueries_1 = require("../sql/UserQueries");
const bcrypt_1 = require("bcrypt");
const sessionTokenValidation_1 = require("../middleware/sessionTokenValidation");
function register(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = request.body;
            if (data.password.length < 4 || data.password.length > 32)
                return response.status(403).send({ message: `User's password must be between 4 to 32 characters long.` });
            const emailTaken = yield (0, UserQueries_1.isEmailUsed)(data.email);
            if (emailTaken)
                return response.status(409).send({ message: `Email already used by another user.` });
            const hashedPassword = yield (0, bcrypt_1.hash)(data.password, 10);
            const user = new User_1.default(Object.assign(Object.assign({}, data), { password: hashedPassword }));
            yield (0, UserQueries_1.createUser)(user);
            const sessionToken = (0, sessionTokenValidation_1.generateSessionToken)({ id: user.id });
            response.status(200).send({ message: "User authenticated.", token: sessionToken });
        }
        catch (err) {
            response.status(500).send({ message: "An error ocurred on our end.", error: err.message });
        }
    });
}
function login(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = request.body;
            if (!email || !password)
                return response.status(400).send({ message: `Email or password not provided.` });
            const user = yield (0, UserQueries_1.fetchUserByEmail)(email);
            if (!user)
                return response.status(404).send({ message: `User with email "${email}" not found.` });
            const isValidPassword = yield (0, bcrypt_1.compare)(password, user.credentials.password);
            if (!isValidPassword)
                return response.status(401).send({ message: `User password mismatch.` });
            const sessionToken = (0, sessionTokenValidation_1.generateSessionToken)({ id: user.id });
            response.status(200).send({ message: "User authenticated.", token: sessionToken });
        }
        catch (err) {
            response.status(500).send({ message: "An error ocurred on our end.", error: err.message });
        }
    });
}
