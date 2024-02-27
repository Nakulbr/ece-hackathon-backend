const express = require("express");
const { verifyToken } = require("../utils/verifyToken");
const {
  login,
  createRequest,
  getReports,
} = require("../controllers/student.controller");

const router = express.Router();

router.use(verifyToken);

router.route("/login").post(login);

router.route("/getReports").get(getReports);

router.route("/createRequest").post(createRequest);

module.exports = router;
