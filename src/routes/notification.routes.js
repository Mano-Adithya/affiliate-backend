import express from "express";
import verifyUser from "../middlewares/verify-user.middleware.js";
import {
  deleteAllNotification,
  deleteNotification,
  getCount,
  getNotification,
  updateNotification,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.route("/count").get(verifyUser, getCount);
router.route("/all").delete(verifyUser, deleteAllNotification);
router
  .route("/")
  .get(verifyUser, getNotification)
  .put(verifyUser, updateNotification)
  .delete(verifyUser, deleteNotification);

export default router;
