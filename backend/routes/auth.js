const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const DepartmentAdmin = require("../models/DepartmentAdmin");

const router = express.Router();

// ✅ Register (students by default)
// router.post("/register", async (req, res) => {
//   try {
//     const { name, email, enrollmentNumber, department, password } = req.body;

//     const existingUser = await User.findOne({ email });
//     if (existingUser) return res.status(400).json({ msg: "User already exists" });

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = new User({
//       name,
//       email,
//       enrollmentNumber,
//       department,
//       password: hashedPassword, // store hashed password
//     });

//     await user.save();

//     res.json({ msg: "Registration successful" });
//   } catch (err) {
//     res.status(500).json({ msg: "Server error", error: err.message });
//   }
// });



router.post("/register", async (req, res) => {
  try {
    const { name, email, enrollmentNumber, department, password } = req.body;

    if (!name || !email || !password || !enrollmentNumber || !department) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    if (!email.endsWith("@rku.ac.in")) {
      return res.status(400).json({ msg: "Only RKU students can register" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await new User({
      name,
      email,
      enrollmentNumber,
      department,
      password: hashedPassword,
    }).save();

    res.status(201).json({ msg: "Registration successful!" });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});




// ✅ Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1️⃣ Check normal User collection
    let user = await User.findOne({ email });

    // 2️⃣ If not found, check DepartmentAdmin collection
    if (!user) {
      user = await DepartmentAdmin.findOne({ email });
    }

    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // 3️⃣ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // 4️⃣ Create token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "mysecret",
      { expiresIn: "1d" }
    );

    // 5️⃣ Return user data with token
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department || null, // department only for dept-admin
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
