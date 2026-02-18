const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendVerificationEmail = async (email, token) => {
    const verifyLink = `${process.env.FRONTEND_URL}/verify?token=${token}`
    console.log("Verification link:", verifyLink);
    await resend.emails.send({
        from: process.env.FROM_EMAIL,
        to: email,
        subject: "Verify your Chatify account",
        html: `
        <!DOCTYPE html>
            <html>
            <head>
            <meta charset="UTF-8" />
            <title>Email Verification</title>
            </head>
            <body style="margin:0;padding:0;background:linear-gradient(135deg,#e9d5ff,#f5f3ff);font-family:Arial,Helvetica,sans-serif;">
            <table width="100%" height="100%" cellpadding="0" cellspacing="0">
                <tr>
                <td align="center" style="padding:40px 10px;">
                    <table width="420" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:14px;padding:32px;box-shadow:0 20px 40px rgba(0,0,0,0.1);text-align:center;">
                    
                    <!-- Icon -->
                    <tr>
                        <td style="padding-bottom:20px;">
                        <div style="width:70px;height:70px;border-radius:50%;background:#f3e8ff;display:inline-flex;align-items:center;justify-content:center;">
                            <span style="font-size:30px;">📧</span>
                        </div>
                        </td>
                    </tr>

                    <!-- Title -->
                    <tr>
                        <td style="font-size:22px;font-weight:700;color:#1f2937;padding-bottom:10px;">
                        Authenticate Your Email Address
                        </td>
                    </tr>

                    <!-- Message -->
                    <tr>
                        <td style="font-size:14px;color:#6b7280;line-height:1.6;padding-bottom:24px;">
                        An email has been sent to<br />
                        <strong style="color:#111827;">${email}</strong><br /><br />
                        Please check your inbox and click the button below to verify your account.
                        </td>
                    </tr>

                    <!-- Button -->
                    <tr>
                        <td style="padding-bottom:24px;">
                        <a href="${verifyLink}" 
                            style="display:inline-block;padding:14px 28px;background:#4f46e5;color:#ffffff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600;">
                            Verify Email
                        </a>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="font-size:12px;color:#9ca3af;">
                        Didn’t receive the email? You can request a new one.<br /><br />
                        <span style="color:#c7c7c7;">This link expires in 15 minutes.</span>
                        </td>
                    </tr>
                    </table>
                </td>
                </tr>
            </table>
            </body>
        </html>`,
    }).then(() => {
        console.log(`Verification email sent to ${email}`);
    })
}

module.exports = { sendVerificationEmail };