"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const authRouter = (0, express_1.Router)();
//Asignar funciones a cada ruta - Separar por metodo
authRouter.post("/register", auth_controller_1.register);
authRouter.post("/login", auth_controller_1.login);
exports.default = authRouter;
