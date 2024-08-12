import expressAsyncHandler from "express-async-handler";
import DataService from "../services/data.service.js";
import { ReferralPercent, UserType } from "../models/user_type.model.js";
import { message } from "../lang.js";
import { UserTypeDto } from "../dtos/user_type.dto.js";
import throwError from "../helpers/throw-error.js";

export const listTypes = expressAsyncHandler(async (req, res) => {
  let where = {};
  const usertypeService = new DataService(UserType, [
    { model: ReferralPercent, separate: true },
  ]);
  const { rows, count } = await usertypeService.list(where);
  res.json({
    status: true,
    message: message.DATA_SUCCESS,
    data: rows.map((row) => new UserTypeDto(row)),
    count,
  });
});

export const createTypes = expressAsyncHandler(async (req, res) => {
  const { body } = req;
  const userService = new DataService(UserType);
  try {
    const create = await userService.create({ user_type: body.user_type });
    await Promise.all(
      body.portal.map((portal) => {
        return ReferralPercent.create({
          user_type_id: create.id,
          ...portal,
        });
      })
    );
    res.json({
      status: true,
      message: message.DATA_CREATE,
    });
  } catch (error) {
    throwError(error);
  }
});

export const updateTypes = expressAsyncHandler(async (req, res) => {
  const { body } = req;
  const { id } = req.params;
  const userService = new DataService(UserType);
  const updatedType = await userService.update(
    { id },
    { user_type: body?.user_type }
  );
  const portalUpdates = body.portal.map((portal) => {
    return {
      id: portal.id,
      user_type_id: id,
      portal: portal.portal,
      percentage: portal.percentage,
    };
  });
  await ReferralPercent.bulkCreate(portalUpdates, {
    updateOnDuplicate: ["portal", "percentage"],
  });
  res.json({
    status: true,
    message: message.DATA_UPDATE,
  });
});

export const deleteTypes = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const userService = new DataService(UserType, [ReferralPercent]);
  const deleteUser = await userService.delete({ id });
  if (deleteUser) {
    res.json({
      status: true,
      message: message.DATA_DELETE,
    });
  }
});
