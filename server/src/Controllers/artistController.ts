import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { successResponse } from "../Utils/responseMessages";
import Artist from "../Models/artistModel";
import User from "../Models/userModel";
import Tattoo from "../Models/tattooModel";

const registration = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userName, password, address, website, tattooStyle } = req.body;
    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    const artist: any = await Artist.findOne({ userName });
    if (artist) throw new Error("Username already taken.");

    const createArtist = new Artist({
      userName,
      password: hashedPassword,
      address,
      website,
      tattooStyle,
    });

    await createArtist.save();

    // Remove password field from user object
    const { password: _, ...responseUser } = createArtist.toObject();

    res.json(successResponse(responseUser, 200, "Registration successfully."));
  } catch (error) {
    console.log(
      `There was an issue into artistController:registration => ${error}`
    );
    next(error);
  }
};

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

    const artist: any = await Artist.findOne({ userName });

    if (artist) {
      if (hashedPassword !== artist.password) {
        throw new Error("Invalid password.");
      } else {
        const token = jwt.sign(
          {
            user_id: artist._id,
            role: artist.role,
          },
          process.env.TOKEN_KEY as string,
          {
            expiresIn: "12h",
          }
        );

        // Remove password field from user object
        const { password: _, ...responseUser } = artist.toObject();

        res.json(
          successResponse(
            { user: responseUser, token },
            200,
            "Login successfully."
          )
        );
      }
    }

    throw new Error("Artist not found.");
  } catch (error) {
    console.log(`There was an issue into artistController:login => ${error}`);
    next(error);
  }
};

const addUser = async (
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

    const artist: any = await User.findOne({ userName });
    if (artist) {
      throw new Error("Username already taken.");
    }

    const createUser = new User({
      userName,
      password: hashedPassword,
    });
    await createUser.save();
    // Remove password field from user object
    const { password: _, ...responseUser } = createUser.toObject();

    res.json(successResponse(responseUser, 200, "User added successfully."));
  } catch (error) {
    console.log(`There was an issue into artistController:addUser => ${error}`);
    next(error);
  }
};

const addTattoo = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, description } = req.body;
    const filenames = req.filenames;
    const user = req.user;

    const image = `${process.env.APP_BASE_URL}/get/${user.userName}/${filenames}`;

    const newTattoo = new Tattoo({
      name,
      description,
      image,
    });
    await newTattoo.save();

    await Artist.findOneAndUpdate(
      { userName: user.userName },
      { $push: { tattoos: newTattoo._id } }
    );

    res.json(successResponse(newTattoo, 200, "Tattoo added successfully."));
  } catch (error) {
    console.log(
      `There was an issue into artistController:addTattoo => ${error}`
    );
    next(error);
  }
};

export default { registration, login, addUser, addTattoo };
