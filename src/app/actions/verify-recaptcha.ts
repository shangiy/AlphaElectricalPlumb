'use server';

/**
 * Server Action to verify Google reCAPTCHA token.
 * This runs on the server side where the RECAPTCHA_SECRET_KEY is accessible.
 */
export async function verifyRecaptcha(gRecaptchaToken: string) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    console.error("RECAPTCHA_SECRET_KEY is not defined in environment variables.");
    return { status: "error", message: "Server configuration error." };
  }

  try {
    // 2. Ask Google if this token is valid
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${secretKey}&response=${gRecaptchaToken}`,
    });

    const reCaptchaRes = await response.json();

    // 3. Check the result
    // Score is only present in v3. For v2 checkbox, we check success.
    const isHuman = reCaptchaRes.success && (reCaptchaRes.score === undefined || reCaptchaRes.score > 0.5);

    if (isHuman) {
      return { status: "success", message: "Verification successful!" };
    } else {
      return { status: "error", message: "Verification failed. Please complete the security check." };
    }
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return { status: "error", message: "Internal server error during verification." };
  }
}
