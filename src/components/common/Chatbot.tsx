
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { LoaderCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';
import { chat } from '@/ai/flows/chatbot-flow';
import type { ChatHistory, ChatMessage } from '@/ai/flows/chatbot-types';

interface ChatbotProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export default function Chatbot({ isOpen, setIsOpen }: ChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: 'model',
          content: "Welcome to Alpha Electricals & Plumbing. How can I help you today?",
        },
      ]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '' || loading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    
    // The chat function expects an object with a 'messages' property
    const chatInput: ChatHistory = { messages: newMessages };
    setInput('');
    setLoading(true);

    try {
      // Pass the entire history object to the chat function
      const response = await chat(chatInput);
      const assistantMessage: ChatMessage = { role: 'model', content: response.response };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage: ChatMessage = {
        role: 'model',
        content: "Sorry, I've encountered an unexpected error. Please try again later.",
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div
        className={cn(
          'fixed bottom-[calc(4rem+1.5rem)] right-6 z-[60] w-80 rounded-lg shadow-xl transition-all duration-300 ease-in-out sm:w-96',
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        )}
      >
        <Card className="flex h-[28rem] max-h-[calc(100vh-10rem)] flex-col bg-white overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between p-2 bg-[#007bff] text-white rounded-t-lg shrink-0">
             <h3 className="font-semibold pl-2">Alpha AI_chatbot</h3>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-white hover:bg-blue-500/80" onClick={() => setIsOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          
          <ScrollArea className="flex-1 bg-white" ref={scrollAreaRef}>
            <CardContent className="p-3 space-y-4 text-sm">
              {messages.map((message, index) => (
                <div key={index} className={cn(
                    'flex items-end gap-2',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                )}>
                   <div className={cn(
                       'max-w-[80%] rounded-lg p-2',
                       message.role === 'user' 
                         ? 'bg-blue-500 text-white' 
                         : 'bg-muted text-muted-foreground'
                   )}>
                       <p className="whitespace-pre-wrap">{message.content}</p>
                   </div>
                </div>
              ))}
              {loading && (
                 <div className="flex items-end gap-2 justify-start">
                    <div className="max-w-[80%] rounded-lg p-2 bg-muted text-muted-foreground">
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                    </div>
                 </div>
              )}
            </CardContent>
          </ScrollArea>

          <form onSubmit={handleSubmit} className="flex items-center gap-2 p-2 border-t bg-white rounded-b-lg shrink-0">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1"
              disabled={loading}
            />
            <Button type="submit" disabled={loading} className="bg-[#007bff] hover:bg-[#0056b3]">
              Send
            </Button>
          </form>
        </Card>
      </div>
  );
}
