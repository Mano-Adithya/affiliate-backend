import expressAsyncHandler from "express-async-handler";
import DataService from "../services/data.service.js";
import { Notifications } from "../models/notifications.model.js";
import { message } from "../lang.js";
import { NotifiactionDTO } from "../dtos/notification.dto.js";
import dateFormat from "../helpers/dateformat.js";
import { Op } from "sequelize";

export const getNotification = expressAsyncHandler(async (req, res) => {
  let where = {};
  const { First_Date, currentDate } = await dateFormat();
  const { id, user_type } = req.user;
  if (user_type) {
    where = {
      user_type,
      user_id: id,
      created_at: { [Op.between]: [First_Date, currentDate] },
    };
  }
  const notificationService = new DataService(Notifications);
  const { rows } = await notificationService.list(where, 1, "inf");
  const count = await Notifications.count({
    where: { read_at: 0, user_type, user_id: id },
  });
  res.json({
    status: true,
    message: message.DATA_SUCCESS,
    data: rows.map((row) => new NotifiactionDTO(row)),
    count,
  });
});

export const getCount = expressAsyncHandler(async (req, res) => {
  const { id, user_type } = req.user;
  const count = await Notifications.count({
    where: { read_at: 0, user_id: id, user_type },
  });
  res.json({
    status: true,
    message: message.DATA_SUCCESS,
    data: { count },
  });
});

export const updateNotification = expressAsyncHandler(async (req, res) => {
  const { id, user_type } = req.user;
  const notificationService = new DataService(Notifications);
  await Notifications.update(
    { read_at: 1 },
    { where: { user_id: id, user_type } }
  );
  // const { rows } = await notificationService.list({ user_id: id, user_type });
  // for (const row of rows) {
  //   await notificationService.update({ id: row.id }, { read_at: 1 });
  // }
  res.json({
    status: true,
    message: message.MESSAGE_READ,
  });
});

export const deleteNotification = expressAsyncHandler(async (req, res) => {
  const { id } = req.body;
  const notificationService = new DataService(Notifications);
  for (const ID of id) {
    await notificationService.delete({ id: ID });
  }
  res.json({
    status: true,
    message: message.DATA_DELETE,
  });
});

export const deleteAllNotification = expressAsyncHandler(async (req, res) => {
  const { id, user_type } = req.user;
  await Notifications.destroy({ where: { user_id: id, user_type } });
  res.json({
    status: true,
    message: message.DATA_DELETE,
  });
});
