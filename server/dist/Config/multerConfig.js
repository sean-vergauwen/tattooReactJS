"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const userName = req.user.userName;
        const uploadPath = path_1.default.join(__dirname, `../Uploads/${userName}`);
        fs_1.default.mkdirSync(uploadPath, {
            recursive: true,
        });
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const date = Date.now();
        const filename = date + path_1.default.extname(file.originalname);
        if (!req.filenames) {
            req.filenames = filename;
        }
        cb(null, filename);
    },
});
const upload = (0, multer_1.default)({
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ["image/jpg", "image/png", "image/jpeg"];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            //   cb(new Error("Only .png, .jpg, and .jpeg files are allowed"), false);
            cb(new Error("Only .png, .jpg, and .jpeg files are allowed"));
        }
    },
    limits: { fileSize: 10000000 },
    storage: storage,
});
exports.default = upload;
