import expressAsyncHandler from "express-async-handler";
import DataService from "../services/data.service.js";
import {
  PortalData,
  PortalRegisterUsers,
} from "../models/portal_data.model.js";
import throwError from "../helpers/throw-error.js";
import { errors, message } from "../lang.js";
import { ReferralCode } from "../models/referral_code.model.js";
import User from "../models/users.model.js";
import { ReferralPercent, UserType } from "../models/user_type.model.js";
import sequelize from "../configs/db.config.js";
import { Op, where } from "sequelize";
import { PortalRegUserDto, PortalUserDto } from "../dtos/portal_user.dto.js";
import { importCSV, importExcel } from "../services/user_import.service.js";
import {
  createPlanNotification,
  createRegNotification,
} from "../services/notification.serice.js";

export const codeCheck = expressAsyncHandler(async (req, res) => {
  const { body } = req;
  const portalService = new DataService(PortalData);
  const userService = new DataService(User, [
    { model: UserType, include: { model: ReferralPercent, separate: true } },
    ReferralCode,
  ]);
  const checkReferral = await portalService.get({
    portal: body.portal,
    referral_percent: body.referral_percent,
    referral_code: body.referral_code,
    email: body.email,
    mobile_no: body.mobile_no,
  });
  if (checkReferral) {
    {
      throwError(errors.ALREADY_USED);
    }
  } else {
    const checkCode = await userService.get({
      "$ReferralCode.code$": body.referral_code,
    });
    if (checkCode) {
      const matchingReferralPercent = checkCode.UserType.ReferralPercents.find(
        (referralPercent) =>
          referralPercent.portal === body.portal &&
          referralPercent.percentage === body.referral_percent
      );
      if (matchingReferralPercent) {
        res.json({
          status: true,
          message: message.REFERRAL_APPLIED,
        });
      } else {
        throwError(errors.INVALID_CODE);
      }
    } else {
      throwError(errors.INVALID_CODE);
    }
  }
});

export const createData = expressAsyncHandler(async (req, res) => {
  const { body } = req;
  const portalService = new DataService(PortalData);
  const userService = new DataService(User, [
    { model: UserType, include: { model: ReferralPercent, separate: true } },
    ReferralCode,
  ]);
  const checkReferral = await portalService.get({
    portal: body.portal,
    referral_percent: body.referral_percent,
    referral_code: body.referral_code,
    email: body.email,
    mobile_no: body.mobile_no,
  });
  if (checkReferral) {
    {
      throwError(errors.ALREADY_USED);
    }
  } else {
    const checkCode = await userService.get({
      "$ReferralCode.code$": body.referral_code,
    });
    if (checkCode) {
      const matchingReferralPercent = checkCode.UserType.ReferralPercents.find(
        (referralPercent) =>
          referralPercent.portal === body.portal &&
          referralPercent.percentage === body.referral_percent
      );
      if (matchingReferralPercent) {
        const storeData = await portalService.create({
          wallet_amount: body.plan_amount - body.referral_amount,
          ...body,
        });
        if (storeData) {
          await createPlanNotification(
            storeData.name,
            storeData.portal,
            checkCode?.UserType?.user_type,
            checkCode?.id,
            storeData?.referral_code
          );
          await userService.update(
            { id: checkCode.id },
            { wallet: sequelize.literal(`wallet + ${storeData.wallet_amount}`) }
          );
          res.json({
            status: true,
            message: message.REFERRAL_APPLIED,
          });
        }
      } else {
        throwError(errors.INVALID_CODE);
      }
    } else {
      throwError(errors.INVALID_CODE);
    }
  }
});

export const getData = expressAsyncHandler(async (req, res) => {
  let rows, count;
  const { user_type, id } = req.user;
  const page_no = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  let excludedParams = ["page", "limit", "like"];
  let where = { ...req.query };

  if (req.query.user_id) {
    where = { "$ReferralCode.user_id$": req.query.user_id };
  }
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

  if (req.query.like) {
    where = {
      ...where,
      [Op.or]: [
        { name: { [Op.like]: `${req.query.like}%` } },
        { email: { [Op.like]: `${req.query.like}%` } },
        { mobile_no: { [Op.like]: `${req.query.like}%` } },
        { portal: { [Op.like]: `${req.query.like}%` } },
        { referral_code: { [Op.like]: `${req.query.like}%` } },
      ],
    };
  }

  excludedParams.forEach((item) => {
    delete where[item];
  });

  const portalService = new DataService(PortalData, [ReferralCode]);
  if (user_type === "admin") {
    ({ rows, count } = await portalService.list(where, page_no, limit));
  } else {
    where = { [Op.and]: [{ ...where }, { "$ReferralCode.user_id$": id }] };
    ({ rows, count } = await portalService.list(where, page_no, limit));
  }
  res.json({
    status: true,
    message: message.DATA_SUCCESS,
    data: rows.map((row) => new PortalUserDto(row)),
    count,
  });
});

