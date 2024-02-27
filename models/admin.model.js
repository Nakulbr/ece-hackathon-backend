const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { appConfig } = require("../config/app.config");

const adminSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    default: "admin",
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  mail: {
    type: String,
    required: true,
  },
});

adminSchema.pre("save", async function (next) {
  try {
    if (!this.password) this.password = appConfig.staffPassword;
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

const adminModel = mongoose.model("Admin", adminSchema);

module.exports = { adminModel };
