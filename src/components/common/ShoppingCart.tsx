
'use client';

import { useCart } from '@/context/CartProvider';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose, SheetFooter } from '@/components/ui/sheet';
import { ShoppingCart as ShoppingCartIcon, Plus, Minus, X } from 'lucide-react';
import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function ShoppingCart({ triggerClassName }: { triggerClassName?: string }) {
  const { cartItems, increaseQuantity, decreaseQuantity, removeFromCart, cartTotal, totalItems } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      currencyDisplay: 'code',
    }).format(price);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className={cn("relative rounded-full", triggerClassName)}>
          <ShoppingCartIcon className="h-6 w-6" />
          <span className="sr-only">Cart</span>
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="px-6">
          <SheetTitle>Shopping Cart ({totalItems})</SheetTitle>
        </SheetHeader>
        {cartItems.length > 0 ? (
          <>
            <ScrollArea className="flex-1 px-6">
              <div className="flex flex-col gap-4 py-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-start gap-4">
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                       <Image
                          src={item.images[0]}
                          alt={item.name}
                          fill
                          className="object-cover"
                          data-ai-hint="product image"
                       />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold leading-tight">{item.name}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{formatPrice(item.price)}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => decreaseQuantity(item.id)}>
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-4 text-center">{item.quantity}</span>
                           <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => increaseQuantity(item.id)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => removeFromCart(item.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="border-t px-6 pt-4">
                <SheetFooter className="mt-0">
                   <div className="w-full space-y-4">
                        <div className="flex justify-between text-lg font-semibold">
                            <span>Subtotal</span>
                            <span>{formatPrice(cartTotal)}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Shipping and taxes will be calculated at checkout.</p>
                        <SheetClose asChild>
                          <Button asChild className="w-full" size="lg">
                              <Link href="/checkout">Proceed to Checkout</Link>
                          </Button>
                        </SheetClose>
                   </div>
                </SheetFooter>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <ShoppingCartIcon className="h-16 w-16 text-muted-foreground" />
            <p className="text-lg font-semibold">Your cart is empty</p>
            <p className="text-muted-foreground">Looks like you haven't added anything yet.</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
