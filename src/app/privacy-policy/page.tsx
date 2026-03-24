
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPolicyPage() {
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
              <h3>c. Transactional Information</h3>
              <ul>
                <li>Order history, shopping cart activity</li>
                <li>Returns and refund requests</li>
                <li>Customer service interactions</li>
              </ul>

              <h2>3. How We Use Your Information</h2>
              <p>We use your information for the following purposes:</p>
              <ul>
                <li><strong>Order Fulfillment</strong> – Processing, delivering, and confirming purchases.</li>
                <li><strong>Customer Support</strong> – Handling inquiries, complaints, and after-sales services.</li>
                <li><strong>Personalization</strong> – Recommending products and tailoring your shopping experience.</li>
                <li><strong>Marketing & Promotions</strong> – Sending promotional offers, newsletters, and targeted advertisements (where you consent).</li>
                <li><strong>Security & Fraud Prevention</strong> – Detecting unauthorized access, ensuring secure transactions, and complying with anti-fraud laws.</li>
                <li><strong>Legal & Compliance</strong> – Meeting regulatory requirements, tax obligations, and lawful government requests.</li>
              </ul>

              <h2>4. Legal Basis for Processing (For GDPR Compliance)</h2>
              <p>We process your personal data under the following lawful bases:</p>
              <ul>
                <li><strong>Consent</strong> – When you opt-in to marketing communications.</li>
                <li><strong>Contractual necessity</strong> – To fulfill your purchase orders and provide requested services.</li>
                <li><strong>Legal obligation</strong> – To comply with applicable laws.</li>
                <li><strong>Legitimate interests</strong> – For improving services, customer satisfaction, and fraud prevention.</li>
              </ul>

              <h2>5. Sharing of Information</h2>
              <p>We do not sell your personal data. However, we may share your information with:</p>
              <ul>
                <li><strong>Service Providers</strong> – Payment gateways, delivery partners, IT and customer service providers.</li>
                <li><strong>Business Partners</strong> – Vendors, suppliers, or affiliates who help fulfill your orders.</li>
                <li><strong>Legal Authorities</strong> – When required by law, regulation, or court order.</li>
                <li><strong>Corporate Transactions</strong> – In case of a merger, acquisition, or business restructuring.</li>
              </ul>
              <p>All third parties are required to respect your data privacy and process it in accordance with applicable laws.</p>

              <h2>6. International Data Transfers</h2>
              <p>
                Your information may be transferred and stored outside your home country, including to jurisdictions that may not provide the same level of data protection. In such cases, we implement safeguards (e.g., contractual clauses, encryption) to protect your data.
              </p>

              <h2>7. Data Retention</h2>
              <p>
                We retain your personal data only as long as necessary for the purposes outlined in this Policy, or as required by law. Once no longer needed, your data will be securely deleted or anonymized.
              </p>
              
              <h2>8. Your Rights</h2>
              <p>Depending on your jurisdiction (e.g., GDPR, CCPA, Kenya DPA), you may have the following rights:</p>
              <ul>
                <li>Right to access your data</li>
                <li>Right to rectification (correct inaccuracies)</li>
                <li>Right to deletion (“right to be forgotten”)</li>
                <li>Right to restrict processing</li>
                <li>Right to data portability</li>
                <li>Right to object to direct marketing</li>
                <li>Right to withdraw consent at any time</li>
                <li>Right to lodge a complaint with a supervisory authority</li>
              </ul>
              <p>You can exercise these rights by contacting us at <a href="mailto:Alphaltd21@gmail.com" className="text-primary hover:underline">Alphaltd21@gmail.com</a>.</p>

              <h2>9. Security of Your Information</h2>
              <p>We employ technical and organizational measures to protect your personal data, including:</p>
              <ul>
                <li>SSL encryption for data transfers</li>
                <li>PCI DSS compliance for payment processing</li>
                <li>Firewalls, access controls, and monitoring systems</li>
                <li>Regular audits and staff training on data protection</li>
              </ul>
              <p>However, no system is 100% secure. You are encouraged to protect your login details and notify us of any suspected breach.</p>
              
              <h2>10. Children’s Privacy</h2>
              <p>
                Our services are not directed to children under 18. We do not knowingly collect personal information from minors. If we discover we have collected data from a child, it will be deleted immediately.
              </p>

              <h2>11. Marketing Communications</h2>
              <p>
                With your consent, we may send promotional offers via email, SMS, or push notifications. You can opt out at any time by clicking the “unsubscribe” link or adjusting your account settings.
              </p>

              <h2>12. Third-Party Links</h2>
              <p>
                Our Platform may contain links to third-party websites. We are not responsible for their privacy practices, and we encourage you to review their policies before providing personal data.
              </p>

              <h2>13. Updates to This Privacy Policy</h2>
              <p>
                We may update this Policy from time to time. Updates will be posted on this page with a new “Effective Date.” Continued use of our Platform after updates indicates your acceptance of the revised Policy.
              </p>

              <h2>14. Contact Us</h2>
              <p>If you have questions about this Privacy Policy or wish to exercise your data rights, please contact us:</p>
              <address className="not-italic">
                <strong>Alpha Electricals & Plumbing Ltd</strong><br />
                Email: <a href="mailto:Alphaltd21@gmail.com" className="text-primary hover:underline">Alphaltd21@gmail.com</a><br />
                Phone: <a href="tel:+254117484887" className="text-primary hover:underline">0117 484887</a><br />
                Address 1: Nandi Arcade, Eldoret, Kenya<br />
                Address 2: Kisumu Ndogo (Opp. Naivas), Elgon View Mall, Eldoret City
              </address>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
