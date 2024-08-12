import xlsx from "xlsx";
import csv from "csv-parser";
import { Readable } from "stream";
import User from "../models/users.model.js";
import { UserType } from "../models/user_type.model.js";
import { ReferralCode } from "../models/referral_code.model.js";
import { generateCode } from "../controllers/auth.controller.js";

export async function importExcel(buffer) {
  const workbook = xlsx.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet);

  for (const row of data) {
    const userType = await UserType.findOne({
      where: { user_type: row.user_type },
    });
    const existingUser = await User.findOne({
      where: { email: row.email, mobile_no: row.mobile_no },
    });
    const importData = {
      first_name: row.first_name,
      last_name: row.last_name,
      email: row.email,
      mobile_no: row.mobile_no,
      user_type: userType.id,
      password: row.password,
    };
    if (existingUser) {
      await existingUser.update(importData);
    } else {
      const createUser = await User.create(importData);
      await ReferralCode.create({
        user_id: createUser.id,
        code: generateCode(),
      });
    }
  }
}

export async function importCSV(buffer) {
  const data = [];

  await new Promise((resolve, reject) => {
    Readable.from(buffer)
      .pipe(csv())
      .on("data", (row) => data.push(row))
      .on("end", resolve)
      .on("error", reject);
  });

  for (const row of data) {
    const userType = await UserType.findOne({
      where: { user_type: row.user_type },
    });
    const existingUser = await User.findOne({
      where: { email: row.email, mobile_no: row.mobile_no },
    });
    const importData = {
      first_name: row.first_name,
      last_name: row.last_name,
      email: row.email,
      mobile_no: row.mobile_no,
      user_type: userType.id,
      password: row.password,
    };
    if (existingUser) {
      await existingUser.update(importData);
    } else {
      const createUser = await User.create(importData);
      await ReferralCode.create({
        user_id: createUser.id,
        code: generateCode(),
      });
    }
  }
}
