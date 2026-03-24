'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Send, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const WhatsAppButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const phoneNumber = '254117484887';

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() === '') return;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setMessage('');
    setIsOpen(false);
  };

  return (
    <>
      {/* Chat Widget */}
      <div
        className={cn(
          'fixed bottom-24 left-6 z-50 w-80 rounded-lg shadow-xl transition-all duration-300 ease-in-out',
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        )}
      >
        <Card className="flex flex-col h-full bg-secondary">
          <CardHeader className="flex flex-row items-center justify-between p-3 bg-green-600 text-white rounded-t-lg">
            <div className="flex items-center gap-3">
              <Image src="/logo Alpha.png" alt="Alpha Electricals Logo" width={32} height={32} />
              <div>
                <h3 className="font-semibold">Alpha Electricals</h3>
                <p className="text-xs">Chat with us on WhatsApp</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20" onClick={() => setIsOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent className="p-4 flex-grow">
            <div className="bg-white p-3 rounded-lg text-sm text-foreground">
              Hello! 👋 How can we help you today?
            </div>
          </CardContent>
          <form onSubmit={handleSendMessage} className="flex items-center gap-2 p-3 border-t bg-background rounded-b-lg">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
              autoFocus
            />
            <Button type="submit" size="icon" className="bg-green-600 hover:bg-green-700">
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </Card>
      </div>

      {/* Floating Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <Button
          size="icon"
          className="bg-[#25D366] hover:bg-[#25D366]/90 rounded-full h-14 w-14 shadow-lg flex items-center justify-center"
          aria-label="Chat on WhatsApp"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <X className="h-7 w-7 text-white" />
          ) : (
            <Image
                src="/whatsapp--v1.png"
                alt="WhatsApp"
                width={32}
                height={32}
            />
          )}
        </Button>
      </div>
    </>
  );
};

export default WhatsAppButton;
