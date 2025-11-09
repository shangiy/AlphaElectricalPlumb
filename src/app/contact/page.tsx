'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    console.log("Form submission data:", data);

    // In a real app, you would send this to a server.
    // For now, we use an alert and reset the form.
    alert('Thank you for your message! This is a demo and your message has not been sent.');
    form.reset();
  };

  return (
    <div className="relative overflow-hidden bg-background py-16 sm:py-24">
      <div
        aria-hidden="true"
        className="absolute inset-0 select-none pointer-events-none"
      >
        <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-[20vw] md:text-[15vw] font-extrabold text-primary/5 tracking-tighter font-headline">
              CONTACT
            </h1>
        </div>
      </div>
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto">
          <header className="text-center mb-12">
            <h2 className="font-headline text-4xl sm:text-5xl font-bold text-primary">
              Get in Touch
            </h2>
            <p className="mt-4 text-lg text-foreground/70">
              Have a question, a comment, or just want to say hello? I'd love to hear from you.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-foreground/80 font-bold">Name</Label>
              <Input
                type="text"
                id="name"
                name="name"
                required
                className="mt-2"
                placeholder="Your Name"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-foreground/80 font-bold">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                required
                className="mt-2"
                placeholder="your.email@example.com"
              />
            </div>
            <div>
              <Label htmlFor="message" className="text-foreground/80 font-bold">Message</Label>
              <Textarea
                id="message"
                name="message"
                required
                rows={6}
                className="mt-2"
                placeholder="Your message..."
              />
            </div>
            <div className="text-center">
              <Button type="submit" size="lg" className="w-full md:w-auto font-bold tracking-wider">
                SEND MESSAGE
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
