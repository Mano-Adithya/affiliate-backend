import expressAsyncHandler from "express-async-handler";
import DataService from "../services/data.service.js";
import User from "../models/users.model.js";
import {
  PortalData,
  PortalRegisterUsers,
} from "../models/portal_data.model.js";
import { ReferralCode } from "../models/referral_code.model.js";
import { message } from "../lang.js";
import { Op } from "sequelize";
import dateFormat from "../helpers/dateformat.js";

export const getDashboardData = expressAsyncHandler(async (req, res) => {
  const { id, user_type } = req.user;
  let where = {};
  const userService = new DataService(PortalData, [ReferralCode]);
  const walletService = new DataService(User, [ReferralCode]);
  const regUsersService = new DataService(PortalRegisterUsers, [ReferralCode]);
  let Totalusers,
    Totalearnings,
    wall360Data,
    fobesData,
    auctionData,
    Total,
    wall360Earnings,
    fobesEarnings,
    auctionEarnings,
    ThisMonth,
    ThisMonthEarnings,
    TotalDSA,
    TotalInfluencer,
    wall360RegUsers,
    auctionRegUsers,
    fobesRegUsers;

  const { firstDate, currentDate } = await dateFormat();

  if (req.query.date_filter) {
    const [startDate, endDate] = req.query.date_filter.split(",");
    where = {
      created_at: {
        [Op.between]: [
          new Date(`${startDate}T00:00:00`),
          new Date(`${endDate}T23:59:59`),
        ],
      },
    };
  }

  if (user_type === "admin") {
    [
      Totalusers,
      TotalDSA,
      TotalInfluencer,
      ThisMonth,
      wall360Data,
      fobesData,
      auctionData,
      wall360RegUsers,
      fobesRegUsers,
      auctionRegUsers,
    ] = await Promise.all([
      walletService.list(where, 1, "inf"),
      walletService.list(
        { [Op.and]: [{ ...where }, { user_type: 1 }] },
        1,
        "inf"
      ),
      walletService.list(
        { [Op.and]: [{ ...where }, { user_type: 2 }] },
        1,
        "inf"
      ),
      userService.list(
        {
          created_at: { [Op.between]: [firstDate, currentDate] },
        },
        1,
        "inf"
      ),
      userService.list(
        { [Op.and]: [{ ...where }, { portal: "wall360" }] },
        1,
        "inf"
      ),
      userService.list(
        { [Op.and]: [{ ...where }, { portal: "fobes" }] },
        1,
        "inf"
      ),
      userService.list(
        { [Op.and]: [{ ...where }, { portal: "auction" }] },
        1,
        "inf"
      ),
      regUsersService.list(
        { [Op.and]: [{ ...where }, { portal: "wall360" }] },
        1,
        "inf"
      ),
      regUsersService.list(
        { [Op.and]: [{ ...where }, { portal: "fobes" }] },
        1,
        "inf"
      ),
      regUsersService.list(
        { [Op.and]: [{ ...where }, { portal: "auction" }] },
        1,
        "inf"
      ),
    ]);
    wall360Earnings = wall360Data?.rows.reduce((acc, current) => {
      acc = acc + current.referral_amount;
      return acc;
    }, 0);
    fobesEarnings = fobesData?.rows.reduce((acc, current) => {
      acc = acc + current.referral_amount;
      return acc;
    }, 0);
    auctionEarnings = auctionData?.rows.reduce((acc, current) => {
      acc = acc + current.referral_amount;
      return acc;
    }, 0);
    Total = wall360Earnings + fobesEarnings + auctionEarnings;
    ThisMonthEarnings = ThisMonth?.rows.reduce((acc, current) => {
      acc = acc + current.referral_amount;
      return acc;
    }, 0);
  } else {
    [
      Totalusers,
      Totalearnings,
      ThisMonth,
      wall360Data,
      fobesData,
      auctionData,
      wall360RegUsers,
      fobesRegUsers,
      auctionRegUsers,
    ] = await Promise.all([
      // userService.list({ "$ReferralCode.user_id$": id, where }, 1, "inf"),
      userService.list(
        { [Op.and]: [{ ...where }, { "$ReferralCode.user_id$": id }] },
        1,
        "inf"
      ),
      walletService.get({ [Op.and]: [{ ...where }, { id }] }, 1, "inf"),
      userService.list(
        {
          "$ReferralCode.user_id$": id,
          created_at: { [Op.between]: [firstDate, currentDate] },
        },
        1,
        "inf"
      ),
      userService.list(
        {
          [Op.and]: [
            { ...where },
            { "$ReferralCode.user_id$": id, portal: "wall360" },
          ],
        },
        1,
        "inf"
      ),
      userService.list(
        {
          [Op.and]: [
            { ...where },
            { "$ReferralCode.user_id$": id, portal: "fobes" },
          ],
        },
        1,
        "inf"
      ),
      userService.list(
        {
          [Op.and]: [
            { ...where },
            { "$ReferralCode.user_id$": id, portal: "auction" },
          ],
        },
        1,
        "inf"
      ),
      regUsersService.list(
        {
          [Op.and]: [
            { ...where },
            { "$ReferralCode.user_id$": id, portal: "wall360" },
          ],
        },
        1,
        "inf"
      ),
      regUsersService.list(
        {
          [Op.and]: [
            { ...where },
            { "$ReferralCode.user_id$": id, portal: "fobes" },
          ],
        },
        1,
        "inf"
      ),
      regUsersService.list(
        {
          [Op.and]: [
            { ...where },
            { "$ReferralCode.user_id$": id, portal: "auction" },
          ],
        },
        1,
        "inf"
      ),
    ]);
    Total = Totalearnings?.wallet;
    wall360Earnings = wall360Data.rows.reduce(
      (acc, current) => acc + current.wallet_amount,
      0
    );
    fobesEarnings = fobesData.rows.reduce((acc, current) => {
      acc = acc + current.wallet_amount;
      return acc;
    }, 0);
    auctionEarnings = auctionData.rows.reduce(
      (acc, current) => acc + current.wallet_amount,
      0
    );
    ThisMonthEarnings = ThisMonth.rows.reduce((acc, current) => {
      acc = acc + current.wallet_amount;
      return acc;
    }, 0);
  }

  const data = {
    total_users: Totalusers?.count ?? 0,
    total_reg_users:
      wall360RegUsers.count + fobesRegUsers.count + auctionRegUsers.count ?? 0,
    total_dsa: TotalDSA?.count ?? 0,
    total_influencer: TotalInfluencer?.count ?? 0,
    total_earnings: Total ?? 0,
    total_earnings_month: ThisMonthEarnings ?? 0,
    referral_code: Totalearnings?.ReferralCode?.code,
    portal: {
      wall360: {
        earnings: wall360Earnings ?? 0,
        users: wall360Data.count ?? 0,
        reg_users: wall360RegUsers.count ?? 0,
      },
      fobes: {
        earnings: fobesEarnings ?? 0,
        users: fobesData.count ?? 0,
        reg_users: fobesRegUsers.count ?? 0,
      },
      auction: {
        earnings: auctionEarnings ?? 0,
        users: auctionData.count ?? 0,
        reg_users: auctionRegUsers.count ?? 0,
      },
    },
  };
  res.json({
    status: true,
    message: message.DATA_SUCCESS,
    data,
  });
});

