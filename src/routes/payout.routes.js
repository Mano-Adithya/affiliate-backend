import express from "express";
import verifyUser from "../middlewares/verify-user.middleware.js";
import {
  createBankDetails,
  getBankDetails,
  getPayoutDetails,
  getSinglePayout,
  payoutData,
  updateBankDetails,
} from "../controllers/payout.controller.js";

const router = express.Router();

router
  .route("/bank_details")
  .get(verifyUser, getBankDetails)
  .post(verifyUser, createBankDetails)
  .put(verifyUser, updateBankDetails);

router
  .route("/")
  .get(verifyUser, getPayoutDetails)
  .post(verifyUser, payoutData);

router.route("/get/:id").get(verifyUser, getSinglePayout);

export default router;
