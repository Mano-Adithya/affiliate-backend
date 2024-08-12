import { Sequelize, DataTypes } from "sequelize";
import sequelize from "../configs/db.config.js";

export const PayoutDetails = sequelize.define(
  "PayoutDetails",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    payout_id: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    entity: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    fund_account_id: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    fund_account: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    fees: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    tax: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    purpose: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    mode: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    narration: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    merchant_id: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "PayoutDetail",
    tableName: "payout_details",
    timestamps: false,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);
