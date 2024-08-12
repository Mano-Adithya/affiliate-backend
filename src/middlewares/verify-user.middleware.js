import jsonwebtoken from "jsonwebtoken";
import { errors } from "../lang.js";
import throwError from "../helpers/throw-error.js";
import expressAsyncHandler from "express-async-handler";
const verifyUser = expressAsyncHandler(async (req, res, next) => {
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    const token = req?.headers?.authorization?.split(" ")[1];
    try {
      req.user = jsonwebtoken.verify(token, process.env.JWT_SECRET);
      return next();
    } catch (error) {
      throwError(errors.UNAUTHORIZED, 401);
    }
  } else {
    throwError(errors.NO_TOKEN, 404);
  }
});

export default verifyUser;
