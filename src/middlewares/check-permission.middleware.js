import expressAsyncHandler from "express-async-handler";
import throwError from "../helpers/throw-error.js";
import { errors } from "../lang.js";

const checkPermission = (roles = []) => {
  return expressAsyncHandler(async (req, res, next) => {
    // console.log(req.user);
    if (
      roles.includes(req?.user?.user_type) ||
      req?.params?.user_type === req?.user?.user_type
    ) {
      next();
    } else {
      throwError(errors.ACCESS_DENIED, 403);
    }
  });
};
export default checkPermission;
