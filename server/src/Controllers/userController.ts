import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { successResponse } from "../Utils/responseMessages";
import User from "../Models/userModel";
import Tattoo from "../Models/tattooModel";
import Like from "../Models/likeModel";
import Comment from "../Models/commentModel";
import Artist from "../Models/artistModel";

const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userName, password } = req.body;
    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    const user: any = await User.findOne({ userName });

    if (user) {
      if (hashedPassword !== user.password) {
        throw new Error("Invalid password.");
      } else {
        const token = jwt.sign(
          {
            user_id: user._id,
            role: user.role,
          },
          process.env.TOKEN_KEY as string,
          {
            expiresIn: "12h",
          }
        );

        // Remove password field from user object
        const { password: _, ...responseUser } = user.toObject();

        res.json(
          successResponse(
            { user: responseUser, token },
            200,
            "Login successfully."
          )
        );
      }
    }

    throw new Error("User not found.");
  } catch (error) {
    console.log(`There was an issue into userController:login => ${error}`);
    next(error);
  }
};

const getTattoo = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const tattoo: any = await Tattoo.findOne({ _id: id }).populate([
      "likes",
      "comments",
    ]);
    if (!tattoo) {
      throw new Error("Tattoo not found");
    }
    res.json(successResponse(tattoo, 200, "Tattoo retrieved successfully."));
  } catch (error) {
    console.log(`There was an issue into userController:getTattoo => ${error}`);
    next(error);
  }
};

const getAllTattoo = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const tattoos = await Tattoo.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate(["likes", "comments"]);

    res.json(successResponse(tattoos, 200, "Tattoos retrieved successfully."));
  } catch (error) {
    console.log(
      `There was an issue into userController:getAllTattoo => ${error}`
    );
    next(error);
  }
};

const likeTattoo = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const tattoo: any = await Tattoo.findOne({ _id: id });

    if (!tattoo) {
      throw new Error("Tattoo not found");
    }

    const liked = await Like.findOne({
      tattooId: tattoo._id,
      userId: req.user._id,
    });

    if (liked) {
      res.json(successResponse(liked, 200, "Liked successfully."));
    } else {
      const newLike = new Like({
        tattooId: tattoo._id,
        userId: req.user._id,
        like: true,
      });

      await User.findOneAndUpdate(
        { _id: req.user._id },
        { $push: { tattoos: tattoo._id } }
      );

      await Tattoo.findOneAndUpdate(
        { _id: tattoo._id },
        { $push: { likes: newLike._id } }
      );

      await newLike.save();

      res.json(successResponse(newLike, 200, "Liked successfully."));
    }
  } catch (error) {
    console.log(
      `There was an issue into userController:likeTattoo => ${error}`
    );
    next(error);
  }
};

const allLikeTattoos = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tattoos: any = await User.findOne({ _id: req.user._id })
      .select("-password")
      .populate("tattoos");

    res.json(
      successResponse(tattoos, 200, "All liked tattoos retrieved successfully.")
    );
  } catch (error) {
    console.log(
      `There was an issue into userController:allLikeTattoos => ${error}`
    );
    next(error);
  }
};

const comment = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id, comment } = req.body;
    const tattoo: any = await Tattoo.findOne({ _id: id });

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
    const newComment = new Comment({
      tattooId: tattoo._id,
      userId: req.user._id,
      userName: req.user.userName,
      comment: comment,
    });

    await Tattoo.findOneAndUpdate(
      { _id: tattoo._id },
      { $push: { comments: newComment._id } }
    );

    await newComment.save();

    res.json(successResponse(newComment, 200, "Comment successfully."));
    // }
  } catch (error) {
    console.log(`There was an issue into userController:comment => ${error}`);
    next(error);
  }
};

const getByStyle = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { tattooStyle } = req.body;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;
    const regexPattern = new RegExp(tattooStyle, "i");

    const artists = await Artist.find({ tattooStyle: regexPattern })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("tattoos");

    res.json(successResponse(artists, 200, "All artists retrieved by style."));
  } catch (error) {
    console.log(
      `There was an issue into userController:getByStyle => ${error}`
    );
    next(error);
  }
};

export default {
  login,
  getTattoo,
  getAllTattoo,
  likeTattoo,
  allLikeTattoos,
  comment,
  getByStyle,
};
