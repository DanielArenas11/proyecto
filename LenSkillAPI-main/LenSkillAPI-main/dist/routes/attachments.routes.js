"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sessionTokenValidation_1 = require("../middleware/sessionTokenValidation");
const attachments_controller_1 = require("../controllers/attachments.controller");
const multer_1 = require("../modules/multer");
const attachmentRouter = (0, express_1.Router)();
//Asignar funciones a cada ruta - Separar por metodo
//#region For Courses
attachmentRouter.get("/courses/:attachmentId", attachments_controller_1.getCourseAttachment);
attachmentRouter.get("/courses/:courseId/attachments", sessionTokenValidation_1.validateSession, attachments_controller_1.getCourseAttachments);
attachmentRouter.post("/courses/:courseId/upload", sessionTokenValidation_1.validateSession, multer_1.fileUploadMiddleware, attachments_controller_1.registerCourseAttachment);
attachmentRouter.delete("/courses/:attachmentId", sessionTokenValidation_1.validateSession, attachments_controller_1.removeCourseAttachment);
//#region For Activities
attachmentRouter.get("/activities/:attachmentId", attachments_controller_1.getActivityAttachment);
attachmentRouter.get("/activities/:activityId/attachments", sessionTokenValidation_1.validateSession, attachments_controller_1.getActivityAttachments);
attachmentRouter.post("/activities/:activityId/upload", sessionTokenValidation_1.validateSession, multer_1.fileUploadMiddleware, attachments_controller_1.registerActivityAttachment);
attachmentRouter.delete("/activities/:attachmentId", sessionTokenValidation_1.validateSession, attachments_controller_1.removeActivityAttachment);
//#region For Activities
attachmentRouter.get("/submissions/:attachmentId", attachments_controller_1.getSubmissionAttachment);
attachmentRouter.get("/submissions/:submissionId/attachments", sessionTokenValidation_1.validateSession, attachments_controller_1.getSubmissionAttachments);
attachmentRouter.post("/submissions/:submissionId/upload", sessionTokenValidation_1.validateSession, multer_1.fileUploadMiddleware, attachments_controller_1.registerActivityAttachment);
attachmentRouter.delete("/submissions/:attachmentId", sessionTokenValidation_1.validateSession, attachments_controller_1.removeSubmissionAttachment);
exports.default = attachmentRouter;
