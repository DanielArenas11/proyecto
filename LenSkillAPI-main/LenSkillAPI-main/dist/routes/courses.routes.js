"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sessionTokenValidation_1 = require("../middleware/sessionTokenValidation");
const courses_controller_1 = require("../controllers/courses.controller");
const coursesRouter = (0, express_1.Router)();
//Asignar funciones a cada ruta - Separar por metodo
coursesRouter.get("/", sessionTokenValidation_1.validateSession, courses_controller_1.getCourses);
coursesRouter.get("/:courseId", sessionTokenValidation_1.validateSession, courses_controller_1.getCourse);
coursesRouter.put("/:courseId", sessionTokenValidation_1.validateSession, courses_controller_1.putCourse);
coursesRouter.post("/", sessionTokenValidation_1.validateSession, courses_controller_1.registerCourse);
coursesRouter.delete("/:courseId", sessionTokenValidation_1.validateSession, courses_controller_1.removeCourse);
// Joining
coursesRouter.get("/:courseId/members", sessionTokenValidation_1.validateSession, courses_controller_1.getCourseMembers);
coursesRouter.post("/:courseId/join", sessionTokenValidation_1.validateSession, courses_controller_1.registerCourseMember);
coursesRouter.post("/:courseId/leave", sessionTokenValidation_1.validateSession, courses_controller_1.unregisterCourseMember);
exports.default = coursesRouter;
