const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const eventDetailsRoutes = require("./routes/eventDetailsRoutes");
const eventRegistrationRoutes = require("./routes/eventRegistrationRoutes");
const departmentAdminRoutes = require("./routes/departmentAdmin");
const superAdminEventRoutes = require("./routes/superAdminEvents");


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/eventRoutes");
app.use("/api/event-details", eventDetailsRoutes);
app.use("/api/event-registrations", eventRegistrationRoutes);
app.use("/api/department-admin", departmentAdminRoutes);
app.use("/api/super-admin/events", superAdminEventRoutes);
app.use("/api/stats", require("./routes/dashboardStats"));
app.use("/api/profile", require("./routes/profileRoutes"));



app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

// DB + Server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch(err => console.error("DB connection error:", err));
