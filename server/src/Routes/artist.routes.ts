import express, { Router } from "express";
const router: Router = express.Router();
import requestBodyMiddleware from "../Middlewares/reqBodyMiddleware";
import artistValidation from "../Validations/artistValidation";
import artistController from "../Controllers/artistController";
import userValidation from "../Validations/userValidation";
import { USER_ROLES } from "../Utils/user.constant";
import auth from "../Middlewares/authMiddleware";
import upload from "../Config/multerConfig";

router.post(
  "/registration",
  requestBodyMiddleware(artistValidation.registrationValidation),
  artistController.registration
);

router.post(
  "/artist-login",
  requestBodyMiddleware(userValidation.loginValidation),
  artistController.login
);

router.post(
  "/add-user",
  requestBodyMiddleware(userValidation.loginValidation),
  // auth.verifyToken,
  // auth.checkRole([USER_ROLES.ADMIN]),
  artistController.addUser
);

router.post(
  "/add-tattoo",
  auth.verifyToken,
  upload.single("image"),
  requestBodyMiddleware(artistValidation.addTattooValidation),
  artistController.addTattoo
);

export default router;
