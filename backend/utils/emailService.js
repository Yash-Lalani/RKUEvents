const nodemailer = require("nodemailer");

// Create transporter lazily so it reads process.env AFTER dotenv has loaded
const getTransporter = () => nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendRegistrationEmail = async (user, event) => {
  try {
    const mailOptions = {
      from: `"RKU Events" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `You're registered for ${event.name}! 🎉`,
      html: `
<div style="background-color: #000000; padding: 40px 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #ffffff;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #111111; border-radius: 16px; border: 1px solid #222222; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.8);">
    
    <!-- Header -->
    <div style="background: linear-gradient(90deg, #1e3a8a 0%, #3b0764 100%); padding: 30px 20px; text-align: center;">
      <h1 style="margin: 0; color: #ffffff; font-size: 28px; letter-spacing: 2px;">RKU EVENTS</h1>
      <p style="margin: 5px 0 0 0; color: #cbd5e1; font-size: 14px; letter-spacing: 1px;">Raisoni University</p>
    </div>

    <!-- Body -->
    <div style="padding: 40px 30px;">
      <h2 style="margin-top: 0; color: #4ade80; font-size: 24px;">Registration Confirmed ✓</h2>
      <p style="color: #cbd5e1; font-size: 16px; line-height: 1.6;">Hello <strong style="color: #ffffff;">${user.name}</strong>,</p>
      <p style="color: #cbd5e1; font-size: 16px; line-height: 1.6;">Thank you for registering! You're all set for the following event:</p>

      <!-- Event Details Card -->
      <div style="background-color: #0a0a0a; border: 1px solid #333333; border-left: 4px solid #3b82f6; border-radius: 8px; padding: 25px; margin: 30px 0;">
        <h3 style="margin: 0 0 15px 0; color: #60a5fa; font-size: 20px; letter-spacing: 1px;">${event.name}</h3>
        
        <table width="100%" cellpadding="0" cellspacing="0" style="color: #cbd5e1; font-size: 15px; line-height: 1.8;">
          <tr>
            <td width="30%" style="font-weight: bold; color: #94a3b8;">📅 Date:</td>
            <td width="70%">${event.date}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; color: #94a3b8;">⏰ Time:</td>
            <td>${event.time}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; color: #94a3b8;">📍 Location:</td>
            <td>${event.location}</td>
          </tr>
        </table>
      </div>

      <p style="color: #cbd5e1; font-size: 16px; line-height: 1.6;">We look forward to seeing you there! Please save this email as your confirmation.</p>
    </div>

    <!-- Footer -->
    <div style="background-color: #0a0a0a; padding: 20px; text-align: center; border-top: 1px solid #222222;">
      <p style="margin: 0; color: #64748b; font-size: 12px;">This is an automated email from RKU Events. Please do not reply to this email.</p>
      <p style="margin: 5px 0 0 0; color: #64748b; font-size: 12px;">&copy; ${new Date().getFullYear()} RKU Administration. All rights reserved.</p>
    </div>

  </div>
</div>
      `,
    };

    await getTransporter().sendMail(mailOptions);
    console.log(`Registration email sent to ${user.email} for event ${event.name}`);
  } catch (error) {
    console.error("Error sending registration email:", error);
    throw error; // Re-throw so the route can catch it
  }
};

const sendNewEventEmail = async (users, event) => {
  if (!users || users.length === 0) return;

  const emailHtml = `
<div style="background-color: #000000; padding: 40px 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #ffffff;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #111111; border-radius: 16px; border: 1px solid #222222; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.8);">
    
    <!-- Header -->
    <div style="background: linear-gradient(90deg, #1e3a8a 0%, #3b0764 100%); padding: 30px 20px; text-align: center;">
      <h1 style="margin: 0; color: #ffffff; font-size: 28px; letter-spacing: 2px;">RKU EVENTS</h1>
      <p style="margin: 5px 0 0 0; color: #cbd5e1; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">New Event Alert</p>
    </div>

    <!-- Body -->
    <div style="padding: 40px 30px;">
      <h2 style="margin-top: 0; color: #3b82f6; font-size: 24px;">New Event Published!</h2>
      <p style="color: #cbd5e1; font-size: 16px; line-height: 1.6;">Hello,</p>
      <p style="color: #cbd5e1; font-size: 16px; line-height: 1.6;">A new event has been published for your department. Here are the details:</p>

      <!-- Event Details Card -->
      <div style="background-color: #0a0a0a; border: 1px solid #333333; border-left: 4px solid #a855f7; border-radius: 8px; padding: 25px; margin: 30px 0;">
        <h3 style="margin: 0 0 10px 0; color: #c084fc; font-size: 20px; text-transform: uppercase; letter-spacing: 1px;">${event.name}</h3>
        <p style="margin: 0 0 20px 0; color: #94a3b8; font-size: 14px; line-height: 1.5; font-style: italic;">"${event.description}"</p>
        
        <table width="100%" cellpadding="0" cellspacing="0" style="color: #cbd5e1; font-size: 15px; line-height: 1.8;">
          <tr>
            <td width="30%" style="font-weight: bold; color: #94a3b8;">DATE:</td>
            <td width="70%">${event.date}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; color: #94a3b8;">TIME:</td>
            <td>${event.time}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; color: #94a3b8;">LOCATION:</td>
            <td>${event.location}</td>
          </tr>
        </table>
      </div>

      <p style="color: #cbd5e1; font-size: 16px; line-height: 1.6;">Log in to view the event and register before spots fill up!</p>
      
      <div style="text-align: center; margin-top: 35px;">
        <a href="http://localhost:5173/login" style="background-color: #3b82f6; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">View Event & Register</a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #0a0a0a; padding: 20px; text-align: center; border-top: 1px solid #222222;">
      <p style="margin: 0; color: #64748b; font-size: 12px;">This is an automated notification from the RKU Events System.</p>
      <p style="margin: 5px 0 0 0; color: #64748b; font-size: 12px;">&copy; ${new Date().getFullYear()} RKU Administration. All rights reserved.</p>
    </div>

  </div>
</div>`;

  let successCount = 0;
  let failCount = 0;

  // Send individual email to each student for reliable delivery
  const emailPromises = users.map(async (user) => {
    try {
      await getTransporter().sendMail({
        from: `"RKU Events" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: `New Event: ${event.name}`,
        html: emailHtml,
      });
      successCount++;
    } catch (err) {
      console.error(`Failed to send new event email to ${user.email}:`, err.message);
      failCount++;
    }
  });

  await Promise.all(emailPromises);
  console.log(`New event broadcast for "${event.name}": ${successCount} sent, ${failCount} failed out of ${users.length} total.`);
};

module.exports = {
  sendRegistrationEmail,
  sendNewEventEmail
};
