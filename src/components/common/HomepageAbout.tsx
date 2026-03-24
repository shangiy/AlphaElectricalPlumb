import React from 'react';

export default function HomepageAbout() {
  return (
    <section className="bg-background py-16">
      <div className="container mx-auto px-4 text-center max-w-4xl">
        <h2 className="text-3xl font-bold font-headline mb-6 text-primary">About Us</h2>
        <div className="space-y-4 text-muted-foreground">
            <p>
                Alpha Electricals & Plumbing Ltd is committed to providing quality tanks, plumbing equipment, lighting, décor, and construction products across the region.
            </p>
            <p>
                Our platform serves as a resourceful destination for homeowners, contractors, and businesses seeking expert advice, innovative products, and reliable services in the construction and utility sectors.
            </p>
            <p>
                We offer a wide range of guides and insights on efficient product use, energy-saving techniques, and modern plumbing solutions. Through strategic partnerships with certified electricians and plumbers.
            </p>
        </div>
      </div>
    </section>
  );
}
