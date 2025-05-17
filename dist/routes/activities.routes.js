"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sessionTokenValidation_1 = require("../middleware/sessionTokenValidation");
const activities_controller_1 = require("../controllers/activities.controller");
const activitiesRouter = (0, express_1.Router)();
//Asignar funciones a cada ruta - Separar por metodo
activitiesRouter.get("/:activityId", sessionTokenValidation_1.validateSession, activities_controller_1.getActivity);
activitiesRouter.put("/:activityId", sessionTokenValidation_1.validateSession, activities_controller_1.putActivity);
activitiesRouter.post("/", sessionTokenValidation_1.validateSession, activities_controller_1.registerActivity);
activitiesRouter.delete("/:activityId", sessionTokenValidation_1.validateSession, activities_controller_1.removeActivity);
exports.default = activitiesRouter;
