 import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import { errors, message } from "../lang.js";
dotenv.config();

const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_BASE,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  dialect: "mysql",
});

const seqelizeConnect = async () => {
  try {
    await sequelize.authenticate();
    console.log(message.CONNECTION_SUCCESS);
  } catch (error) {
    console.error(errors.CONNECTION_ERROR, error);
  }
};

seqelizeConnect();

export default sequelize;
