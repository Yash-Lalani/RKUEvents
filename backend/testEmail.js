require('dotenv').config();
const { sendRegistrationEmail } = require('./utils/emailService');

const testUser = { name: "Test User", email: process.env.EMAIL_USER };
const testEvent = { name: "Test SMTP Event", date: "2026-02-22", time: "10:00 AM", location: "Server Console" };

console.log("Testing SMTP connection for:", process.env.EMAIL_USER);
sendRegistrationEmail(testUser, testEvent)
  .then(() => {
    console.log("Test execution completed.");
    setTimeout(() => process.exit(0), 3000); 
  })
  .catch(err => {
    console.error("Test execution failed:", err);
    process.exit(1);
  });
