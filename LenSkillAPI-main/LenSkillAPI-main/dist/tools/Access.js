"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasAccess = hasAccess;
function hasAccess(user, accessTo) { return [accessTo.some(r => r === user.role), accessTo]; }
//Validacion de acceso
// const [ accessGranted, requiredRoles ] = hasAccess(request.user!, [ UserRole.ADMINISTRATOR ]);
// if(!accessGranted) return response.status(401).send({ message: `Missing access. Only users with ${requiredRoles.join(", ")} can access.` });
