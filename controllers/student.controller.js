const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { studentModel } = require("../models/student.model");
const { bonafideModel } = require("../models/bonafide.model");
const { transporter } = require("../config/nodemailer.config");
const { tutorModel } = require("../models/tutor.model");
const { generatePDF } = require("../utils/generatePDF");

// POST -> api/student/login
const login = async (req, res) => {
  try {
    const { id, password } = req.body;
    const student = await studentModel.findOne({ id: id });
    if (!student) {
      return res.status(400).json({ error: "No User Found" });
    }
    const isMatched = await bcrypt.compare(password, student.password);
    if (!isMatched) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }
    const token = jwt.sign(
      {
        id: student.id,
        role: student.role,
      },
      process.env.JWT_SECRET
    );
    res.status(200).json({ message: "Login Successful", token: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET -> api/student/getReports
const getReports = async (req, res) => {
  try {
    const rollNo = req.user.id;
    let bonafideRequests = await bonafideModel.find(
      { studentId: rollNo },
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

// POST -> api/student/createRequest
const createRequest = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { reason, tutorMail } = req.body;
    const bonafideRequest = await bonafideModel.create({
      studentId: studentId,
      reason: reason,
    });
    if (!bonafideRequest) {
      return res.status(400).json({ error: "Unable To create a new request" });
    }
    const student = await studentModel.findOne(
      { id: studentId },
      { name: 1, programme: 1, photoLink: 1, degree: 1, year: 1 }
    );
    const mailOptions = {
      from: process.env.MAIL, // Sender address
      to: tutorMail, // Tutor's email address
      subject: "Request for Bonafide Certificate", // Subject line
      attachments: {
        path: student.photoLink,
      },
      html: `
          <p>Dear Tutor,</p>
          <p>I am writing to request a bonafide certificate approval:</p>
          <ul>
            <li><strong>Name:</strong> ${student.name}</li>
            <li><strong>Roll No:</strong> ${studentId}</li>
            <li><strong>Year:</strong> ${student.year}</li>
            <li><strong>Department:</strong> ${student.degree} - ${student.programme}</li>
            <li><strong>Reason for Bonafide:</strong> ${reason}</li>
          </ul>
          <p>Please issue the bonafide certificate at your earliest convenience.</p>
          <p>Thank you.</p>
          <p>Sincerely,<br> ${student.name}</p>
      `,
    };
    transporter
      .sendMail(mailOptions)
      .then(() =>
        res.status(200).json({ message: "Request created successfully" })
      )
      .catch((error) => console.log("An error has occured", error));
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { login, createRequest, getReports };
