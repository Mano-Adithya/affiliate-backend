import sequelize from "../configs/db.config.js";
import { Sequelize, DataTypes } from "sequelize";

export const Notifications = sequelize.define(
  "Notifications",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    content: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    user_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    read_at: {
      type: DataTypes.INTEGER(11),
      defaultValue: 0,
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
    tableName: "notifications",
    timestamps: false,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);
