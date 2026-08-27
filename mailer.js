// mailer.js
// Sends the invite email using your Gmail account via an "App Password".
// See README.md Step 1 for how to generate GMAIL_APP_PASSWORD.

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

function inviteEmailHtml(acceptUrl) {
  return `
  <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; border: 1px solid #eee; border-radius: 12px;">
    <h2 style="color: #111;">You've been invited to ads-man</h2>
    <p style="color: #444; font-size: 15px; line-height: 1.5;">
      You've been invited to join <strong>ads-man</strong>. Click the button below to
      set up your account and get started.
    </p>
    <div style="text-align: center; margin: 32px 0;">
      <a href="${acceptUrl}"
         style="background: #111; color: #fff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; display: inline-block;">
        Get Started
      </a>
    </div>
    <p style="color: #999; font-size: 12px;">
      This invite link will expire soon. If you weren't expecting this, you can safely ignore this email.
    </p>
  </div>
  `;
}

async function sendInviteEmail(toEmail, acceptUrl) {
  await transporter.sendMail({
    from: `"ads-man" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: 'You are invited to ads-man — Get Started',
    html: inviteEmailHtml(acceptUrl),
  });
}

module.exports = { sendInviteEmail };
