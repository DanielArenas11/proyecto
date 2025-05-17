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
exports.registerActivity = registerActivity;
exports.getActivity = getActivity;
exports.putActivity = putActivity;
exports.removeActivity = removeActivity;
const Access_1 = require("../tools/Access");
const User_1 = require("../schemas/User");
const Activity_1 = __importDefault(require("../schemas/Activity"));
const constants_1 = require("../constants");
const ActivitiesQueries_1 = require("../sql/ActivitiesQueries");
const CoursesQueries_1 = require("../sql/CoursesQueries");
function registerActivity(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = request.body;
            const me = request.user;
            const [accessGranted, requiredRoles] = (0, Access_1.hasAccess)(me, [User_1.UserRole.INSTRUCTOR, User_1.UserRole.ADMINISTRATOR]);
            if (!accessGranted)
                return response.status(401).send({ message: `Missing access. Only users with ${requiredRoles.join(", ")} can access.` });
            const joined = yield (0, CoursesQueries_1.alreadyJoined)(data.course_id, me.id);
            if (!joined)
                return response.status(401).send({ message: `Foreign course.` });
            const activity = new Activity_1.default(data);
            if ((new Date(activity.created_at).getTime() + constants_1.ACTIVITY_DEADLINE_WINDOW) > new Date(activity.deadline).getTime())
                return response.status(403).send({ message: `Activity deadline must be at least 1 day.` });
            yield (0, ActivitiesQueries_1.createActivity)(activity);
            response.status(200).send({ message: `Activity created.`, activity });
        }
        catch (err) {
            response.status(500).send({ message: "An error ocurred on our end.", error: err.message });
        }
    });
}
function getActivity(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { activityId } = request.params;
            const { gc } = request.query;
            if (!activityId)
                return response.status(400).send({ message: `Activity ID not provided.` });
            const activity = yield (0, ActivitiesQueries_1.fetchActivity)(activityId, {
                getCourse: !!(+gc)
            });
            if (!activity)
                return response.status(400).send({ message: `Activity not found.` });
            response.status(200).send({ message: `Activity fetched.`, activity });
        }
        catch (err) {
            response.status(500).send({ message: "An error ocurred on our end.", error: err.message });
        }
    });
}
function putActivity(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { activityId } = request.params;
            const data = request.body;
            if (!activityId)
                return response.status(400).send({ message: `Activity ID not provided.` });
            const me = request.user;
            const [accessGranted, requiredRoles] = (0, Access_1.hasAccess)(me, [User_1.UserRole.INSTRUCTOR, User_1.UserRole.ADMINISTRATOR]);
            if (!accessGranted)
                return response.status(401).send({ message: `Missing access. Only users with ${requiredRoles.join(", ")} can access.` });
            const activity = yield (0, ActivitiesQueries_1.updateActivity)(activityId, data);
            if (!activity)
                return response.status(400).send({ message: `Activity not found.` });
            response.status(200).send({ message: `Activity updated.`, activity });
        }
        catch (err) {
            response.status(500).send({ message: "An error ocurred on our end.", error: err.message });
        }
    });
}
function removeActivity(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { activityId } = request.params;
            if (!activityId)
                return response.status(400).send({ message: `Activity ID not provided.` });
            const me = request.user;
            const [accessGranted, requiredRoles] = (0, Access_1.hasAccess)(me, [User_1.UserRole.INSTRUCTOR, User_1.UserRole.ADMINISTRATOR]);
            if (!accessGranted)
                return response.status(401).send({ message: `Missing access. Only users with ${requiredRoles.join(", ")} can access.` });
            const activity = yield (0, ActivitiesQueries_1.deleteActivity)(activityId);
            if (!activity)
                return response.status(400).send({ message: `Activity not found.` });
            response.status(200).send({ message: `Activity deleted.`, activity });
        }
        catch (err) {
            response.status(500).send({ message: "An error ocurred on our end.", error: err.message });
        }
    });
}
