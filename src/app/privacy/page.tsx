
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPage() {
  const effectiveDate = "July 26, 2024";

  return (
    <div className="bg-secondary py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold font-headline text-primary">Privacy Policy</CardTitle>
            <p className="text-sm text-muted-foreground pt-1">Effective Date: {effectiveDate}</p>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none text-foreground dark:prose-invert prose-headings:font-headline prose-h2:text-xl prose-h2:font-bold prose-h2:mt-6 prose-h2:mb-2 prose-p:leading-relaxed">
              
              <h2>1. Introduction</h2>
              <p>
                Alpha Electricals & Plumbing Ltd (“we,” “us,” or “our”) values your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, store, share, and protect information about you when you interact with our eCommerce platform, mobile applications, or related services (“Platform”).
              </p>
              <p>
                By using our Platform, you consent to the practices described in this Policy.
              </p>

              <h2>2. Information We Collect</h2>
              <p>We may collect the following categories of personal and non-personal data:</p>
              <h3>a. Personal Information</h3>
              <ul>
                <li>Full name</li>
                <li>Contact details (email, phone number, physical address)</li>
                <li>Account login details (username, password)</li>
                <li>Payment information (credit/debit card details, M-PESA, bank transfer data – securely processed via third parties)</li>
                <li>Identification documents (when required for verification, regulatory, or fraud-prevention purposes)</li>
              </ul>
              <h3>b. Non-Personal/Technical Information</h3>
              <ul>
                <li>Browser type, device type, operating system</li>
                <li>IP address and geolocation data</li>
                <li>Website usage patterns and analytics</li>
                <li>Cookies and tracking identifiers (see Cookies Policy)</li>
              </ul>

              <h2>3. How We Use Your Information</h2>
              <p>We use your information for the following purposes:</p>
              <ul>
                <li><strong>Order Fulfillment</strong> – Processing, delivering, and confirming purchases.</li>
                <li><strong>Customer Support</strong> – Handling inquiries, complaints, and after-sales services.</li>
                <li><strong>Security & Fraud Prevention</strong> – Detecting unauthorized access, ensuring secure transactions, and complying with anti-fraud laws.</li>
              </ul>

              <h2>4. Sharing of Information</h2>
              <p>We do not sell your personal data. We only share information with service providers (like payment gateways and delivery partners) necessary to fulfill your orders.</p>

              <h2>5. Data Retention</h2>
              <p>
                We retain your personal data only as long as necessary for the purposes outlined in this Policy, or as required by law.
              </p>
              
              <h2>6. Your Rights</h2>
              <p>You have the right to access, correct, or delete your personal data. You can request data deletion by visiting our <a href="/data-deletion" className="text-primary hover:underline">Data Deletion</a> page.</p>

              <h2>7. Contact Us</h2>
              <p>If you have questions about this Privacy Policy, please contact us:</p>
              <address className="not-italic">
                <strong>Alpha Electricals & Plumbing Ltd</strong><br />
                Email: <a href="mailto:Alphaltd21@gmail.com" className="text-primary hover:underline">Alphaltd21@gmail.com</a><br />
                Phone: <a href="tel:+254117484887" className="text-primary hover:underline">0117 484887</a><br />
                Address: Nandi Arcade, Eldoret, Kenya
              </address>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
