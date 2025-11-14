const express = require("express");
const DepartmentAdmin = require("../models/DepartmentAdmin");

const router = express.Router();

// POST: Add a department admin (superadmin only)
router.post("/add", async (req, res) => {
  try {
    const { name, email, password, department } = req.body;

    if (!name || !email || !password || !department) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // check if email already exists
    const existing = await DepartmentAdmin.findOne({ email });
    if (existing) {
      return res.status(400).json({ msg: "Department Admin already exists" });
    }

    const newAdmin = new DepartmentAdmin({ name, email, password, department });
    await newAdmin.save();

    res.status(201).json({ msg: "Department Admin created successfully", admin: newAdmin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
