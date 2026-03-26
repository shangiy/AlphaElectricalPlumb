'use server';

/**
 * Server Action to verify Google reCAPTCHA token.
 * This runs on the server side where the RECAPTCHA_SECRET_KEY is accessible.
 */
export async function verifyRecaptcha(gRecaptchaToken: string) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    console.error("RECAPTCHA_SECRET_KEY is not defined in environment variables. Check your Firebase Console Settings.");
    return { status: "error", message: "Server configuration error (Secret Key missing)." };
  }

  if (!gRecaptchaToken) {
    return { status: "error", message: "Please complete the reCAPTCHA check." };
  }

  try {
    // Ask Google if this token is valid
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${secretKey}&response=${gRecaptchaToken}`,
    });

    const data = await response.json();

    if (data.success) {
      return { status: "success", message: "Verification successful!" };
    } else {
      // Log the specific errors from Google to the server console for debugging
      console.error("Google reCAPTCHA verification failed. Error codes:", data['error-codes']);
      
      const errorMsg = data['error-codes']?.includes('invalid-input-secret') 
        ? "The server's Secret Key is invalid." 
        : "Verification failed. Please try the checkbox again.";

      return { status: "error", message: errorMsg };
    }
  } catch (error) {
    console.error("reCAPTCHA network error:", error);
    return { status: "error", message: "Could not connect to verification server." };
  }
}
