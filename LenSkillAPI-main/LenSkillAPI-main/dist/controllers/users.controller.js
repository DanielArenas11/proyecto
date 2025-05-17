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
exports.getUsers = getUsers;
exports.getUser = getUser;
const Access_1 = require("../tools/Access");
const UserQueries_1 = require("../sql/UserQueries");
const User_1 = require("../schemas/User");
function getUsers(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const me = request.user;
            const [accessGranted, requiredRoles] = (0, Access_1.hasAccess)(me, [User_1.UserRole.ADMINISTRATOR]);
            if (!accessGranted)
                return response.status(401).send({ message: `Missing access. Only users with ${requiredRoles.join(", ")} can access.` });
            const users = yield (0, UserQueries_1.fetchUsers)();
            response.status(200).send({ message: "Users fetched.", users });
        }
        catch (err) {
            response.status(500).send({ message: "An error ocurred on our end.", error: err.message });
        }
    });
}
function getUser(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId } = request.params;
            const me = request.user;
            const [accessGranted, requiredRoles] = (0, Access_1.hasAccess)(me, [User_1.UserRole.ADMINISTRATOR]);
            if (!accessGranted)
                return response.status(401).send({ message: `Missing access. Only users with ${requiredRoles.join(", ")} can access.` });
            const user = yield (0, UserQueries_1.fetchUser)(userId);
            if (!user)
                return response.status(404).send({ message: `User not found.` });
            response.status(200).send({ message: "User fetched.", user });
        }
        catch (err) {
            response.status(500).send({ message: "An error ocurred on our end.", error: err.message });
        }
    });
}
