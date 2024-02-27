const mongoose = require("mongoose");

const bonafideSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    tutorVerify: {
      type: String,
      default: null,
    },
    tutorApproved: {
      type: Boolean,
      default: null,
    },
    adminApproved: {
      type: Boolean,
      default: null,
    },
  },
  { timestamps: true }
);

const bonafideModel = mongoose.model("Bonafide", bonafideSchema);

module.exports = { bonafideModel };
