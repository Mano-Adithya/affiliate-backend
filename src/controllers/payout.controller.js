import expressAsyncHandler from "express-async-handler";
import axios from "axios";
import DataService from "../services/data.service.js";
import { BankDetails } from "../models/bank_details.model.js";
import { errors, message } from "../lang.js";
import throwError from "../helpers/throw-error.js";
import { BankDetailsDto } from "../dtos/user.dto.js";
import User from "../models/users.model.js";
import { PayoutDetails } from "../models/payout_details.model.js";
import sequelize from "../configs/db.config.js";
import { Op } from "sequelize";
import { payourtDetailsDTO } from "../dtos/payout.dto.js";
import { createPayoutNotification } from "../services/notification.serice.js";

export const payoutData = expressAsyncHandler(async (req, res) => {
  const { id } = req.user;
  const { amount } = req.body;
  const razorpayKey = process.env.RAZORPAY_API_KEY;
  const razorpaySecret = process.env.RAZORPAY_SECRET_KEY;
  const auth = Buffer.from(`${razorpayKey}:${razorpaySecret}`).toString(
    "base64"
  );
  const userService = await User.findOne({ where: { id } });
  const bankService = await BankDetails.findOne({ where: { user_id: id } });
  if (!bankService) {
    throwError(errors.BANK_ERROR, 404);
  } else if (userService.wallet === 0) {
    throwError(errors.BALANCE_ERROR, 404);
  } else {
    // Payout data
    const payoutData = {
      account_number: process.env.RAZORPAY_ACC_NO, // Razorpay account number
      amount: amount * 100, // Convert to paise
      currency: "INR",
      mode: "IMPS",
      purpose: "payout",
      fund_account: {
        account_type: "bank_account",
        bank_account: {
          name: bankService?.acc_name,
          ifsc: bankService?.ifsc_code,
          account_number: bankService?.acc_no,
        },
        contact: {
          name: userService?.first_name,
          email: userService?.email,
          contact: userService?.mobile_no,
          type: "employee",
        },
      },
      queue_if_low_balance: true,
    };
    try {
      const response = await axios.post(
        "https://api.razorpay.com/v1/payouts",
        payoutData,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Payout-Idempotency": `idempotency-key-${Date.now()}`,
            Authorization: `Basic ${auth}`,
          },
        }
      );
      const result = await PayoutDetails.create({
        user_id: id,
        payout_id: response?.data?.id,
        entity: response?.data?.entity,
        fund_account_id: response?.data?.fund_account_id,
        fund_account: response?.data?.fund_account,
        amount: response?.data?.amount / 100,
        currency: response?.data?.currency,
        fees: response?.data?.fees / 100,
        tax: response?.data?.tax / 100,
        status: response?.data?.status,
        purpose: response?.data?.purpose,
        mode: response?.data?.mode,
        narration: response?.data?.narration,
        merchant_id: response?.data?.merchant_id,
      });
      await User.update(
        { wallet: sequelize.literal(`wallet - ${result.amount}`) },
        { where: { id: id } }
      );
      await createPayoutNotification(
        `${userService?.first_name} ${userService?.last_name}`,
        amount
      );
      res.json({
        success: true,
        message: message.PAYOUT_SUCCESS,
        // data: response.data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.response ? error.response.data : error.message,
      });
    }
  }
});

export const getPayoutDetails = expressAsyncHandler(async (req, res) => {
  let rows,
    count,
    where = {};
  const { id, user_type } = req.user;
  const page_no = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const payoutService = new DataService(PayoutDetails);
  if (req.query.created_at) {
    const [startDate, endDate] = req.query.created_at.split(",");
    where = {
      created_at: {
        [Op.between]: [
          new Date(`${startDate}T00:00:00`),
          new Date(`${endDate}T23:59:59`),
        ],
      },
    };
  }
  if (req.query.user_id) {
    where = { user_id: req.query.user_id };
  }
  if (user_type === "admin") {
    where = { [Op.and]: [{ ...where }] };
    ({ rows, count } = await payoutService.list(where, page_no, limit));
  } else {
    where = { [Op.and]: [{ ...where }, { user_id: id }] };
    ({ rows, count } = await payoutService.list(where, page_no, limit));
  }
  res.json({
    status: true,
    message: message.DATA_SUCCESS,
    data: rows.map((row) => new payourtDetailsDTO(row)),
    count,
  });
});

export const getSinglePayout = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const payoutService = new DataService(PayoutDetails);
  const result = await payoutService.get({ id });
  if (result) {
    res.json({
      status: true,
      message: message.DATA_SUCCESS,
      data: new payourtDetailsDTO(result),
    });
  }
});

export const getBankDetails = expressAsyncHandler(async (req, res) => {
  const { id, user_type } = req.user;
  const { user_id } = req.query;
  let where;
  if (user_type === "admin") {
    where = { user_id };
  } else {
    where = { user_id: id };
  }
  const bankService = new DataService(BankDetails);
  const result = await bankService.get(where);
  if (result) {
    res.json({
      status: true,
      message: message.DATA_SUCCESS,
      data: new BankDetailsDto(result),
    });
  } else {
    throwError(errors.BANK_ERROR, 404);
  }
});

export const createBankDetails = expressAsyncHandler(async (req, res) => {
  const { id } = req.user;
  const bankService = new DataService(BankDetails);
  const result = await bankService.create({ ...req.body, user_id: id });
  if (result) {
    res.json({
      status: true,
      message: message.DATA_CREATE,
    });
  }
});

export const updateBankDetails = expressAsyncHandler(async (req, res) => {
  const { id } = req.user;
  const { body } = req;
  const bankService = new DataService(BankDetails);
  const checkUser = await bankService.get({ user_id: id });
  if (checkUser) {
    const result = await bankService.update({ id: checkUser.id }, body);
    if (result) {
      res.json({
        status: true,
        message: message.DATA_UPDATE,
      });
    }
  }
});
