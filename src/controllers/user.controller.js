import expressAsyncHandler from "express-async-handler";
import DataService from "../services/data.service.js";
import User from "../models/users.model.js";
import { message } from "../lang.js";
import { ReferralCode } from "../models/referral_code.model.js";
import { ReferralPercent, UserType } from "../models/user_type.model.js";
import { UserDto } from "../dtos/user.dto.js";
import { Op } from "sequelize";
import { PortalData } from "../models/portal_data.model.js";
import dateFormat from "../helpers/dateformat.js";

export const getUsers = expressAsyncHandler(async (req, res) => {
  const { firstDate, currentDate } = await dateFormat();

  const page_no = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  let excludedParams = ["page", "limit", "like", "revenue_at"];
  let where = { ...req.query };
  let TotalEarnings, ThisMonthEarnings;

  if (where["like"]) {
    where = {
      ...where,
      [Op.or]: [
        { first_name: { [Op.like]: `${req.query.like}%` } },
        { last_name: { [Op.like]: `${req.query.like}%` } },
        { email: { [Op.like]: `${req.query.like}%` } },
        { mobile_no: { [Op.like]: `${req.query.like}%` } },
        { "$UserType.user_type$": { [Op.like]: `${req.query.like}%` } },
      ],
    };
  }

  excludedParams.forEach((item) => {
    delete where[item];
  });
  const userService = new DataService(User, [
    { model: UserType, include: { model: ReferralPercent, separate: true } },
    ReferralCode,
  ]);
  const CodeService = new DataService(PortalData, [ReferralCode]);
  const { rows, count } = await userService.list(where, page_no, limit);

  for (const row of rows) {
    let revenueWhere = { referral_code: row?.ReferralCode?.code };
    if (req.query.revenue_at) {
      const [startDate, endDate] = req.query.revenue_at.split(",");
      revenueWhere = {
        ...revenueWhere,
        created_at: {
          [Op.between]: [
            new Date(`${startDate}T00:00:00`),
            new Date(`${endDate}T23:59:59`),
          ],
        },
      };
    }
    [TotalEarnings, ThisMonthEarnings] = await Promise.all([
      CodeService.list(revenueWhere, 1, "inf"),
      CodeService.list(
        {
          referral_code: row?.ReferralCode?.code,
          created_at: { [Op.between]: [firstDate, currentDate] },
        },
        1,
        "inf"
      ),
    ]);
    row.total_earnings = TotalEarnings.rows.reduce((acc, current) => {
      acc = acc + current.wallet_amount;
      return acc;
    }, 0);
    row.this_month_earnings = ThisMonthEarnings.rows.reduce((acc, current) => {
      acc = acc + current.wallet_amount;
      return acc;
    }, 0);
  }
  res.json({
    status: true,
    message: message.DATA_SUCCESS,
    data: rows.map((row) => ({
      ...new UserDto(row),
      total_earnings: row.total_earnings,
      this_month_earnings: row.this_month_earnings,
    })),
    count,
  });
});

export const getuserID = expressAsyncHandler(async (req, res) => {
  let TotalEarnings, ThisMonthEarnings;
  const { firstDate, currentDate } = await dateFormat();

  const { id } = req.params;
  const CodeService = new DataService(PortalData, [ReferralCode]);
  const userService = new DataService(User, [
    { model: UserType, include: { model: ReferralPercent, separate: true } },
    ReferralCode,
  ]);
  const getUser = await userService.get({ id });
  [TotalEarnings, ThisMonthEarnings] = await Promise.all([
    CodeService.list({ "$ReferralCode.user_id$": id }, 1, "inf"),
    CodeService.list(
      {
        "$ReferralCode.user_id$": id,
        created_at: { [Op.between]: [firstDate, currentDate] },
      },
      1,
      "inf"
    ),
  ]);
  const total_earnings = TotalEarnings.rows.reduce((acc, current) => {
    acc = acc + current.wallet_amount;
    return acc;
  }, 0);
  const this_month_earnings = ThisMonthEarnings.rows.reduce((acc, current) => {
    acc = acc + current.wallet_amount;
    return acc;
  }, 0);
  if (getUser) {
    res.json({
      status: true,
      message: message.DATA_SUCCESS,
      data: {
        ...new UserDto(getUser),
        total_earnings: total_earnings,
        this_month_earnings: this_month_earnings,
      },
    });
  }
});

export const getUser = expressAsyncHandler(async (req, res) => {
  const { id } = req.user;
  const userService = new DataService(User, [
    { model: UserType, include: { model: ReferralPercent, separate: true } },
    { model: ReferralCode },
  ]);
  const user = await userService.get({ id });
  res.json({
    status: true,
    message: message.DATA_SUCCESS,
    data: new UserDto(user),
  });
});

export const walletAmount = expressAsyncHandler(async (req, res) => {
  const { id } = req.user;
  let TotalEarnings, ThisMonthEarnings, CurrentBalance;
  const { firstDate, currentDate } = await dateFormat();

  const CodeService = new DataService(PortalData, [ReferralCode]);
  const userService = new DataService(User);
  let revenueWhere = { "$ReferralCode.user_id$": id };
  if (req.query.revenue_at) {
    const [startDate, endDate] = req.query.revenue_at.split(",");
    revenueWhere = {
      ...revenueWhere,
      created_at: {
        [Op.between]: [
          new Date(`${startDate}T00:00:00`),
          new Date(`${endDate}T23:59:59`),
        ],
      },
    };
  }
  [TotalEarnings, ThisMonthEarnings, CurrentBalance] = await Promise.all([
    CodeService.list(revenueWhere, 1, "inf"),
    CodeService.list(
      {
        "$ReferralCode.user_id$": id,
        created_at: { [Op.between]: [firstDate, currentDate] },
      },
      1,
      "inf"
    ),
    userService.get({ id }),
  ]);
  const total_earnings = TotalEarnings.rows.reduce((acc, current) => {
    acc = acc + current.wallet_amount;
    return acc;
  }, 0);
  const this_month_earnings = ThisMonthEarnings.rows.reduce((acc, current) => {
    acc = acc + current.wallet_amount;
    return acc;
  }, 0);

  res.json({
    status: true,
    message: message.DATA_SUCCESS,
    data: {
      total_earnings,
      this_month_earnings,
      current_balance: CurrentBalance?.wallet ?? 0,
    },
  });
});
