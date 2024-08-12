import express from "express";
import { validate } from "../middlewares/validation.middleware.js";
import { body } from "express-validator";
import verifyUserMiddleware from "../middlewares/verify-user.middleware.js";
import {
  adminLogin,
  googleLogin,
  passwordUpdate,
  profileUpdate,
  registration,
  requestOtp,
  userBlock,
  userDelete,
  userLogin,
  verifyOtp,
  verifyUserData,
  verifyUserOTP,
} from "../controllers/auth.controller.js";
import verifyUser from "../middlewares/verify-user.middleware.js";

const router = express.Router();

router.post(
  "/register",
  validate([
    body("email").trim().isEmail(),
    body("mobile_no").trim().isLength({ min: 10, max: 10 }),
  ]),
  registration
);

router.post(
  "/request_otp",
  validate([
    body("email").optional().trim().isEmail(),
    body("mobile_no").optional().trim().isLength({ min: 10, max: 10 }),
  ]),
  requestOtp
);

router.post(
  "/verify_otp",
  validate([
    body("email").optional().trim().isEmail(),
    body("mobile_no").optional().trim().isLength({ min: 10, max: 10 }),
  ]),
  verifyOtp
);

router.post(
  "/login",
  validate([
    body("email").optional().trim().isEmail(),
    body("mobile_no").optional().trim().isLength({ min: 10, max: 10 }),
    body("password").isLength({ min: 6 }),
  ]),
  userLogin
);

router.post(
  "/google_login",
  validate([body("email").trim().isEmail()]),
  googleLogin
);

router.post(
  "/admin/login",
  validate([body("email").trim().isEmail()]),
  body("password").isLength({ min: 6 }),
  adminLogin
);

router.delete("/delete/:id?", verifyUser, userDelete);
router.put("/block/:id", verifyUser, userBlock);

router.put("/update/:id?", verifyUser, profileUpdate);

router.put(
  "/password/:id?",
  validate([body("password").isLength({ min: 6 })]),
  verifyUser,
  passwordUpdate
);

router.route("/verify").post(verifyUserData);

router.route("/verify-otp").post(verifyUser, verifyUserOTP);

export default router;
