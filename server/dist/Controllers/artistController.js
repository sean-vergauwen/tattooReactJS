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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const responseMessages_1 = require("../Utils/responseMessages");
const artistModel_1 = __importDefault(require("../Models/artistModel"));
const userModel_1 = __importDefault(require("../Models/userModel"));
const tattooModel_1 = __importDefault(require("../Models/tattooModel"));
const registration = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName, password, address, website, tattooStyle } = req.body;
        const hashedPassword = crypto_1.default
            .createHash("sha256")
            .update(password)
            .digest("hex");
        const artist = yield artistModel_1.default.findOne({ userName });
        if (artist)
            throw new Error("Username already taken.");
        const createArtist = new artistModel_1.default({
            userName,
            password: hashedPassword,
            address,
            website,
            tattooStyle,
        });
        yield createArtist.save();
        // Remove password field from user object
        const _a = createArtist.toObject(), { password: _ } = _a, responseUser = __rest(_a, ["password"]);
        res.json((0, responseMessages_1.successResponse)(responseUser, 200, "Registration successfully."));
    }
    catch (error) {
        console.log(`There was an issue into artistController:registration => ${error}`);
        next(error);
    }
});
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName, password } = req.body;
        const hashedPassword = crypto_1.default
            .createHash("sha256")
            .update(password)
            .digest("hex");
        const artist = yield artistModel_1.default.findOne({ userName });
        if (artist) {
            if (hashedPassword !== artist.password) {
                throw new Error("Invalid password.");
            }
            else {
                const token = jsonwebtoken_1.default.sign({
                    user_id: artist._id,
                    role: artist.role,
                }, process.env.TOKEN_KEY, {
                    expiresIn: "12h",
                });
                // Remove password field from user object
                const _b = artist.toObject(), { password: _ } = _b, responseUser = __rest(_b, ["password"]);
                res.json((0, responseMessages_1.successResponse)({ user: responseUser, token }, 200, "Login successfully."));
            }
        }
        throw new Error("Artist not found.");
    }
    catch (error) {
        console.log(`There was an issue into artistController:login => ${error}`);
        next(error);
    }
});
const addUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName, password } = req.body;
        const hashedPassword = crypto_1.default
            .createHash("sha256")
            .update(password)
            .digest("hex");
        const artist = yield userModel_1.default.findOne({ userName });
        if (artist) {
            throw new Error("Username already taken.");
        }
        const createUser = new userModel_1.default({
            userName,
            password: hashedPassword,
        });
        yield createUser.save();
        // Remove password field from user object
        const _c = createUser.toObject(), { password: _ } = _c, responseUser = __rest(_c, ["password"]);
        res.json((0, responseMessages_1.successResponse)(responseUser, 200, "User added successfully."));
    }
    catch (error) {
        console.log(`There was an issue into artistController:addUser => ${error}`);
        next(error);
    }
});
const addTattoo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description } = req.body;
        const filenames = req.filenames;
        const user = req.user;
        const image = `${process.env.APP_BASE_URL}/get/${user.userName}/${filenames}`;
        const newTattoo = new tattooModel_1.default({
            name,
            description,
            image,
        });
        yield newTattoo.save();
        yield artistModel_1.default.findOneAndUpdate({ userName: user.userName }, { $push: { tattoos: newTattoo._id } });
        res.json((0, responseMessages_1.successResponse)(newTattoo, 200, "Tattoo added successfully."));
    }
    catch (error) {
        console.log(`There was an issue into artistController:addTattoo => ${error}`);
        next(error);
    }
});
exports.default = { registration, login, addUser, addTattoo };
