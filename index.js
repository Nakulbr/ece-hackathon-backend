const express = require("express");
const path = require("path");
const cors = require("cors");
const mongooseConfig = require("./config/mongoose.config");
const adminRoutes = require("./routes/admin.routes");
const tutorRoutes = require("./routes/tutor.routes");
const studentRoutes = require("./routes/student.routes");
const { tutorModel } = require("./models/tutor.model");
const { adminModel } = require("./models/admin.model");
const { studentModel } = require("./models/student.model");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Serve Image Files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Admin
app.use("/api/admin", adminRoutes);

// Tutor
app.use("/api/tutor", tutorRoutes);

// Student
app.use("/api/student", studentRoutes);

app.get("/", async (req, res) => {
  // const admin = await adminModel.create({
  //   id: "9999",
  //   mail: "nakul.2101153@srec.ac.in",
  //   name: "Nakul",
  // });
  // if (!admin) {
  //   return res.status(400).json({
  //     error: "Something happened",
  //   });
  // }
  // res.status(200).json({
  //   message: admin,
  // });
  // ----------------------------------------
  // const tutor = await tutorModel.create({
  //   id: "123",
  //   mail: "dev.nakulbr@gmail.com",
  //   name: "Ravi",
  //   department: "Electronics and Communication Engineering",
  // });
  // if (!tutor) {
  //   return res.status(400).json({
  //     error: "Something happened",
  //   });
  // }
  // res.status(200).json({
  //   message: tutor,
  // });
  // -----------------------------------------
  // const student = await studentModel.create({
  //   id: "71812101153",
  //   mail: "nakul.2101153@srec.ac.in",
  //   degree: "B.E",
  //   gender: "male",
  //   programme: "Electronics and Communication Engineering",
  //   year: "second",
  //   name: "Suresh",
  //   photoLink: `http://${req.headers.host}/uploads/71812101153.png`,
  // });
  // if (!student) {
  //   return res.status(400).json({
  //     error: "Something happened",
  //   });
  // }
  // res.status(200).json({
  //   message: student,
  // });
});

mongooseConfig()
  .then(() => {
    app.listen(process.env.PORT, () =>
      console.log(`Server is running on PORT : ${process.env.PORT}`)
    );
  })
  .catch((error) => console.log(`An error has occured : ${error}`));
