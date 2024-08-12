import sequelize from "../configs/db.config.js";
import { Sequelize, DataTypes } from "sequelize";
import User from "./users.model.js";

export const UserType = sequelize.define(
  "UserType",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 1,
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
    tableName: "user_type",
    timestamps: false,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export const ReferralPercent = sequelize.define(
  "ReferralPercent",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_type_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    portal: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    percentage: {
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
    tableName: "referral_percent",
    timestamps: false,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

User.belongsTo(UserType, { foreignKey: "user_type", targetKey: "id" });

UserType.hasMany(ReferralPercent, { foreignKey: "user_type_id" });
