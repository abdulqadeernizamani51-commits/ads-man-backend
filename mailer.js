
// mailer.js
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

function inviteEmailHtml(acceptUrl) {
  return `
<!DOCTYPE html>
<html>
<body style="margin:0; padding:0; background-color:#0a0a0a;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a; padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px; background-color:#141414; border-radius:20px; overflow:hidden; border:1px solid #262626;">
          <tr>
            <td style="height:6px; background:linear-gradient(90deg, #25F4EE 0%, #FE2C55 100%); font-size:0; line-height:0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:36px 36px 0 36px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-family:Arial, Helvetica, sans-serif; font-size:22px; font-weight:900; color:#ffffff; letter-spacing:-0.5px;">
                    Creator<span style="color:#FE2C55;"></span>Ads
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 36px 0 36px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color:#1f1f1f; border:1px solid #2e2e2e; border-radius:999px; padding:6px 14px; font-family:Arial, Helvetica, sans-serif; font-size:11px; font-weight:700; letter-spacing:1px; color:#25F4EE; text-transform:uppercase;">
                    &#9679; You're Invited
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 36px 0 36px; font-family:Arial, Helvetica, sans-serif; font-size:28px; font-weight:900; color:#ffffff; line-height:1.2; letter-spacing:-0.5px;">
              You've been invited to Creator Ads Account
            </td>
          </tr>
          <tr>
            <td style="padding:16px 36px 0 36px; font-family:Arial, Helvetica, sans-serif; font-size:15px; line-height:1.6; color:#a0a0a0;">
              You've been invited to join <strong style="color:#ffffff;">Creator Ads Account</strong>. Click the button below to set up your account and get started.
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:32px 36px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-radius:10px; background:linear-gradient(90deg, #25F4EE 0%, #FE2C55 100%); padding:2px;">
                    <a href="${acceptUrl}" style="display:inline-block; background-color:#141414; color:#ffffff; font-family:Arial, Helvetica, sans-serif; font-size:15px; font-weight:700; text-decoration:none; padding:14px 34px; border-radius:8px;">
                      Get Started
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 36px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="height:1px; background-color:#262626; font-size:0; line-height:0;">&nbsp;</td></tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 36px 36px 36px; font-family:Arial, Helvetica, sans-serif; font-size:12px; line-height:1.6; color:#666666;">
              This invitation can only be used once, so please complete it before leaving. This invite link will expire soon.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
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
      sender: { name: 'TikTok Business Account', email: process.env.GMAIL_USER },
      to: [{ email: toEmail }],
      subject: 'You are invited to TikTok Business Account — Get Started',
      htmlContent: inviteEmailHtml(acceptUrl),
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Brevo API error (${response.status}): ${errorBody}`);
  }
}

module.exports = { sendInviteEmail };
