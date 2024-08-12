import expressAsyncHandler from "express-async-handler";
import DataService from "../services/data.service.js";
import User from "../models/users.model.js";
import { errors, message } from "../lang.js";
import { generateToken } from "../configs/jwt.config.js";
import throwError from "../helpers/throw-error.js";
import Admin from "../models/admin.model.js";
import sendSms from "../helpers/sms.js";
import bcrypt from "bcrypt";
import { ReferralCode } from "../models/referral_code.model.js";
import { ReferralPercent, UserType } from "../models/user_type.model.js";
import { UserDto } from "../dtos/user.dto.js";
import sendEmail from "../helpers/email.js";
import sendOtp from "../views/otp-mail.js";

export const verifyUserData = expressAsyncHandler(async (req, res) => {
  let findOne;
  const { email, mobile_no } = req.body;
  const userService = new DataService(User);
  let otp = generateOTP();
  if (email) {
    findOne = await userService.get({ email });
    if (!findOne) {
      sendEmailOtp({ to: email, otp, name: "User" });
    }
  } else if (mobile_no) {
    findOne = await userService.get({ mobile_no });
    if (!findOne) {
      await sendSms(mobile_no, otp);
    }
  }
  if (!findOne) {
    res.json({
      status: true,
      message: message.DATA_SUCCESS,
      token: await generateToken({ email, otp }),
    });
  } else {
    throwError(errors.USER_EXIST);
  }
});

export const verifyUserOTP = expressAsyncHandler(async (req, res) => {
  let check;
  const { otp, email, mobile_no } = req.user;
  if (otp === req.body.otp) {
    res.json({
      status: true,
      message: message.OTP_VERIFY,
    });
  } else {
    throwError(errors.OTP_FAILED, 404);
  }
});

export const registration = expressAsyncHandler(async (req, res) => {
  const { first_name, last_name, email, mobile_no, user_type } = req.body;
  const authService = new DataService(User);
  const codeService = new DataService(ReferralCode);
  const userService = new DataService(User, [
    { model: UserType, include: { model: ReferralPercent, separate: true } },
    ReferralCode,
  ]);
  const checkUser = await authService.get({ email, mobile_no });
  if (checkUser) {
    throwError(errors.USER_EXIST, 409);
  } else {
    const result = await authService.create(req.body);
    await codeService.create({
      user_id: result.id,
      code: generateCode(),
    });
    if (result) {
      const response = await userService.get({ id: result.id });
      res.json(await generateData(response));
    }
  }
});

export const requestOtp = expressAsyncHandler(async (req, res) => {
  let checkUser, updateUser;
  const { email, mobile_no } = req.body;
  const authService = new DataService(User);
  const otp = generateOTP();
  if (email) {
    checkUser = await authService.get({ email });
    if (checkUser) {
      if (checkUser.user_data != "5555") {
        sendEmailOtp({ to: email, otp, name: checkUser.first_name });
        updateUser = await authService.update({ email }, { user_data: otp });
      } else if (checkUser.status === 0) {
        throwError(errors.ACCOUNT_BLOCK, 401);
      }
    } else {
      throwError(errors.USER_NOT, 404);
    }
  } else if (mobile_no) {
    checkUser = await authService.get({ mobile_no });
    // console.log(checkUser, "checkUser");
    if (checkUser) {
      if (checkUser.user_data != "5555") {
        await sendSms(mobile_no, otp);
        updateUser = await authService.update(
          { mobile_no },
          { user_data: otp }
        );
      } else if (checkUser.status === 0) {
        throwError(errors.ACCOUNT_BLOCK, 401);
      }
    } else {
      throwError(errors.USER_NOT, 404);
    }
  }
  if (checkUser) {
    res.json({
      status: true,
      message: message.OTP_SENT,
    });
  }
});

export const verifyOtp = expressAsyncHandler(async (req, res) => {
  let checkUser;
  const { email, mobile_no, otp } = req.body;
  const authService = new DataService(User);
  const userService = new DataService(User, [
    { model: UserType, include: { model: ReferralPercent, separate: true } },
    ReferralCode,
  ]);
  if (email) {
    checkUser = await authService.get({ email, user_data: otp });
  } else if (mobile_no) {
    checkUser = await authService.get({ mobile_no, user_data: otp });
  }
  if (checkUser) {
    const response = await userService.get({ id: checkUser.id });
    res.json(await generateData(response));
  } else {
    throwError(errors.OTP_FAILED, 401);
  }
});

export const googleLogin = expressAsyncHandler(async (req, res) => {
  const { email } = req.body;
  let checkUser;
  const authService = new DataService(User);
  const codeService = new DataService(ReferralCode);
  const userService = new DataService(User, [
    { model: UserType, include: { model: ReferralPercent, separate: true } },
    ReferralCode,
  ]);
  if (email) {
    checkUser = await authService.get({ email });
    if (checkUser) {
      if (checkUser.status === 0) {
        throwError(errors.ACCOUNT_BLOCK, 401);
      } else {
        const response = await userService.get({ id: checkUser.id });
        res.json(await generateData(response));
      }
    } else {
      const createUser = await authService.create(req.body);
      await codeService.create({
        user_id: createUser.id,
        code: generateCode(),
      });
      if (createUser) {
        const response = await userService.get({ id: createUser.id });
        res.json(await generateData(response));
      }
    }
  }
});

