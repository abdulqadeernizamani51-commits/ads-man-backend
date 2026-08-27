// mailer.js
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

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
  const response = await fetch(BREVO_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'api-key': process.env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: { name: 'ads-man', email: process.env.GMAIL_USER },
      to: [{ email: toEmail }],
      subject: 'You are invited to ads-man — Get Started',
      htmlContent: inviteEmailHtml(acceptUrl),
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Brevo API error (${response.status}): ${errorBody}`);
  }
}

module.exports = { sendInviteEmail };
