import express from "express";
import verifyUser from "../middlewares/verify-user.middleware.js";
import {
  codeCheck,
  createData,
  createRegisterUsers,
  getAllCodes,
  getData,
  getRegUsers,
  getSingleUser,
  importUsers,
} from "../controllers/portal_data.controller.js";

import multer from "multer";
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: function (req, file, cb) {
    const allowedMimes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/csv",
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error("Invalid file type. Only Excel and CSV files are allowed."),
        false
      );
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const router = express.Router();

router
  .route("/create-reg")
  .get(verifyUser, getRegUsers)
  .post(createRegisterUsers);

router.route("/code").get(getAllCodes).post(codeCheck);

router.route("/").post(createData).get(verifyUser, getData);

router.route("/:id").get(verifyUser, getSingleUser);

router.route("/import").post(verifyUser, upload.single("file"), importUsers);

export default router;
