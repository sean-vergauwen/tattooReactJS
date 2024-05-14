"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const connectDB_1 = __importDefault(require("./Config/connectDB"));
const Routes_1 = __importDefault(require("./Routes"));
const cors_1 = __importDefault(require("cors"));
const path = __importStar(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/", Routes_1.default);
app.use("/get", express_1.default.static(path.join(__dirname, "/Uploads")));
app.all("*", (req, res, next) => {
    const err = new Error(`Can't find ${req.originalUrl} on the server.`);
    err.status = "Fail to load..";
    err.statusCode = 404;
    next(err);
});
app.use((error, req, res, next) => {
    error.statusCode = error.statusCode || 400;
    error.status = error.status || "Error";
    res.status(error.statusCode).json({
        success: false,
        status: error.statusCode,
        message: error.message,
        data: null
    });
});
app.listen(port, () => {
    (0, connectDB_1.default)(DATABASE_URL);
    console.log(`Server is running on port number : ${port}`);
});
