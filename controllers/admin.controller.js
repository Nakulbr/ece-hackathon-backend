const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { adminModel } = require("../models/admin.model");
const { bonafideModel } = require("../models/bonafide.model");
const { tutorModel } = require("../models/tutor.model");
const { studentModel } = require("../models/student.model");
const { generatePDF } = require("../utils/generatePDF");

// POST -> api/admin/login
const login = async (req, res) => {
  try {
    const { id, password } = req.body;
    const admin = await adminModel.findOne({ id: id });
    if (!admin) {
      return res.status(404).json({ error: "No User Found" });
    }
    const isMatched = await bcrypt.compare(password, admin.password);

    if (!isMatched) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }
    const token = jwt.sign(
      {
        id: admin.id,
        role: admin.role,
      },
      process.env.JWT_SECRET
    );
    res.status(200).json({ message: "Login Successful", token: token });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// POST -> api/admin/getReports
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

// PUT -> api/admin/acceptRequest
const acceptRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    await bonafideModel
      .findByIdAndUpdate(requestId, {
        $set: {
          adminApproved: true,
        },
      })
      .then(() =>
        res.status(200).json({ message: "Bonafide Request Approved" })
      )
      .catch((err) => res.status(400).json({ error: err }));
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// PUT -> api/admin/acceptRequest
const rejectRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    await bonafideModel
      .findByIdAndUpdate(requestId, {
        $set: {
          adminApproved: false,
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

// GET -> api/admin/getBonafide
const getBonafide = async (req, res) => {
  try {
    const requestId = req.params.id;

    const bonafideRequest = await bonafideModel.findById(requestId);
    if (!bonafideRequest)
      return res.status(404).json({ error: "No such request found" });

    const student = await studentModel.findOne({
      id: bonafideRequest.studentId,
    });

    const updatedAt = new Date(bonafideRequest.updatedAt);
    const day = updatedAt.getDate().toString().padStart(2, "0");
    const month = (updatedAt.getMonth() + 1).toString().padStart(2, "0");
    const year = updatedAt.getFullYear();

    const data = {
      date: `${day}.${month}.${year}`,
      name: student.name,
      rollNumber: student.id,
      year: student.year,
      degree: student.degree,
      programme: student.programme,
      pronoun: student.gender === "male" ? "him" : "her",
      reason: bonafideRequest.reason,
    };

    const pdfBuffer = await generatePDF(data);

    // res.setHeader("Content-Disposition", 'attachment: filename="bonafide.pdf"');
    // res.setHeader("Content-Type", "application/pdf");

    res.attachment("bonafide.pdf");

    res.send(pdfBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  login,
  getReports,
  acceptRequest,
  rejectRequest,
  getBonafide,
};
