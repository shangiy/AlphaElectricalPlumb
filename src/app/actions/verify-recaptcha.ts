'use server';

/**
 * @fileOverview Server action to verify reCAPTCHA tokens with Google's API.
 */

export async function verifyRecaptcha(token: string | null) {
  if (!token) {
    return { success: false, message: 'reCAPTCHA token is missing.' };
  }

  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    console.error('RECAPTCHA_SECRET_KEY is not defined in environment variables.');
    return { success: false, message: 'Server configuration error.' };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${token}`,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    if (data.success) {
      return { success: true };
    } else {
      console.error('reCAPTCHA verification failed:', data['error-codes']);
      
      const errorMsg = data['error-codes']?.includes('invalid-input-response') 
        ? 'Verification expired or invalid. Please try again.'
        : 'Security verification failed. Please check your domain settings.';

      return { 
        success: false, 
        message: errorMsg, 
        errorCodes: data['error-codes'] 
      };
    }
  } catch (error: any) {
    if (error.name === 'AbortError') {
      return { success: false, message: 'Verification timed out. Please try again.' };
    }
    console.error('Error during reCAPTCHA verification:', error);
    return { success: false, message: 'Internal server error during verification.' };
  }
}
