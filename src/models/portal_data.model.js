import sequelize from "../configs/db.config.js";
import { Sequelize, DataTypes } from "sequelize";
import { ReferralCode } from "./referral_code.model.js";

export const PortalData = sequelize.define(
  "PortalData",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    referral_code: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    mobile_no: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    portal: {
      type: DataTypes.ENUM("wall360", "fobes", "auction"),
      allowNull: false,
    },
    plan_amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    referral_amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    wallet_amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    referral_percent: {
      type: DataTypes.INTEGER(11),
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
    tableName: "portal_data",
    timestamps: false,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export const PortalRegisterUsers = sequelize.define(
  "PortalRegisterUsers",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    referral_code: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    mobile_no: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    portal: {
      type: DataTypes.ENUM("wall360", "fobes", "auction"),
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
    tableName: "portal_register_users",
    timestamps: false,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

PortalData.belongsTo(ReferralCode, {
  foreignKey: "referral_code",
  targetKey: "code",
});

PortalRegisterUsers.belongsTo(ReferralCode, {
  foreignKey: "referral_code",
  targetKey: "code",
});
