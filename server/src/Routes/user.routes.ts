import express, { Router } from "express";
const router: Router = express.Router();
import requestBodyMiddleware from "../Middlewares/reqBodyMiddleware";
import userValidation from "../Validations/userValidation";
import userController from "../Controllers/userController";
import requestParamsMiddleware from "../Middlewares/reqParamsMiddleware";
import authMiddleware from "../Middlewares/authMiddleware";

router.post(
  "/user-login",
  requestBodyMiddleware(userValidation.loginValidation),
  userController.login
);

router.get(
  "/tattoo/:id",
  authMiddleware.verifyToken,
  requestParamsMiddleware(userValidation.idValidation),
  userController.getTattoo
);

router.get(
  "/all-tattoos",
  authMiddleware.verifyToken,
  userController.getAllTattoo
);

router.get(
  "/like/:id",
  authMiddleware.verifyToken,
  requestParamsMiddleware(userValidation.idValidation),
  userController.likeTattoo
);

router.get(
  "/all-likes",
  authMiddleware.verifyToken,
  userController.allLikeTattoos
);

router.post(
  "/comment",
  authMiddleware.verifyToken,
  requestBodyMiddleware(userValidation.commentValidation),
  userController.comment
);

router.post(
  "/all-by-style",
  authMiddleware.verifyToken,
  requestBodyMiddleware(userValidation.styleValidation),
  userController.getByStyle
);

export default router;
