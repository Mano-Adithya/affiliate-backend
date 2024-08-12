import express from "express";
import verifyUser from "../middlewares/verify-user.middleware.js";
import {
  getDashboardData,
  getRevenueMonth,
} from "../controllers/dashboard.controller.js";

const router = express.Router();

router.route("/").get(verifyUser, getDashboardData);

router.route("/revenue").get(verifyUser, getRevenueMonth);

export default router;
