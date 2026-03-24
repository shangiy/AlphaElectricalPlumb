
'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { sendNewsletterSubscriptionEmail } from '@/ai/flows/send-newsletter-subscription-email';
import { useState, ChangeEvent } from 'react';

const newsletterSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
});

type NewsletterFormInputs = z.infer<typeof newsletterSchema>;

export default function NewsletterForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<NewsletterFormInputs>({
    resolver: zodResolver(newsletterSchema),
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setValue('email', value, { shouldValidate: true });
  };

  const onSubmit: SubmitHandler<NewsletterFormInputs> = async (data) => {
    setIsSubmitting(true);
    try {
      const result = await sendNewsletterSubscriptionEmail({ email: data.email });
      
      if (result.success) {
        toast({
          title: 'Subscribed!',
          description: 'Thanks for joining our newsletter.',
        });
        reset();
        setInputValue('');
      } else {
        throw new Error(result.message);
      }

    } catch (error) {
      console.error('Subscription error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
      toast({
        variant: 'destructive',
        title: 'Subscription Failed',
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate size attribute for the input, with min and max values
  const inputSize = Math.max(18, Math.min(40, inputValue.length));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-2">
      <div className="flex w-full items-start gap-2">
        <Input
          type="email"
          placeholder="Enter your email"
          className="bg-background flex-auto min-w-0"
          {...register('email')}
          onChange={handleInputChange}
          value={inputValue}
          size={inputSize}
          style={{ width: `${inputSize}ch` }} // Adjust width based on characters
          disabled={isSubmitting}
        />
        <Button type="submit" variant="default" disabled={isSubmitting} className="shrink-0">
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Subscribe'
          )}
        </Button>
      </div>
      {errors.email && (
        <p className="text-sm text-destructive">{errors.email.message}</p>
      )}
    </form>
  );
}
