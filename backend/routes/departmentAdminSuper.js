const express = require("express");
const router = express.Router();
const DepartmentAdmin = require("../models/DepartmentAdmin");

// GET all department admins
router.get("/", async (req, res) => {
  try {
    const admins = await DepartmentAdmin.find().select("-password");
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE admin
router.put("/:id", async (req, res) => {
  const { name, email, department, password } = req.body;

  const updateData = { name, email, department };

  if (password && password.trim() !== "") {
    updateData.password = await bcrypt.hash(password, 10);
  }

  const updatedAdmin = await DepartmentAdmin.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true }
  );

  res.json(updatedAdmin);
});


// DELETE admin
router.delete("/:id", async (req, res) => {
  try {
    await DepartmentAdmin.findByIdAndDelete(req.params.id);
    res.json({ message: "Admin deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