export const getSingleUser = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const userService = new DataService(PortalData);
  const users = await userService.get({ id });
  if (users) {
    res.json({
      status: true,
      message: message.DATA_SUCCESS,
      data: new PortalUserDto(users),
    });
  } else {
    throwError(errors.USER_NOT);
  }
});

export const getAllCodes = expressAsyncHandler(async (req, res) => {
  const { portal, referral_code } = req.query;
  let where = {};
  const CodesService = new DataService(User, [
    {
      model: UserType,
      include: {
        model: ReferralPercent,
        where: { portal },
        separate: true,
        attributes: ["percentage"],
      },
    },
    { model: ReferralCode, where: { code: referral_code } },
  ]);
  const { rows, count } = await CodesService.list(where, 1, "inf");
  if (
    !rows ||
    !rows[0] ||
    !rows[0].UserType ||
    !rows[0].UserType.ReferralPercents ||
    !rows[0].UserType.ReferralPercents[0]
  ) {
    throwError("Invalid portal or code", 401);
  }
  res.json({
    status: true,
    message: message.DATA_SUCCESS,
    data: { percentage: rows[0].UserType.ReferralPercents[0].percentage },
    count,
  });
});

export const importUsers = expressAsyncHandler(async (req, res) => {
  const file = req.file;
  const fileType = file.mimetype;
  if (file) {
    if (
      fileType ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      fileType === "application/vnd.ms-excel"
    ) {
      await importExcel(file.buffer);
      res.json({
        status: true,
        message: message.USER_IMPORT,
      });
    } else if (fileType === "text/csv") {
      await importCSV(file.buffer);
      res.json({
        status: true,
        message: message.USER_IMPORT,
      });
    } else {
      throwError(errors.FORMAT_ERROR, 401);
    }
  }
});

export const createRegisterUsers = expressAsyncHandler(async (req, res) => {
  const { body } = req;
  const registerUsers = new DataService(PortalRegisterUsers);
  const userService = new DataService(User, [ReferralCode, UserType]);
  const checkCode = await userService.get({
    "$ReferralCode.code$": body.referral_code,
  });
  if (checkCode) {
    const checkUser = await registerUsers.get({
      email: body.email,
      mobile_no: body.mobile_no,
      portal: body.portal,
    });
    if (checkUser) {
      throwError(errors.ALREADY_USED, 404);
    } else {
      const result = await registerUsers.create(body);
      await createRegNotification(
        result.name,
        result.portal,
        checkCode?.UserType?.user_type,
        checkCode?.id,
        body?.referral_code
      );
      if (result) {
        res.json({
          status: true,
          message: message.DATA_CREATE,
        });
      }
    }
  } else {
    throwError(errors.INVALID_CODE, 404);
  }
});

export const getRegUsers = expressAsyncHandler(async (req, res) => {
  let rows, count;
  const { user_type, id } = req.user;
  const page_no = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  let excludedParams = ["page", "limit", "like"];
  let where = { ...req.query };

  if (req.query.user_id) {
    where = { "$ReferralCode.user_id$": req.query.user_id };
  }

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

  if (req.query.like) {
    where = {
      ...where,
      [Op.or]: [
        { name: { [Op.like]: `${req.query.like}%` } },
        { email: { [Op.like]: `${req.query.like}%` } },
        { mobile_no: { [Op.like]: `${req.query.like}%` } },
        { portal: { [Op.like]: `${req.query.like}%` } },
        { referral_code: { [Op.like]: `${req.query.like}%` } },
      ],
    };
  }

  excludedParams.forEach((item) => {
    delete where[item];
  });

  const portalService = new DataService(PortalRegisterUsers, [ReferralCode]);
  if (user_type === "admin") {
    ({ rows, count } = await portalService.list(where, page_no, limit));
  } else {
    where = { [Op.and]: [{ ...where }, { "$ReferralCode.user_id$": id }] };
    ({ rows, count } = await portalService.list(where, page_no, limit));
  }
  res.json({
    status: true,
    message: message.DATA_SUCCESS,
    data: rows.map((row) => new PortalRegUserDto(row)),
    count,
  });
});
