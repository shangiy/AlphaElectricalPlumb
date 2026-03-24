
'use client';

import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface QuantitySelectorProps {
  unit: string;
  onQuantityChange: (quantity: number) => void;
}

const presetQuantities = ['1', '2', '3', '5', '10'];

export default function QuantitySelector({ unit, onQuantityChange }: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState('1');

  useEffect(() => {
    const numericQuantity = parseInt(quantity, 10);
    if (!isNaN(numericQuantity) && numericQuantity > 0) {
      onQuantityChange(numericQuantity);
    } else {
      onQuantityChange(1); // Default to 1 if input is invalid
    }
  }, [quantity, onQuantityChange]);

  const handleSelectChange = (value: string) => {
    setQuantity(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty input for typing, but ensure it's a positive number
    if (value === '' || (/^\d+$/.test(value) && parseInt(value, 10) > 0)) {
       setQuantity(value);
    }
  };

  return (
    <div className="space-y-2">
        <Label>Quantity</Label>
        <div className="flex items-center gap-2">
        <Select value={quantity} onValueChange={handleSelectChange}>
            <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={`Select ${unit}s`} />
            </SelectTrigger>
            <SelectContent>
            {presetQuantities.map((preset) => (
                <SelectItem key={preset} value={preset}>
                {preset} {unit}(s)
                </SelectItem>
            ))}
            </SelectContent>
        </Select>
        <div className="relative flex-1">
            <Input
                type="number"
                value={quantity}
                onChange={handleInputChange}
                className="pr-14"
                min="1"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                {unit}(s)
            </span>
        </div>
        </div>
    </div>
  );
}
