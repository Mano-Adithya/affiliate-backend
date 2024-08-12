import { Sequelize, DataTypes } from "sequelize";
import sequelize from "../configs/db.config.js";
import bcrypt from "bcrypt";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING(50),
    },
    last_name: {
      type: DataTypes.STRING(50),
    },
    email: {
      type: DataTypes.STRING(100),
    },
    mobile_no: {
      type: DataTypes.STRING(30),
    },
    user_type: {
      type: DataTypes.INTEGER(11),
      defaultValue: 1,
    },
    password: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    profile_pic: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    user_data: {
      type: DataTypes.STRING(40),
    },
    wallet: {
      type: DataTypes.INTEGER(50),
      defaultValue: 0,
    },
    status: {
      type: DataTypes.INTEGER(11),
      defaultValue: 1,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      onUpdate: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    createdAt: "created_at",
    updatedAt: "updated_at",
    underscored: true,
  }
);

User.beforeCreate(async (user, option) => {
  if (user.password) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
  }
});
User.beforeUpdate(async (user, option) => {
  if (user.password) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
  }
});

export default User;
