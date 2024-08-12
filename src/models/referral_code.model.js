import sequelize from "../configs/db.config.js";
import { Sequelize, DataTypes } from "sequelize";
import User from "./users.model.js";

export const ReferralCode = sequelize.define(
  "ReferralCode",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      onUpdate: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    tableName: "referral_code",
    timestamps: false,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);



User.belongsTo(ReferralCode, { foreignKey: "id", targetKey: "user_id" });
