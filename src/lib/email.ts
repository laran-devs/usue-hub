import { Resend } from "resend";

const getResend = () => {
  const key = process.env.RESEND_API_KEY;
  if (!key || key === "re_...") return null;
  return new Resend(key);
};

/**
 * Sends a verification code via email.
 */
export async function sendVerificationEmail(email: string, token: string) {
  try {
    console.log(`[AUTH] Dispatching verification code to: ${email}`);
    
    const resend = getResend();

    if (!resend) {
      console.log(`\n***************************************************`);
      console.log(`[DEVELOPMENT MODE] CODE FOR ${email}: ${token}`);
      console.log(`***************************************************\n`);
      return true;
    }

    const { data, error } = await resend.emails.send({
      from: "USUE.HUB <onboarding@resend.dev>", 
      to: [email],
      subject: "USUE.HUB | Verification Code",
      html: `
        <div style="font-family: sans-serif; background-color: #020617; color: #f8fafc; padding: 40px; border-radius: 8px;">
          <div style="max-width: 400px; margin: 0 auto;">
            <h1 style="color: #3b82f6; font-size: 24px; font-weight: bold; margin-bottom: 16px;">SECURE ACCESS</h1>
            <p style="color: #94a3b8; font-size: 14px; line-height: 1.5;">
              Use the following security code to verify your USUE.HUB account. This code is valid for 10 minutes.
            </p>
            <div style="background-color: #0f172a; border: 1px solid #1e3a8a; padding: 24px; border-radius: 12px; text-align: center; margin: 32px 0;">
              <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #ffffff;">${token}</span>
            </div>
            <p style="color: #64748b; font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">
              STAGE: IDENTITY_VERIFICATION // ORIGIN: INTERNAL_ACADEMIC_GATEWAY
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend API Error:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Email service crash:", error);
    return false;
  }
}
