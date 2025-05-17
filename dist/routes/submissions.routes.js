"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sessionTokenValidation_1 = require("../middleware/sessionTokenValidation");
const multer_1 = require("../modules/multer");
const submissions_controller_1 = require("../controllers/submissions.controller");
const submissionRouter = (0, express_1.Router)();
//Asignar funciones a cada ruta - Separar por metodo
submissionRouter.get("/:submissionId", sessionTokenValidation_1.validateSession, submissions_controller_1.getSubmission);
submissionRouter.put("/:submissionId", sessionTokenValidation_1.validateSession, submissions_controller_1.putSubmission);
submissionRouter.post("/", sessionTokenValidation_1.validateSession, multer_1.fileUploadMiddleware, submissions_controller_1.registerSubmission);
submissionRouter.delete("/:submissionId", sessionTokenValidation_1.validateSession, submissions_controller_1.removeSubmission);
exports.default = submissionRouter;
