
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsPage() {
  // Using a static date for consistency, can be updated as needed.
  const effectiveDate = "July 10, 2025";

  return (
    <div className="bg-secondary py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold font-headline text-primary">Terms and Conditions</CardTitle>
            <p className="text-sm text-muted-foreground pt-1">Effective Date: {effectiveDate}</p>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none text-foreground dark:prose-invert prose-headings:font-headline prose-h2:text-xl prose-h2:font-bold prose-h2:mt-6 prose-h2:mb-2 prose-p:leading-relaxed">
              
              <h2 id="acceptance">1. Acceptance of Terms</h2>
              <p>
                By using Alpha Electricals & Plumbing Ltd’s website, mobile application, and services (“Platform”), you agree to these Terms and Conditions. If you do not accept these Terms, do not use our services.
              </p>

              <h2 id="company-info">2. Company Information</h2>
              <p>
                Alpha Electricals & Plumbing Ltd is an eCommerce platform for plumbing, electrical, and home improvement products, operated under the laws of Kenya. We connect buyers and sellers for seamless product delivery and installation services.
              </p>

              <h2 id="account">3. Account Registration and Use</h2>
              <ul>
                <li>Users must register an account to make purchases.</li>
                <li>You agree to provide accurate information.</li>
                <li>You are responsible for maintaining the confidentiality of your account.</li>
                <li>We reserve the right to suspend or terminate accounts that violate these Terms.</li>
              </ul>

              <h2 id="eligibility">4. Eligibility to Use Our Platform</h2>
              <p>
                You must be 18 years or older or under supervision of a guardian. By using the Platform, you confirm that you meet the legal requirements to enter into a binding contract.
              </p>

              <h2 id="orders">5. Orders and Acceptance</h2>
              <p>
                Placing an order does not guarantee acceptance. We reserve the right to refuse or cancel any order at any time for reasons including product availability, pricing errors, or suspected fraud.
              </p>

              <h2 id="pricing">6. Pricing, Product Information, and Availability</h2>
              <p>
                We strive for accuracy in product listings. However, errors may occur. We reserve the right to correct any errors and cancel affected orders.
              </p>

              <h2 id="payment">7. Payment</h2>
              <p>
                Payments can be made via M-PESA, debit/credit card, or other approved methods. Payment must be confirmed before dispatch. We use secure payment gateways compliant with PCI DSS standards.
              </p>

              <h2 id="shipping">8. Shipping and Delivery</h2>
              <ul>
                <li>We offer delivery across selected regions.</li>
                <li>Delivery timelines are estimates and not guaranteed.</li>
                <li>Shipping costs are calculated at checkout.</li>
                <li>Risk passes to the customer upon delivery.</li>
              </ul>

              <h2 id="returns">9. Return, Refund & Cancellation</h2>
              <ul>
                <li>You may return items within 7–14 days of delivery.</li>
                <li>Items must be unused and in original packaging.</li>
                <li>Refunds are processed upon inspection and approval.</li>
                <li>Non-returnable items will be listed clearly.</li>
              </ul>

              <h2 id="ip">10. Intellectual Property</h2>
              <p>
                All content (images, trademarks, data) on the Platform is the property of Alpha Electricals & Plumbing Ltd or its licensors. Unauthorized use is prohibited.
              </p>

              <h2 id="liability">11. Limitation of Liability</h2>
              <p>
                We are not liable for indirect, incidental, or consequential damages resulting from use of our Platform or products. Our liability is limited to the purchase price of the item.
              </p>

              <h2 id="indemnity">12. Indemnity</h2>
              <p>
                You agree to indemnify Alpha Electricals & Plumbing Ltd and its affiliates against all claims, losses, or liabilities resulting from your breach of these Terms or misuse of the Platform.
              </p>

              <h2 id="privacy">13. Data Protection and Privacy</h2>
              <p>
                We are committed to protecting your data. Your personal information is processed in line with our Privacy Policy and applicable data protection laws.
              </p>

              <h2 id="cookies">14. Cookies and Tracking</h2>
              <p>
                We use cookies to enhance site performance and user experience. By using our Platform, you consent to our cookie practices.
              </p>

              <h2 id="conduct">15. User Conduct</h2>
              <p>You agree not to:</p>
              <ul>
                <li>Post false or misleading information</li>
                <li>Violate any laws</li>
                <li>Disrupt the integrity or performance of the Platform</li>
                <li>Misuse product listings or engage in fraudulent activity</li>
              </ul>

              <h2 id="modifications">16. Modifications to Terms</h2>
              <p>
                We may update these Terms at any time. Changes are effective once posted. Continued use of the Platform constitutes your agreement to the revised Terms.
              </p>

              <h2 id="law">17. Governing Law and Dispute Resolution</h2>
              <p>
                These Terms shall be governed by and interpreted in accordance with the laws of Kenya. Disputes shall be resolved through arbitration or competent courts within the jurisdiction.
              </p>

              <h2 id="contact">18. Contact Us</h2>
              <p>For inquiries, reach us at:</p>
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
