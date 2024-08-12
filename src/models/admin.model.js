import sequelize from "../configs/db.config.js";
import { Sequelize, DataTypes } from "sequelize";
import bcrypt from "bcrypt";

const Admin = sequelize.define(
  "Admin",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    mobile_no: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(200),
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
    tableName: "admin",
    timestamps: false,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

Admin.beforeCreate(async (admin, option) => {
  if (admin.password) {
    const hashedPassword = await bcrypt.hash(admin.password, 10);
    admin.password = hashedPassword;
  }
});
Admin.beforeUpdate(async (admin, option) => {
  if (admin.password) {
    const hashedPassword = await bcrypt.hash(admin.password, 10);
    admin.password = hashedPassword;
  }
});
export default Admin;
