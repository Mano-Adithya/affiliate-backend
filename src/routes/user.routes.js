import express from "express";
import verifyUser from "../middlewares/verify-user.middleware.js";
import {
  getUser,
  getUsers,
  getuserID,
  walletAmount,
} from "../controllers/user.controller.js";
import checkPermission from "../middlewares/check-permission.middleware.js";

const router = express.Router();

router.route("/").get(verifyUser, getUser);
router.route("/wallet").get(verifyUser, walletAmount);
router.route("/list").get(verifyUser, checkPermission(["admin"]), getUsers);
router
  .route("/list/:id")
  .get(verifyUser, checkPermission(["admin"]), getuserID);

export default router;
