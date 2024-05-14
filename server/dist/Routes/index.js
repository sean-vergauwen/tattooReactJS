"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const artist_routes_1 = __importDefault(require("./artist.routes"));
const user_routes_1 = __importDefault(require("./user.routes"));
router.get("/", (req, res) => {
    res.status(200).send("Hello! This is the home page of Tattoo server!");
});
router.use("/artist", artist_routes_1.default);
router.use("/user", user_routes_1.default);
exports.default = router;
