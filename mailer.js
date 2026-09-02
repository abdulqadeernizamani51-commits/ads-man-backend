```js
// mailer.js
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

function inviteEmailHtml(acceptUrl) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tiktok Creator Ads Invitation</title>
  </head>

  <body style="
    margin:0;
    padding:0;
    background:#f5f5f5;
    font-family:Arial, Helvetica, sans-serif;
    color:#161823;
  ">

    <table width="100%" cellpadding="0" cellspacing="0" border="0"
      style="background:#f5f5f5; padding:40px 16px;">
      <tr>
        <td align="center">

          <table width="100%" cellpadding="0" cellspacing="0" border="0"
            style="
              max-width:560px;
              background:#ffffff;
              border-radius:16px;
              overflow:hidden;
              box-shadow:0 2px 12px rgba(0,0,0,0.06);
            ">

            <!-- Top Accent -->
            <tr>
              <td style="
                height:5px;
                background:linear-gradient(
                  90deg,
                  #25f4ee 0%,
                  #fe2c55 50%,
                  #111111 100%
                );
              "></td>
            </tr>

            <!-- Header -->
            <tr>
              <td style="padding:30px 34px 20px 34px;">

                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>

                    <td align="left">
                      <div style="
                        font-size:27px;
                        font-weight:800;
                        letter-spacing:-1px;
                        color:#111111;
                      ">
                        Tiktok Creator Ads
                      </div>

                      <div style="
                        margin-top:5px;
                        font-size:12px;
                        color:#777777;
                        font-weight:500;
                      ">
                        Creator & Ads Platform
                      </div>
                    </td>

                    <td align="right" valign="middle">
                      <div style="
                        width:42px;
                        height:42px;
                        line-height:42px;
                        text-align:center;
                        border-radius:50%;
                        background:#111111;
                        color:#ffffff;
                        font-size:17px;
                        font-weight:700;
                      ">
                        A
                      </div>
                    </td>

                  </tr>
                </table>

              </td>
            </tr>

            <!-- Main Content -->
            <tr>
              <td style="padding:18px 34px 10px 34px;">

                <div style="
                  display:inline-block;
                  background:#f1f1f1;
                  color:#555555;
                  font-size:11px;
                  font-weight:700;
                  letter-spacing:.6px;
                  padding:7px 11px;
                  border-radius:20px;
                  text-transform:uppercase;
                ">
                  Creator Invitation
                </div>

                <h1 style="
                  margin:18px 0 12px 0;
                  font-size:30px;
                  line-height:1.18;
                  letter-spacing:-.8px;
                  color:#161823;
                ">
                  You've been invited to<br>
                  <span style="color:#fe2c55;">ads-man</span>
                </h1>

                <p style="
                  margin:0;
                  font-size:15px;
                  line-height:1.7;
                  color:#555555;
                ">
                  You have been invited to receive and post advertising
                  through the Tiktok creator ads platform.
                  Set up your account to get started.
                </p>

              </td>
            </tr>

            <!-- Invitation Card -->
            <tr>
              <td style="padding:22px 34px 12px 34px;">

                <table width="100%" cellpadding="0" cellspacing="0" border="0"
                  style="
                    background:#fafafa;
                    border:1px solid #e9e9e9;
                    border-radius:14px;
                  ">

                  <tr>
                    <td style="padding:22px;">

                      <div style="
                        font-size:13px;
                        font-weight:700;
                        color:#222222;
                        margin-bottom:8px;
                      ">
                        Your invitation is ready
                      </div>

                      <div style="
                        font-size:13px;
                        line-height:1.6;
                        color:#777777;
                      ">
                        Click the button below to open your
                        invitation and complete your setup.
                      </div>

                    </td>
                  </tr>

                </table>

              </td>
            </tr>

            <!-- CTA -->
            <tr>
              <td align="center" style="padding:24px 34px 28px 34px;">

                <a href="${acceptUrl}"
                  style="
                    display:inline-block;
                    background:#111111;
                    color:#ffffff;
                    text-decoration:none;
                    font-size:15px;
                    font-weight:700;
                    padding:15px 42px;
                    border-radius:8px;
                    box-shadow:0 4px 10px rgba(0,0,0,.12);
                  ">
                  Accept Invitation
                </a>

                <div style="
                  margin-top:13px;
                  font-size:11px;
                  color:#999999;
                ">
                  Tiktok invitation link
                </div>

              </td>
            </tr>

            <!-- Divider -->
            <tr>
              <td style="padding:0 34px;">
                <div style="
                  height:1px;
                  background:#eeeeee;
                  width:100%;
                "></div>
              </td>
            </tr>

            <!-- Footer Info -->
            <tr>
              <td style="padding:24px 34px 30px 34px;">

                <p style="
                  margin:0 0 10px 0;
                  font-size:12px;
                  line-height:1.6;
                  color:#888888;
                ">
                  This invitation may expire for security reasons.
                  Please use the invitation button above to continue.
                </p>

                <p style="
                  margin:0;
                  font-size:11px;
                  line-height:1.6;
                  color:#aaaaaa;
                ">
                  The invitation works only once, so do not leave without completing it.
                </p>

                <div style="
                  margin-top:22px;
                  font-size:11px;
                  color:#b0b0b0;
                  text-align:center;
                ">
                  © ${new Date().getFullYear()} Tiktok Creator Ads
                </div>

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
      sender: {
        name: 'Tiktok Creator Ads',
        email: process.env.GMAIL_USER,
      },

      to: [
        {
          email: toEmail,
        },
      ],

      subject: 'You’re invited to join Tiktok Creator Ads Account — Accept your invitation',

      htmlContent: inviteEmailHtml(acceptUrl),
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();

    throw new Error(
      `Brevo API error (${response.status}): ${errorBody}`
    );
  }
}

module.exports = {
  sendInviteEmail,
};
```
