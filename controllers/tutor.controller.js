const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { bonafideModel } = require("../models/bonafide.model");
const { tutorModel } = require("../models/tutor.model");

// POST -> api/tutor/login
const login = async (req, res) => {
  try {
    const { id, password } = req.body;
    const tutor = await tutorModel.findOne({ id: id });
    if (!tutor) {
      return res.status(400).json({ error: "No User Found" });
    }
    const isMatched = await bcrypt.compare(password, tutor.password);
    if (!isMatched) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }
    const token = jwt.sign(
      {
        id: tutor.id,
        role: tutor.role,
      },
      process.env.JWT_SECRET
    );
    res.status(200).json({ message: "Login Successful", token: token });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// POST -> api/tutor/getReports
const getReports = async (req, res) => {
  try {
    const { studentId } = req.body;
    let bonafideRequests = await bonafideModel.find(
      { studentId: studentId },
      { __v: 0 }
    );
    if (!bonafideRequests || bonafideRequests.length === 0) {
      return res.status(400).json({ error: "No Items Found" });
    }
    // add IST offset of 5:30 before displaying in the frontend
    bonafideRequests = await Promise.all(
      bonafideRequests.map(async (bonafide) => {
        if (bonafide.tutorVerify != null) {
          const tutor = await tutorModel.findOne(
            { id: bonafide.tutorVerify },
            { _id: 0, name: 1, department: 1, mail: 1, id: 1 }
          );
          return {
            request: bonafide,
            tutorInfo: tutor,
          };
        }
        return {
          request: bonafide,
          tutorInfo: null,
        };
      })
    );
    res.status(200).json({ bonafideRequests });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// PUT -> api/tutor/acceptRequest
const acceptRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    await bonafideModel
      .findByIdAndUpdate(requestId, {
        $set: {
          tutorVerify: req.user.id,
          tutorApproved: true,
        },
      })
      .then(() =>
        res.status(200).json({ message: "Bonafide Request Approved" })
      )
      .catch((err) => res.status(400).json({ error: err }));
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// PUT -> api/tutor/acceptRequest
const rejectRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    await bonafideModel
      .findByIdAndUpdate(requestId, {
        $set: {
          tutorVerify: req.user.id,
          tutorApproved: false,
        },
      })
      .then(() =>
        res.status(200).json({ message: "Bonafide Request Rejected" })
      )
      .catch((err) => res.status(400).json({ error: err }));
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { acceptRequest, rejectRequest, login, getReports };
