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
const userModel_1 = __importDefault(require("../Models/userModel"));
const tattooModel_1 = __importDefault(require("../Models/tattooModel"));
const likeModel_1 = __importDefault(require("../Models/likeModel"));
const commentModel_1 = __importDefault(require("../Models/commentModel"));
const artistModel_1 = __importDefault(require("../Models/artistModel"));
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName, password } = req.body;
        const hashedPassword = crypto_1.default
            .createHash("sha256")
            .update(password)
            .digest("hex");
        const user = yield userModel_1.default.findOne({ userName });
        if (user) {
            if (hashedPassword !== user.password) {
                throw new Error("Invalid password.");
            }
            else {
                const token = jsonwebtoken_1.default.sign({
                    user_id: user._id,
                    role: user.role,
                }, process.env.TOKEN_KEY, {
                    expiresIn: "12h",
                });
                // Remove password field from user object
                const _a = user.toObject(), { password: _ } = _a, responseUser = __rest(_a, ["password"]);
                res.json((0, responseMessages_1.successResponse)({ user: responseUser, token }, 200, "Login successfully."));
            }
        }
        throw new Error("User not found.");
    }
    catch (error) {
        console.log(`There was an issue into userController:login => ${error}`);
        next(error);
    }
});
const getTattoo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const tattoo = yield tattooModel_1.default.findOne({ _id: id }).populate([
            "likes",
            "comments",
        ]);
        if (!tattoo) {
            throw new Error("Tattoo not found");
        }
        res.json((0, responseMessages_1.successResponse)(tattoo, 200, "Tattoo retrieved successfully."));
    }
    catch (error) {
        console.log(`There was an issue into userController:getTattoo => ${error}`);
        next(error);
    }
});
const getAllTattoo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const tattoos = yield tattooModel_1.default.find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .populate(["likes", "comments"]);
        res.json((0, responseMessages_1.successResponse)(tattoos, 200, "Tattoos retrieved successfully."));
    }
    catch (error) {
        console.log(`There was an issue into userController:getAllTattoo => ${error}`);
        next(error);
    }
});
const likeTattoo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const tattoo = yield tattooModel_1.default.findOne({ _id: id });
        if (!tattoo) {
            throw new Error("Tattoo not found");
        }
        const liked = yield likeModel_1.default.findOne({
            tattooId: tattoo._id,
            userId: req.user._id,
        });
        if (liked) {
            res.json((0, responseMessages_1.successResponse)(liked, 200, "Liked successfully."));
        }
        else {
            const newLike = new likeModel_1.default({
                tattooId: tattoo._id,
                userId: req.user._id,
                like: true,
            });
            yield userModel_1.default.findOneAndUpdate({ _id: req.user._id }, { $push: { tattoos: tattoo._id } });
            yield tattooModel_1.default.findOneAndUpdate({ _id: tattoo._id }, { $push: { likes: newLike._id } });
            yield newLike.save();
            res.json((0, responseMessages_1.successResponse)(newLike, 200, "Liked successfully."));
        }
    }
    catch (error) {
        console.log(`There was an issue into userController:likeTattoo => ${error}`);
        next(error);
    }
});
const allLikeTattoos = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tattoos = yield userModel_1.default.findOne({ _id: req.user._id })
            .select("-password")
            .populate("tattoos");
        res.json((0, responseMessages_1.successResponse)(tattoos, 200, "All liked tattoos retrieved successfully."));
    }
    catch (error) {
        console.log(`There was an issue into userController:allLikeTattoos => ${error}`);
        next(error);
    }
});
const comment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, comment } = req.body;
        const tattoo = yield tattooModel_1.default.findOne({ _id: id });
        if (!tattoo) {
            throw new Error("Tattoo not found");
        }
        // const existingComment = await Comment.findOne({
        //   tattooId: tattoo._id,
        //   userId: req.user._id,
        // });
        // if (existingComment) {
        //   res.json(successResponse(existingComment, 200, "Comment successfully."));
        // } else {
        const newComment = new commentModel_1.default({
            tattooId: tattoo._id,
            userId: req.user._id,
            userName: req.user.userName,
            comment: comment,
        });
        yield tattooModel_1.default.findOneAndUpdate({ _id: tattoo._id }, { $push: { comments: newComment._id } });
        yield newComment.save();
        res.json((0, responseMessages_1.successResponse)(newComment, 200, "Comment successfully."));
        // }
    }
    catch (error) {
        console.log(`There was an issue into userController:comment => ${error}`);
        next(error);
    }
});
const getByStyle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tattooStyle } = req.body;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const regexPattern = new RegExp(tattooStyle, "i");
        const artists = yield artistModel_1.default.find({ tattooStyle: regexPattern })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .populate("tattoos");
        res.json((0, responseMessages_1.successResponse)(artists, 200, "All artists retrieved by style."));
    }
    catch (error) {
        console.log(`There was an issue into userController:getByStyle => ${error}`);
        next(error);
    }
});
exports.default = {
    login,
    getTattoo,
    getAllTattoo,
    likeTattoo,
    allLikeTattoos,
    comment,
    getByStyle,
};
