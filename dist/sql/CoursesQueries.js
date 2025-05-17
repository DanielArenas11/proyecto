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
exports.createCourse = createCourse;
exports.fetchCourses = fetchCourses;
exports.fetchCourse = fetchCourse;
exports.updateCourse = updateCourse;
exports.deleteCourse = deleteCourse;
exports.alreadyJoined = alreadyJoined;
exports.joinCourse = joinCourse;
exports.leaveCourse = leaveCourse;
exports.fetchCourseMembers = fetchCourseMembers;
const Database_1 = __importDefault(require("../schemas/Database"));
const DateFormatter_1 = require("../tools/DateFormatter");
const UsersDTO_1 = require("../transfer/UsersDTO");
const ActivitiesQueries_1 = require("./ActivitiesQueries");
const UserQueries_1 = require("./UserQueries");
function createCourse(course) {
    return __awaiter(this, void 0, void 0, function* () {
        yield Database_1.default.query(`insert into courses (course_id, name, description, instructor_id, created_at)
        values ($1, $2, $3, $4, $5)`, [course.id, course.name, course.description, course.instructor_id, new Date(course.created_at)]);
    });
}
function fetchCourses(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const collection = {};
        const instructors = ((options === null || options === void 0 ? void 0 : options.getInstructors) && (yield (0, UserQueries_1.fetchUsers)())) || undefined;
        const result = yield Database_1.default.query(`select * from courses`);
        for (const data of result.rows) {
            if ((options === null || options === void 0 ? void 0 : options.getInstructors) && instructors) {
                const courseDTO = {
                    id: data.course_id,
                    name: data.name,
                    description: data.description,
                    created_at: (0, DateFormatter_1.formatToLocale)(data.created_at)
                };
                const instructorDTO = instructors[data.instructor_id];
                courseDTO.instructor = (0, UsersDTO_1.toAPIUser)(instructorDTO);
                collection[courseDTO.id] = courseDTO;
            }
            else {
                const courseDTO = {
                    id: data.course_id,
                    name: data.name,
                    description: data.description,
                    instructor_id: data.instructor_id,
                    created_at: (0, DateFormatter_1.formatToLocale)(data.created_at)
                };
                collection[courseDTO.id] = courseDTO;
            }
        }
        return collection;
    });
}
function fetchCourse(courseId, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield Database_1.default.query(`select * from courses where course_id = $1`, [courseId]);
        if (!result.rows[0])
            return null;
        const data = result.rows[0];
        const courseDTO = {
            id: data.course_id,
            name: data.name,
            description: data.description,
            created_at: (0, DateFormatter_1.formatToLocale)(data.created_at)
        };
        if (options === null || options === void 0 ? void 0 : options.getInstructor) {
            const userDTO = yield (0, UserQueries_1.fetchUser)(data.instructor_id).then(r => (r !== null && (0, UsersDTO_1.toAPIUser)(r)) || null);
            if (!userDTO)
                return courseDTO;
            courseDTO.instructor = userDTO;
        }
        if (options === null || options === void 0 ? void 0 : options.getActivities) {
            const activityCollection = yield (0, ActivitiesQueries_1.fetchActivities)(courseId);
            courseDTO.activities = activityCollection;
        }
        if (options === null || options === void 0 ? void 0 : options.getMembers) {
            const members = yield fetchCourseMembers(courseId);
            courseDTO.members = members;
        }
        return courseDTO;
    });
}
function updateCourse(courseId, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const valuesData = Object.entries(options).map(value => { return { name: value[0], value: value[1] }; });
        const setClause = valuesData.map((val, i) => `${val.name} = $${i + 1}`);
        const result = yield Database_1.default.query(`update courses set ${setClause} where course_id = $${setClause.length + 1} returning *`, [...valuesData.filter(val => val.value).map(val => val.value), courseId]);
        if (!result.rows[0])
            return null;
        const data = result.rows[0];
        const courseDTO = {
            id: data.course_id,
            name: data.name,
            description: data.description,
            created_at: (0, DateFormatter_1.formatToLocale)(data.created_at),
            instructor_id: data.instructor_id
        };
        return courseDTO;
    });
}
function deleteCourse(courseId) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield Database_1.default.query(`delete from courses where course_id = $1 returning *`, [courseId]);
        if (!result.rows[0])
            return null;
        const data = result.rows[0];
        const courseDTO = {
            id: data.course_id,
            name: data.name,
            description: data.description,
            created_at: (0, DateFormatter_1.formatToLocale)(data.created_at),
            instructor_id: data.instructor_id
        };
        return courseDTO;
    });
}
// Course joining
function alreadyJoined(courseId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield Database_1.default.query(`select * from course_members where user_id = $1 and course_id = $2`, [userId, courseId]);
        return result.rows.length > 0;
    });
}
function joinCourse(courseId, user) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield Database_1.default.query(`insert into course_members (user_id, name, email, role, course_id, joined_at) values ($1, $2, $3, $4, $5, $6) returning *`, [user.id, user.name, user.email, user.role, courseId, new Date(Date.now())]);
        if (!result.rows[0])
            return null;
        const data = result.rows[0];
        const memberDTO = {
            user_id: data.user_id,
            name: data.name,
            email: data.email,
            role: data.role,
            course_id: data.course_id,
            joined_at: (0, DateFormatter_1.formatToLocale)(data.joined_at)
        };
        return memberDTO;
    });
}
function leaveCourse(courseId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield Database_1.default.query(`delete from course_members where user_id = $1 and course_id = $2 returning *`, [userId, courseId]);
        if (!result.rows[0])
            return null;
        const data = result.rows[0];
        const memberDTO = {
            user_id: data.user_id,
            name: data.name,
            email: data.email,
            role: data.role,
            course_id: data.course_id,
            joined_at: (0, DateFormatter_1.formatToLocale)(data.joined_at)
        };
        return memberDTO;
    });
}
function fetchCourseMembers(courseId) {
    return __awaiter(this, void 0, void 0, function* () {
        const collection = {};
        const result = yield Database_1.default.query(`select * from course_members where course_id = $1`, [courseId]);
        if (!result.rows[0])
            return {};
        for (const data of result.rows) {
            const memberDTO = {
                user_id: data.user_id,
                name: data.name,
                email: data.email,
                role: data.role,
                course_id: data.course_id,
                joined_at: (0, DateFormatter_1.formatToLocale)(data.joined_at)
            };
            collection[memberDTO.user_id] = memberDTO;
        }
        return collection;
    });
}
