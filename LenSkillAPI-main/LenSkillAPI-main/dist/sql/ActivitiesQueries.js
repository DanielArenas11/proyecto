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
exports.createActivity = createActivity;
exports.fetchActivities = fetchActivities;
exports.fetchActivity = fetchActivity;
exports.updateActivity = updateActivity;
exports.deleteActivity = deleteActivity;
const Database_1 = __importDefault(require("../schemas/Database"));
const DateFormatter_1 = require("../tools/DateFormatter");
const CoursesQueries_1 = require("./CoursesQueries");
function createActivity(activity) {
    return __awaiter(this, void 0, void 0, function* () {
        yield Database_1.default.query(`insert into activities (activity_id, title, description, course_id, created_at, deadline) values
        ($1, $2, $3, $4, $5, $6)`, [
            activity.id, activity.title, activity.description, activity.course_id,
            new Date(activity.created_at), new Date(activity.deadline)
        ]);
    });
}
function fetchActivities(courseId) {
    return __awaiter(this, void 0, void 0, function* () {
        const collection = {};
        const result = yield Database_1.default.query(`select * from activities where course_id = $1`, [courseId]);
        if (!result.rows[0])
            return {};
        for (const data of result.rows) {
            const activityDTO = {
                id: data.activity_id,
                title: data.title,
                description: data.description,
                course_id: data.course_id,
                created_at: (0, DateFormatter_1.formatToLocale)(data.created_at),
                deadline: (0, DateFormatter_1.formatToLocale)(data.deadline)
            };
            collection[activityDTO.id] = activityDTO;
        }
        return collection;
    });
}
function fetchActivity(activityId, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield Database_1.default.query(`select * from activities where activity_id = $1`, [activityId]);
        if (!result.rows[0])
            return null;
        const data = result.rows[0];
        const activityDTO = {
            id: data.activity_id,
            title: data.title,
            description: data.description,
            created_at: (0, DateFormatter_1.formatToLocale)(data.created_at),
            deadline: (0, DateFormatter_1.formatToLocale)(data.deadline),
        };
        if (options === null || options === void 0 ? void 0 : options.getCourse) {
            const course = yield (0, CoursesQueries_1.fetchCourse)(data.course_id);
            if (!course)
                return activityDTO;
            activityDTO.course = course;
        }
        return activityDTO;
    });
}
function updateActivity(activityId, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const valuesData = Object.entries(options).map(value => { return { name: value[0], value: value[1] }; });
        const setClause = valuesData.map((val, i) => `${val.name} = $${i + 1}`);
        const result = yield Database_1.default.query(`update activities set ${setClause} where activity_id = $${setClause.length + 1} returning *`, [...valuesData.filter(val => val.value).map(val => {
                if (val.name === "deadline")
                    return new Date(val.value);
                return val.value;
            }), activityId]);
        if (!result.rows[0])
            return null;
        const data = result.rows[0];
        const activityDTO = {
            id: data.activity_id,
            title: data.title,
            description: data.description,
            course_id: data.course_id,
            created_at: (0, DateFormatter_1.formatToLocale)(data.created_at),
            deadline: (0, DateFormatter_1.formatToLocale)(data.deadline),
        };
        return activityDTO;
    });
}
function deleteActivity(activityId) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield Database_1.default.query(`delete from activities where activity_id = $1 returning *`, [activityId]);
        if (!result.rows[0])
            return null;
        const data = result.rows[0];
        const activityDTO = {
            id: data.activity_id,
            title: data.title,
            description: data.description,
            course_id: data.course_id,
            created_at: (0, DateFormatter_1.formatToLocale)(data.created_at),
            deadline: (0, DateFormatter_1.formatToLocale)(data.deadline),
        };
        return activityDTO;
    });
}