export const getRevenueMonth = expressAsyncHandler(async (req, res) => {
  const { id, user_type } = req.user;
  const options = { year: "numeric", month: "2-digit" };
  const formatter = new Intl.DateTimeFormat("en-US", options);
  const now = new Date();

  // Get current month and the past 5 months
  const months = [];
  for (let i = 0; i < 6; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const [month, year] = formatter.format(date).split("/");
    months.push({ month, year });
  }

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const revenueService = new DataService(PortalData, [
    { model: ReferralCode, where: { user_id: id } },
  ]);
  const revenues = await Promise.all(
    months.map(async ({ month, year }) => {
      const startDate = `${year}-${month}-01 00:00:00`;
      const endDate = new Date(year, month, 0);
      const endDateString = `${year}-${month}-${endDate.getDate()} 23:59:59`;

      // Fetch revenue data from the database
      const { rows } = await revenueService.list({
        created_at: {
          [Op.between]: [startDate, endDateString],
        },
      });

      const revenue = rows.reduce((acc, current) => {
        acc = acc + current.wallet_amount;
        return acc;
      }, 0);

      return {
        month: parseInt(month, 10) - 1,
        total_revenue: revenue,
      };
    })
  );
  const formattedRevenues = revenues.map(({ month, total_revenue }) => ({
    name: monthNames[month],
    uv: total_revenue,
  }));
  res.json({
    status: true,
    message: message.DATA_SUCCESS,
    data: formattedRevenues,
  });
});
