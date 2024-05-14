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
const userModel_1 = __importDefault(require("../Models/userModel"));
const responseMessages_1 = require("../Utils/responseMessages");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const artistModel_1 = __importDefault(require("../Models/artistModel"));
const user_constant_1 = require("../Utils/user.constant");
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let verifyToken = req.headers["authorization"] || req.body.token || req.query.token;
        if (req.headers["authorization"]) {
            verifyToken = verifyToken.substring(7);
        }
        if (!verifyToken) {
            res.json((0, responseMessages_1.errorResponse)("Authentication Required, please provide a valid token."));
        }
        const jwtUserObj = yield jsonwebtoken_1.default.verify(verifyToken, process.env.TOKEN_KEY);
        let user;
        if (jwtUserObj.role === user_constant_1.USER_ROLES.ADMIN) {
            user = yield artistModel_1.default.findOne({ _id: jwtUserObj.user_id });
        }
        else {
            user = yield userModel_1.default.findOne({ _id: jwtUserObj.user_id });
        }
        if (!user) {
            throw new Error("User Not Found, Please Register to Access this Service");
        }
        req.user = user;
        console.log("Success! Token verification completed successfully.");
        next();
    }
    catch (error) {
        console.log("Oops, there was an issue with token verification." + error);
        next(error);
    }
});
const checkRole = (roles) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (roles.includes(user.role)) {
            next();
        }
        else {
            res
                .status(403)
                .json((0, responseMessages_1.errorResponse)(`Access denied. You must have one of the following roles: ${roles.join(", ")}, but you are currently a ${user.role}.`));
        }
    }
    catch (error) {
        console.log("Error in checking user role:", error);
        next(error);
    }
});
exports.default = { verifyToken, checkRole };
