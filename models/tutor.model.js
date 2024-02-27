const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { appConfig } = require("../config/app.config");

const tutorSchema = new mongoose.Schema({
  id: {
    type: String,
    require: true,
    unique: true,
  },
  name: {
    type: String,
    require: true,
  },
  department: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "tutor",
  },
  password: {
    type: String,
    require: true,
  },
  mail: {
    type: String,
    require: true,
  },
});

tutorSchema.pre("save", async function (next) {
  try {
    if (!this.password) this.password = appConfig.staffPassword;
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

const tutorModel = mongoose.model("Tutor", tutorSchema);

module.exports = { tutorModel };
