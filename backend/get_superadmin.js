const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/RKUEvents')
  .then(async () => {
    try {
      const User = require('./models/User');
      let superAdmin = await User.findOne({ role: 'superadmin' });
      
      if (!superAdmin) {
        console.log("No superadmin found. Let's create one.");
        const hashedPassword = await bcrypt.hash('password123', 10);
        superAdmin = new User({
          name: 'Super Admin',
          email: 'superadmin@rku.ac.in',
          enrollmentNumber: 'ADMIN001',
          department: 'ALL',
          password: hashedPassword,
          role: 'superadmin'
        });
        await superAdmin.save();
        console.log("Created Superadmin:");
      } else {
        console.log("Found existing Superadmin:");
        // Optional: Reset password for ease of access
        const newHashed = await bcrypt.hash('password123', 10);
        superAdmin.password = newHashed;
        await superAdmin.save();
        console.log("Password has been reset to: password123");
      }
      
      console.log(`Email: ${superAdmin.email}`);
      console.log(`Password: password123`);
      
    } catch (e) {
      console.error(e);
    }
    process.exit(0);
  });
