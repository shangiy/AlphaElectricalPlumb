'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  unit: string;
  onQuantityChange: (quantity: number) => void;
}

/**
 * High-Fidelity Quantity Stepper v4.7.0:
 * Features a professional industrial interface with kinetic feedback.
 * Optimized to remove redundant labels and improve visual clarity.
 */
export default function QuantitySelector({ unit, onQuantityChange }: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    onQuantityChange(quantity);
  }, [quantity, onQuantityChange]);

  const increment = () => setQuantity(q => q + 1);
  const decrement = () => setQuantity(q => Math.max(1, q - 1));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val >= 1) {
      setQuantity(val);
    } else if (e.target.value === '') {
        // Allow temporary empty state for typing
        setQuantity(0); 
    }
  };

  const handleBlur = () => {
    if (quantity < 1) {
      setQuantity(1);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">
            Order Quantity
        </label>
        <span className="text-[9px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded-md border border-primary/10">
            Per {unit}
        </span>
      </div>
      
      <div className="flex items-center bg-white rounded-2xl border border-muted shadow-sm h-14 overflow-hidden group focus-within:border-primary/40 transition-colors">
        <Button 
            type="button"
            variant="ghost" 
            size="icon" 
            onClick={decrement}
            className="h-full w-12 rounded-none text-accent hover:bg-muted hover:text-primary transition-all active:scale-90 border-r"
        >
            <Minus size={16} strokeWidth={3} />
        </Button>
        
        <div className="flex-1 flex items-center justify-center relative">
            <input 
                type="number"
                value={quantity || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full bg-transparent text-center font-black text-xl text-accent focus:outline-none appearance-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
        </div>

        <Button 
            type="button"
            variant="ghost" 
            size="icon" 
            onClick={increment}
            className="h-full w-12 rounded-none text-accent hover:bg-muted hover:text-primary transition-all active:scale-90 border-l"
        >
            <Plus size={16} strokeWidth={3} />
        </Button>
      </div>
    </div>
  );
}
