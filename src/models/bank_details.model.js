import sequelize from "../configs/db.config.js";
import { Sequelize, DataTypes } from "sequelize";
import { ReferralCode } from "./referral_code.model.js";

export const BankDetails = sequelize.define(
  "BankDetails",
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
    acc_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    acc_no: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    ifsc_code: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    aadhar_no: {
      type: DataTypes.STRING(50),
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
    tableName: "bank_details",
    timestamps: false,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);
