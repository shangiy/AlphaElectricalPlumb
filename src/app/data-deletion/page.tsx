import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DataDeletionPage() {
  const effectiveDate = "March 26, 2026";

  return (
    <div className="bg-secondary py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold font-headline text-primary">Data Deletion Instructions</CardTitle>
            <p className="text-sm text-muted-foreground pt-1">Effective Date: {effectiveDate}</p>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none text-foreground dark:prose-invert prose-headings:font-headline prose-h2:text-xl prose-h2:font-bold prose-h2:mt-6 prose-h2:mb-2 prose-p:leading-relaxed">
              
              <h2>1. Overview</h2>
              <p>
                At Alpha Electricals & Plumbing Ltd, we respect your privacy and your right to control your personal data. In compliance with data protection regulations (including GDPR, CCPA, and the Kenya Data Protection Act), we provide a simple way for you to request the deletion of your account and associated data.
              </p>

              <h2>2. How to Request Data Deletion</h2>
              <p>You can request the deletion of your personal information through any of the following methods:</p>
              
              <h3>a. Via Email (Recommended)</h3>
              <p>
                Send an email to <a href="mailto:Alphaltd21@gmail.com" className="text-primary hover:underline">Alphaltd21@gmail.com</a> with the subject line "Data Deletion Request". Please include your registered email address or username to help us identify your account.
              </p>

              <h3>b. Via Contact Form</h3>
              <p>
                Visit our <a href="/contact" className="text-primary hover:underline">Contact Us</a> page and submit a message stating your request for account closure and data removal.
              </p>

              <h2>3. Social Media Login Deletion (Facebook/Google)</h2>
              <p>
                If you used a social media account (like Facebook or Google) to log into Alpha Electricals & Plumbing Ltd, you can also manage your data permissions directly through those platforms:
              </p>
              <ul>
                <li><strong>Facebook:</strong> Go to your Facebook profile's "Settings & Privacy" > "Settings" > "Apps and Websites" and remove "Alpha Electricals".</li>
                <li><strong>Google:</strong> Go to your Google Account "Security" section > "Your connections to third-party apps & services" and remove access for "Alpha Electricals".</li>
              </ul>

              <h2>4. What Data is Deleted?</h2>
              <p>Upon a valid deletion request, we will remove the following from our active systems:</p>
              <ul>
                <li>Personal profile information (Name, Email, Phone, Username).</li>
                <li>Saved delivery addresses.</li>
                <li>Wishlist items.</li>
                <li>Account settings and preferences.</li>
              </ul>

              <h2>5. Exceptions</h2>
              <p>
                Please note that we may retain certain information where required by law or for legitimate business purposes, such as:
              </p>
              <ul>
                <li>Transactional history for tax and audit compliance (e.g., records of completed purchases).</li>
                <li>Data required to defend against legal claims.</li>
              </ul>

              <h2>6. Processing Time</h2>
              <p>
                Once we receive your request, we will verify your identity and process the deletion within 30 days. You will receive a confirmation email once the process is complete.
              </p>
              
              <h2>7. Contact Us</h2>
              <p>If you have any questions regarding your data or this policy, please reach out:</p>
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
