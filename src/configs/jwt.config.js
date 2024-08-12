import jsonwebtoken from "jsonwebtoken";

export const generateToken = async (data, expiresIn = "3d") => {
  return jsonwebtoken.sign(data, process.env.JWT_SECRET, { expiresIn });
};
