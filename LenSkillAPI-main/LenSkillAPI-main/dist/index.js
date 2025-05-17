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
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const users_routes_1 = __importDefault(require("./routes/users.routes"));
const courses_routes_1 = __importDefault(require("./routes/courses.routes"));
const attachments_routes_1 = __importDefault(require("./routes/attachments.routes"));
const activities_routes_1 = __importDefault(require("./routes/activities.routes"));
const submissions_routes_1 = __importDefault(require("./routes/submissions.routes"));
(() => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    const rateLimiter = (0, express_rate_limit_1.default)({
        message: `Calm down. You're being rate-limited.`,
        windowMs: 2 * 60 * 1000,
        limit: 100,
        standardHeaders: true,
        legacyHeaders: false
    });
    //Declaracion del puerto
    app.set("PORT", process.env.API_PORT);
    //Aplicar rate limit de solicitudes
    app.use(rateLimiter);
    //Aplicar utilidades
    app.use(express_1.default.json());
    app.use((0, cors_1.default)());
    app.use((0, morgan_1.default)("dev"));
    //Enrutamiento
    const API_V = "/api/v1";
    app.use(`${API_V}/auth`, auth_routes_1.default);
    app.use(`${API_V}/users`, users_routes_1.default);
    app.use(`${API_V}/courses`, courses_routes_1.default);
    app.use(`${API_V}/attachments`, attachments_routes_1.default);
    app.use(`${API_V}/activities`, activities_routes_1.default);
    app.use(`${API_V}/submissions`, submissions_routes_1.default);
    //Iniciar la API
    app.listen(app.get("PORT"), (error) => {
        console.log("\x1b[2J\x1b[H");
        if (error)
            console.log(error);
        console.log(`[API] Backend server running on port ${app.get("PORT")}`);
    });
}))();
