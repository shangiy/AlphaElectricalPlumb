
'use client';

import { useState } from 'react';
import AuthGuard from '@/components/auth/AuthGuard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Plus, Loader2, Trash2, Home, Briefcase, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cn } from '@/lib/utils';

const addressSchema = z.object({
  label: z.string().min(2, 'Label must be at least 2 characters (e.g. Home, Office).'),
  fullName: z.string().min(2, 'Full name is required.'),
  address: z.string().min(5, 'Full physical address is required.'),
  phone: z.string().min(10, 'Valid phone number is required.'),
});

type AddressFormValues = z.infer<typeof addressSchema>;

interface AddressNode {
  id: string;
  label: string;
  fullName: string;
  address: string;
  phone: string;
  isPrimary: boolean;
}

function AddressesPage() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addresses, setAddresses] = useState<AddressNode[]>([
    {
      id: 'default-1',
      label: 'Main Headquarters',
      fullName: 'Alpha Admin',
      address: 'Nandi Arcade, Office 204, Eldoret, KE',
      phone: '+254 117 484 887',
      isPrimary: true,
    }
  ]);

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: '',
      fullName: '',
      address: '',
      phone: '',
    },
  });

  const onSubmit = async (data: AddressFormValues) => {
    setIsSubmitting(true);
    try {
      // Simulate API sync
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newNode: AddressNode = {
        id: `node-${Date.now()}`,
        label: data.label,
        fullName: data.fullName,
        address: data.address,
        phone: data.phone,
        isPrimary: false,
      };

      setAddresses(prev => [...prev, newNode]);
      setIsDialogOpen(false);
      form.reset();
      
      toast({
        title: "Address Synchronized",
        description: `"${data.label}" has been added to your delivery cluster.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sync Error",
        description: "Could not save the new address node.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteAddress = (id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
    toast({
      description: "Address node removed from profile.",
    });
  };

  const getIcon = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes('home')) return <Home size={20} />;
    if (l.includes('office') || l.includes('work')) return <Briefcase size={20} />;
    return <Globe size={20} />;
  };

  return (
    <div className="container mx-auto px-4 py-12 lg:py-20 animate-in fade-in duration-700">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-4xl font-black font-headline text-accent uppercase tracking-tighter">Address Hub</h1>
            <p className="text-muted-foreground font-medium mt-2">Manage your primary and secondary delivery locations.</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full h-12 px-8 bg-primary font-black uppercase text-xs tracking-widest shadow-lg hover:scale-105 transition-transform">
                <Plus size={16} className="mr-2" /> Add Address
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] p-8">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black uppercase tracking-tight text-accent">New Address Node</DialogTitle>
                <DialogDescription className="font-medium">
                  Provision a new delivery location for your account.
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 py-4">
                  <FormField
                    control={form.control}
                    name="label"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Node Label</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Home, Office, Project Site" {...field} className="h-11 rounded-xl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Recipient Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Full name of recipient" {...field} className="h-11 rounded-xl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Physical Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Street, House No, Landmark" {...field} className="h-11 rounded-xl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Contact Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="+254..." {...field} className="h-11 rounded-xl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter className="pt-4">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full h-12 rounded-full font-black uppercase tracking-widest bg-accent text-white shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
                    >
                      {isSubmitting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                      Sync Address
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {addresses.map((addr) => (
            <Card key={addr.id} className="rounded-[2.5rem] border shadow-xl p-10 flex items-start justify-between gap-6 bg-white group hover:border-primary transition-all">
              <div className="flex items-start gap-6">
                <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  {getIcon(addr.label)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <p className="font-black text-accent uppercase tracking-tight text-lg">{addr.label}</p>
                    {addr.isPrimary && (
                      <span className="inline-block px-3 py-0.5 bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase rounded-full border border-emerald-100">
                        Primary Node
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-sm text-slate-700">{addr.fullName}</p>
                  <p className="text-muted-foreground font-medium text-sm">{addr.address}</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-2">{addr.phone}</p>
                </div>
              </div>
              
              {!addr.isPrimary && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                  onClick={() => deleteAddress(addr.id)}
                >
                  <Trash2 size={18} />
                </Button>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <AuthGuard>
      <AddressesPage />
    </AuthGuard>
  );
}
