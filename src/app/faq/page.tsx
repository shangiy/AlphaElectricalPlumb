
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const faqs = [
    {
        question: "What types of products do you sell?",
        answer: "We specialize in a wide range of products including water tanks, plumbing equipment, lighting and electrical supplies, home & décor items, and roofing & construction materials."
    },
    {
        question: "Do you offer delivery services?",
        answer: "Yes, we offer fast and reliable delivery services. We provide free delivery for orders above KES 5,000 within Eldoret town. For other locations, shipping costs are calculated at checkout."
    },
    {
        question: "What are your store hours?",
        answer: "Our physical stores are open from Monday to Saturday, 8:00 AM to 6:00 PM. Our online store is available 24/7 for you to browse and place orders."
    },
    {
        question: "How can I track my order?",
        answer: "Once your order is confirmed and shipped, you can use the 'Track My Order' page on our website. You will need your order ID to see the status of your delivery."
    },
    {
        question: "What is your return policy?",
        answer: "We accept returns within 7-14 days of delivery for most items, provided they are unused and in their original packaging. Please refer to our 'Terms of Service' page for detailed information on non-returnable items and the return process."
    },
    {
        question: "How can I contact customer support?",
        answer: "You can reach our customer support team via email at Alphaltd21@gmail.com or by phone at 0117 484 887. You can also visit our 'Contact Us' page for more details and a contact form."
    },
     {
        question: "Can I get product recommendations?",
        answer: "Absolutely! Our AI-powered chatbot, 'Alpha AI', can provide product recommendations based on your needs. You can also use the search bar to find products, and our category pages are organized to help you browse our collections easily."
    }
];

export default function FAQPage() {
  return (
    <div className="bg-secondary py-12">
        <div className="container mx-auto px-4 max-w-4xl">
            <Card className="shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-4xl font-bold font-headline text-primary">Frequently Asked Questions</CardTitle>
                    <CardDescription className="text-lg text-muted-foreground mt-2">
                        Find answers to common questions about our products and services.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                     <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq, index) => (
                            <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger className="text-lg font-semibold text-left hover:no-underline">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-base text-muted-foreground">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
