require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  // Update the existing superadmin's email to rku.ac.in
  const hashed = await bcrypt.hash('password123', 10);
  
  const result = await User.findOneAndUpdate(
    { role: 'superadmin' },
    { email: 'superadmin@rku.ac.in', password: hashed },
    { new: true }
  );

  if (result) {
    console.log('✅ Superadmin updated!');
    console.log('   Email   :', result.email);
    console.log('   Password: password123');
  } else {
    // No superadmin exists — create one
    const newAdmin = new User({
      name: 'Super Admin',
      email: 'superadmin@rku.ac.in',
      enrollmentNumber: 'ADMIN001',
      department: 'All',
      password: hashed,
      role: 'superadmin'
    });
    await newAdmin.save();
    console.log('✅ Superadmin created!');
    console.log('   Email   : superadmin@rku.ac.in');
    console.log('   Password: password123');
  }

  process.exit(0);
}).catch(err => { console.error(err.message); process.exit(1); });
