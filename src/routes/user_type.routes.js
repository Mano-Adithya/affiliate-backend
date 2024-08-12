import express from "express";
import verifyUser from "../middlewares/verify-user.middleware.js";
import checkPermission from "../middlewares/check-permission.middleware.js";
import {
  createTypes,
  deleteTypes,
  listTypes,
  updateTypes,
} from "../controllers/user_type.controller.js";

const router = express.Router();

router
  .route("/:id?")
  .get(listTypes)
  .post(verifyUser, checkPermission(["admin"]), createTypes)
  .put(verifyUser, checkPermission(["admin"]), updateTypes)
  .delete(verifyUser, checkPermission(["admin"]), deleteTypes);

export default router;
