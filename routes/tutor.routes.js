const express = require("express");
const { verifyToken } = require("../utils/verifyToken");
const {
  login,
  getReports,
  acceptRequest,
  rejectRequest,
} = require("../controllers/tutor.controller");

const router = express.Router();

// Middleware
router.use(verifyToken);

router.route("/login").post(login);

router.route("/getReports").post(getReports);

router.route("/acceptRequest").put(acceptRequest);

router.route("/rejectRequest").put(rejectRequest);

module.exports = router;