export const userDelete = expressAsyncHandler(async (req, res) => {
  const { mobile_no } = req.body;
  const { id } = req.params;
  const { user_type } = req.user;
  let deleteUser;
  const authService = new DataService(User);
  let checkuser;
  if (user_type === "admin") {
    checkuser = await authService.get({ id });
    if (checkuser) {
      deleteUser = await authService.delete({ id });
      res.json({
        status: true,
        message: message.USER_DELETE,
      });
    } else {
      throwError(errors.USER_NOT, 401);
    }
  } else {
    checkuser = await authService.get({ mobile_no });
    if (checkuser) {
      deleteUser = await authService.delete({ mobile_no });
      res.json({
        status: true,
        message: message.USER_DELETE,
      });
    } else {
      throwError(errors.USER_NOT, 401);
    }
  }
});

export const userBlock = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const userService = new DataService(User);
  const user = await userService.get({ id });
  if (user) {
    const blockuser = await userService.update(
      { id },
      { status: !user.status }
    );
    if (blockuser.status === false) {
      res.json({
        status: true,
        message: message.USER_BLOCK,
      });
    } else if (blockuser.status === true) {
      res.json({
        status: true,
        message: message.USER_UNBLOCK,
      });
    }
  } else {
    throwError(errors.USER_NOT, 401);
  }
});

export const profileUpdate = expressAsyncHandler(async (req, res) => {
  let updateUser;
  const { id, user_type } = req.user;
  const { body } = req;
  let checkUser;
  const authService = new DataService(User);
  if (user_type === "admin") {
    checkUser = await authService.get({ id: req.params.id });
  } else {
    checkUser = await authService.get({ id });
  }
  if (checkUser) {
    updateUser = await authService.update({ id: checkUser.id }, body);
    res.json({
      status: true,
      message: message.DATA_UPDATE,
    });
  } else {
    throwError(errors.USER_NOT, 401);
  }
});

export const passwordUpdate = expressAsyncHandler(async (req, res) => {
  const { body } = req;
  const { id, user_type } = req.user;
  let checkUser;
  const authService = new DataService(User);
  if (user_type === "admin") {
    checkUser = await authService.get({ id: req.params.id });
  } else {
    checkUser = await authService.get({ id });
  }
  if (checkUser) {
    const updatePassword = await authService.update({ id: checkUser.id }, body);
    if (updatePassword) {
      res.json({
        status: true,
        message: message.PASSWORD_UPDATE,
      });
    }
  } else {
    throwError(errors.USER_NOT, 401);
  }
});

export const userLogin = expressAsyncHandler(async (req, res) => {
  const { email, mobile_no, password } = req.body;
  const authService = new DataService(User);
  const userService = new DataService(User, [
    { model: UserType, include: { model: ReferralPercent, separate: true } },
    ReferralCode,
  ]);
  if (email) {
    const checkUser = await authService.get({ email });
    if (checkUser) {
      if (checkUser.status === 0) {
        throwError(errors.ACCOUNT_BLOCK, 401);
      } else {
        if (await bcrypt.compare(password, checkUser.password)) {
          const response = await userService.get({ id: checkUser.id });
          res.json(await generateData(response));
        } else {
          throwError(errors.INVALID_PASSWORD, 401);
        }
      }
    } else {
      throwError(errors.USER_NOT, 404);
    }
  }
  if (mobile_no) {
    const checkUser = await authService.get({ mobile_no });
    if (checkUser) {
      if (checkUser.status === 0) {
        throwError(errors.ACCOUNT_BLOCK, 401);
      } else {
        if (await bcrypt.compare(password, checkUser.password)) {
          const response = await userService.get({ id: checkUser.id });
          res.json(await generateData(response));
        } else {
          throwError(errors.INVALID_PASSWORD, 401);
        }
      }
    } else {
      throwError(errors.USER_NOT, 404);
    }
  }
});

export const adminLogin = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const adminService = new DataService(Admin);
  if (email) {
    const checkUser = await adminService.get({ email });
    if (checkUser) {
      if (await bcrypt.compare(password, checkUser.password)) {
        res.json({
          status: true,
          message: message.LOGIN_SUCCESS,
          token: await generateToken({ id: checkUser.id, user_type: "admin" }),
          data: {
            name: checkUser?.name,
            email: checkUser.email,
            mobile_no: checkUser.mobile_no,
          },
        });
      }
    }
  }
});

async function generateData(result) {
  return {
    status: true,
    message: message.LOGIN_SUCCESS,
    token: await generateToken({
      id: result?.id,
      user_type: result?.UserType?.user_type,
    }),
    data: new UserDto(result),
  };
}

function generateOTP() {
  const characters = "0123456789";
  let otp = "";
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    otp += characters.charAt(randomIndex);
  }
  return otp;
}

export function generateCode() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }
  return code;
}

const sendEmailOtp = ({ to, otp, name }) => {
  return sendEmail({
    from: process.env.MAIL_USER,
    to: to,
    subject: "One Time Verification - Albion Affliate",
    html: sendOtp(otp, name),
  });
};
