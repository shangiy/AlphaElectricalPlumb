import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DataDeletionPage() {
  const effectiveDate = "March 26, 2026";

  return (
    <div className="bg-secondary py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="shadow-lg border-none">
          <CardHeader className="text-center border-b bg-card rounded-t-lg">
            <CardTitle className="text-3xl font-bold font-headline text-primary">User Data Deletion Instructions</CardTitle>
            <p className="text-sm text-muted-foreground pt-1">Effective Date: {effectiveDate}</p>
          </CardHeader>
          <CardContent className="pt-8">
            <div className="prose prose-sm max-w-none text-foreground dark:prose-invert prose-headings:font-headline prose-h2:text-xl prose-h2:font-bold prose-h2:mt-6 prose-h2:mb-2 prose-p:leading-relaxed">
              
              <p className="text-lg font-medium text-center mb-8">
                At Alpha Electricals & Plumbing Limited, we value your privacy and provide a simple way for you to manage or remove your personal data.
              </p>

              <div className="bg-muted/30 p-6 rounded-2xl border border-dashed border-primary/20 mb-8">
                <h2 className="text-primary flex items-center gap-2">How to delete your data via Facebook:</h2>
                <p>If you used Facebook to log into our platform, you can remove our app's access and associated data through these steps:</p>
                <ol className="space-y-2 mt-4">
                  <li>Go to your Facebook Profile's <strong>"Settings & Privacy"</strong> menu.</li>
                  <li>Click <strong>"Settings"</strong> and then select <strong>"Apps and Websites."</strong></li>
                  <li>Find <strong>"alphaelectricalsplumbingltd"</strong> in the list.</li>
                  <li>Click the <strong>"Remove"</strong> button next to the app.</li>
                </ol>
              </div>

              <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
                <h2 className="text-primary flex items-center gap-2">Manual Deletion Request:</h2>
                <p>
                  Alternatively, you can request the manual deletion of your account and all associated data from our internal Firebase systems by contacting us directly.
                </p>
                <p className="mt-4">
                  Please send an email to: <a href="mailto:mushangip0@gmail.com" className="text-xl font-bold text-primary hover:underline">mushangip0@gmail.com</a>
                </p>
                <p className="text-xs text-muted-foreground mt-4 italic">
                  Note: Please include your registered email address or username so we can identify and process your request promptly. Once processed, all your profile data, delivery addresses, and wishlists will be permanently wiped.
                </p>
              </div>

              <h2 className="mt-12">Contact Support</h2>
              <p>If you have any other questions regarding your data privacy, please reach out to our team:</p>
              <address className="not-italic bg-muted/20 p-4 rounded-lg">
                <strong>Alpha Electricals & Plumbing Ltd</strong><br />
                Email: <a href="mailto:mushangip0@gmail.com" className="text-primary hover:underline">mushangip0@gmail.com</a><br />
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
