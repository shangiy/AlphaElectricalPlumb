
'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wallet } from 'lucide-react';
import { useState } from 'react';

// Define the shape of the PaystackPop object if it's available on `window`
declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: PaystackOptions) => {
        openIframe: () => void;
      };
    };
  }
}

interface PaystackOptions {
  key: string;
  email: string;
  phone: string;
  amount: number;
  currency: 'KES';
  channels: ('card' | 'mobile_money')[];
  ref: string;
  metadata: {
    custom_fields: {
      display_name: string;
      variable_name: string;
      value: string;
    }[];
  };
  callback: (response: { reference: string }) => void;
  onClose: () => void;
}

interface PaystackButtonProps {
  amount: number;
  email: string;
  phone: string;
  onSuccess: (reference: string) => void;
  onClose?: () => void;
}

export default function PaystackButton({ amount, email, phone, onSuccess, onClose }: PaystackButtonProps) {
  const { toast } = useToast();
  const [isPaying, setIsPaying] = useState(false);
  
  const payWithPaystack = () => {
    if (!window.PaystackPop) {
      toast({
        variant: 'destructive',
        title: 'Payment Error',
        description: 'Paystack script not loaded. Please refresh the page.',
      });
      return;
    }
    
    setIsPaying(true);

    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_163014ec364903a72c78b8e3fea9db7e080333ce',
      email: email,
      phone: phone,
      amount: Math.round(amount * 100), // Amount in Kobo/cents
      currency: 'KES',
      channels: ['card', 'mobile_money'],
      ref: 'ALPHA-' + Math.floor(Math.random() * 1000000000),
      metadata: {
        custom_fields: [
          {
            display_name: "Phone Number",
            variable_name: "phone_number",
            value: phone,
          },
        ],
      },
      callback: function (response) {
        setIsPaying(false);
        onSuccess(response.reference);
      },
      onClose: function () {
        setIsPaying(false);
        if (onClose) {
          onClose();
        }
        toast({
          title: 'Transaction Canceled',
          description: 'The payment process was not completed.',
        });
      },
    });

    handler.openIframe();
  };

  return (
    <Button size="lg" className="w-full" onClick={payWithPaystack} disabled={isPaying || amount <= 0}>
      {isPaying ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Wallet className="mr-2 h-5 w-5" />}
      Make Payment Now
    </Button>
  );
}
