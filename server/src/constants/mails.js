import config from "../config/config.js";

const getWelcomeTemplate = (text, subject) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject || "Welcome"}</title>
</head>
<body style="margin:0;padding:24px;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1e293b;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:540px;margin:0 auto;background-color:#ffffff;border-radius:12px;border:1px solid #e2e8f0;overflow:hidden;">
    <tr>
      <td style="padding:28px 32px;background-color:#0f172a;text-align:center;">
        <h1 style="margin:0;font-size:20px;font-weight:600;color:#ffffff;letter-spacing:0.5px;">Banking App</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:32px;">
        <h2 style="margin:0 0 16px;font-size:18px;font-weight:600;color:#0f172a;">${subject || "Welcome aboard!"}</h2>
        <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#475569;">${text || "Welcome to your new account. We're glad to have you with us."}</p>
        <div style="margin:28px 0;text-align:center;">
          <a href="${config.client_url || "#"}" style="display:inline-block;padding:12px 28px;background-color:#2563eb;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;border-radius:6px;">Go to Dashboard</a>
        </div>
        <p style="margin:24px 0 0;padding-top:20px;border-top:1px solid #f1f5f9;font-size:12px;line-height:1.5;color:#94a3b8;">
          If you didn't create an account, you can safely ignore this email.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export { getWelcomeTemplate };
