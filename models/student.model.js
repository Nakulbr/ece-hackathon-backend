const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { appConfig } = require("../config/app.config");

const studentSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  degree: {
    type: String,
    required: true,
  },
  programme: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "student",
  },
  password: {
    type: String,
  },
  mail: {
    type: String,
    required: true,
  },
  photoLink: {
    type: String,
    default: null,
  },
});

studentSchema.pre("save", async function (next) {
  try {
    if (!this.password) this.password = appConfig.studentPassword;
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

const studentModel = mongoose.model("Student", studentSchema);

module.exports = { studentModel };
