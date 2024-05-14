import { Request, Response, NextFunction } from "express";
import User, { UserInterface } from "../Models/userModel";
import { successResponse, errorResponse } from "../Utils/responseMessages";
import jwt from "jsonwebtoken";
import Artist from "../Models/artistModel";
import { USER_ROLES } from "../Utils/user.constant";

const verifyToken = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let verifyToken: string =
      req.headers["authorization"] || req.body.token || req.query.token;

    if (req.headers["authorization"]) {
      verifyToken = verifyToken.substring(7);
    }
    if (!verifyToken) {
      res.json(
        errorResponse("Authentication Required, please provide a valid token.")
      );
    }

    const jwtUserObj: any = await jwt.verify(
      verifyToken,
      process.env.TOKEN_KEY as string
    );

    let user;
    if (jwtUserObj.role === USER_ROLES.ADMIN) {
      user = await Artist.findOne({ _id: jwtUserObj.user_id });
    } else {
      user = await User.findOne({ _id: jwtUserObj.user_id });
    }

    if (!user) {
      throw new Error("User Not Found, Please Register to Access this Service");
    }

    req.user = user;
    console.log("Success! Token verification completed successfully.");
    next();
  } catch (error) {
    console.log("Oops, there was an issue with token verification." + error);
    next(error);
  }
};

const checkRole =
  (roles: string[]) => async (req: any, res: Response, next: NextFunction) => {
    try {
      const user = req.user;

      if (roles.includes(user.role)) {
        next();
      } else {
        res
          .status(403)
          .json(
            errorResponse(
              `Access denied. You must have one of the following roles: ${roles.join(
                ", "
              )}, but you are currently a ${user.role}.`
            )
          );
      }
    } catch (error) {
      console.log("Error in checking user role:", error);
      next(error);
    }
  };

export default { verifyToken, checkRole };
