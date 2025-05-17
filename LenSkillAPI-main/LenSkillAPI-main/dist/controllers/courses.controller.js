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
exports.registerCourse = registerCourse;
exports.getCourses = getCourses;
exports.getCourse = getCourse;
exports.putCourse = putCourse;
exports.removeCourse = removeCourse;
exports.registerCourseMember = registerCourseMember;
exports.unregisterCourseMember = unregisterCourseMember;
exports.getCourseMembers = getCourseMembers;
const Access_1 = require("../tools/Access");
const Course_1 = __importDefault(require("../schemas/Course"));
const CoursesQueries_1 = require("../sql/CoursesQueries");
const User_1 = require("../schemas/User");
function registerCourse(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = request.body;
            const me = request.user;
            const [accessGranted, requiredRoles] = (0, Access_1.hasAccess)(me, [User_1.UserRole.INSTRUCTOR, User_1.UserRole.ADMINISTRATOR]);
            if (!accessGranted)
                return response.status(401).send({ message: `Missing access. Only users with ${requiredRoles.join(", ")} can access.` });
            //Asignar automaticamente la ID del instructor al que creo el curso
            data.instructor_id = me.id;
            const course = new Course_1.default(data);
            yield (0, CoursesQueries_1.createCourse)(course);
            yield (0, CoursesQueries_1.joinCourse)(course.id, me);
            response.status(201).send({ message: `Course created.`, course });
        }
        catch (err) {
            response.status(500).send({ message: "An error ocurred on our end.", error: err.message });
        }
    });
}
function getCourses(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { gi } = request.query;
            const courses = yield (0, CoursesQueries_1.fetchCourses)({
                getInstructors: !!(+gi)
            });
            response.status(200).send({ message: `Courses fetched.`, courses });
        }
        catch (err) {
            response.status(500).send({ message: "An error ocurred on our end.", error: err.message });
        }
    });
}
function getCourse(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { courseId } = request.params;
            const { gi, gac, gm } = request.query;
            const course = yield (0, CoursesQueries_1.fetchCourse)(courseId, {
                getInstructor: !!(+gi),
                getActivities: !!(+gac),
                getMembers: !!(+gm)
            });
            response.status(200).send({ message: `Course fetched.`, course });
        }
        catch (err) {
            response.status(500).send({ message: "An error ocurred on our end.", error: err.message });
        }
    });
}
function putCourse(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const me = request.user;
            const { courseId } = request.params;
            const data = request.body;
            const [accessGranted, requiredRoles] = (0, Access_1.hasAccess)(me, [User_1.UserRole.ADMINISTRATOR]);
            if (!accessGranted)
                return response.status(401).send({ message: `Missing access. Only users with ${requiredRoles.join(", ")} can access.` });
            const course = yield (0, CoursesQueries_1.updateCourse)(courseId, data);
            if (!course)
                return response.status(404).send({ message: `Course not found.` });
            response.status(200).send({ message: `Course updated.`, course });
        }
        catch (err) {
            response.status(500).send({ message: "An error ocurred on our end.", error: err.message });
        }
    });
}
function removeCourse(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const me = request.user;
            const { courseId } = request.params;
            const [accessGranted, requiredRoles] = (0, Access_1.hasAccess)(me, [User_1.UserRole.ADMINISTRATOR]);
            if (!accessGranted)
                return response.status(401).send({ message: `Missing access. Only users with ${requiredRoles.join(", ")} can access.` });
            const course = yield (0, CoursesQueries_1.deleteCourse)(courseId);
            if (!course)
                return response.status(404).send({ message: `Course not found.` });
            response.status(200).send({ message: `Course deleted.`, course });
        }
        catch (err) {
            response.status(500).send({ message: "An error ocurred on our end.", error: err.message });
        }
    });
}
// Members
function registerCourseMember(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const me = request.user;
            const { courseId } = request.params;
            const joined = yield (0, CoursesQueries_1.alreadyJoined)(courseId, me.id);
            if (joined)
                return response.status(403).send({ message: `User already in this course.` });
            const member = yield (0, CoursesQueries_1.joinCourse)(courseId, me);
            response.status(200).send({ message: `Joined course.`, member });
        }
        catch (err) {
            response.status(500).send({ message: "An error ocurred on our end.", error: err.message });
        }
    });
}
function unregisterCourseMember(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const me = request.user;
            const { courseId } = request.params;
            const joined = yield (0, CoursesQueries_1.alreadyJoined)(courseId, me.id);
            if (!joined)
                return response.status(403).send({ message: `User not in this course.` });
            const member = yield (0, CoursesQueries_1.leaveCourse)(courseId, me.id);
            response.status(200).send({ message: `Left course.`, member });
        }
        catch (err) {
            response.status(500).send({ message: "An error ocurred on our end.", error: err.message });
        }
    });
}
function getCourseMembers(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const me = request.user;
            const { courseId } = request.params;
            const joined = yield (0, CoursesQueries_1.alreadyJoined)(courseId, me.id);
            if (!joined)
                return response.status(403).send({ message: `User not in this course.` });
            const members = yield (0, CoursesQueries_1.fetchCourseMembers)(courseId);
            response.status(200).send({ message: `Course members fetched.`, members });
        }
        catch (err) {
            response.status(500).send({ message: "An error ocurred on our end.", error: err.message });
        }
    });
}
