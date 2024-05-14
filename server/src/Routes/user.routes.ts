import express, { Router } from "express";
const router: Router = express.Router();
import requestBodyMiddleware from "../Middlewares/reqBodyMiddleware";
import userValidation from "../Validations/userValidation";
import userController from "../Controllers/userController";
import requestParamsMiddleware from "../Middlewares/reqParamsMiddleware";
import authMiddleware from "../Middlewares/authMiddleware";

router.post(
  "/all-by-style",
  authMiddleware.verifyToken,
  requestBodyMiddleware(userValidation.styleValidation),
  userController.getByStyle
);

export default router;
