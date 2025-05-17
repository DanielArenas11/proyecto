"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sessionTokenValidation_1 = require("../middleware/sessionTokenValidation");
const users_controller_1 = require("../controllers/users.controller");
const userRouter = (0, express_1.Router)();
//Asignar funciones a cada ruta - Separar por metodo
userRouter.get("/", sessionTokenValidation_1.validateSession, users_controller_1.getUsers);
userRouter.get("/:userId", sessionTokenValidation_1.validateSession, users_controller_1.getUser);
exports.default = userRouter;
