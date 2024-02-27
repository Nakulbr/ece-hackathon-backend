const express = require("express");
const {
  login,
  getReports,
  acceptRequest,
  rejectRequest,
  getBonafide,
} = require("../controllers/admin.controller");
const { verifyToken } = require("../utils/verifyToken");

const router = express.Router();

router.use(verifyToken);

router.route("/login").post(login);

router.route("/getReports").post(getReports);

router.route("/acceptRequest").put(acceptRequest);

router.route("/rejectRequest").put(rejectRequest);

router.route("/getBonafide/:id").get(getBonafide);

module.exports = router;
