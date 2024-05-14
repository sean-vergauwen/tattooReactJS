"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const reqBodyMiddleware_1 = __importDefault(require("../Middlewares/reqBodyMiddleware"));
const artistValidation_1 = __importDefault(require("../Validations/artistValidation"));
const artistController_1 = __importDefault(require("../Controllers/artistController"));
const userValidation_1 = __importDefault(require("../Validations/userValidation"));
const user_constant_1 = require("../Utils/user.constant");
const authMiddleware_1 = __importDefault(require("../Middlewares/authMiddleware"));
const multerConfig_1 = __importDefault(require("../Config/multerConfig"));
router.post("/registration", (0, reqBodyMiddleware_1.default)(artistValidation_1.default.registrationValidation), artistController_1.default.registration);
router.post("/artist-login", (0, reqBodyMiddleware_1.default)(userValidation_1.default.loginValidation), artistController_1.default.login);
router.post("/add-user", (0, reqBodyMiddleware_1.default)(userValidation_1.default.loginValidation), authMiddleware_1.default.verifyToken, authMiddleware_1.default.checkRole([user_constant_1.USER_ROLES.ADMIN]), artistController_1.default.addUser);
router.post("/add-tattoo", authMiddleware_1.default.verifyToken, multerConfig_1.default.single("image"), (0, reqBodyMiddleware_1.default)(artistValidation_1.default.addTattooValidation), artistController_1.default.addTattoo);
exports.default = router;
