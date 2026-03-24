
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Image from 'next/image';
import { availableAvatars } from '@/lib/data';

interface AvatarSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}

export default function AvatarSelectionDialog({ isOpen, onClose, onSelect }: AvatarSelectionDialogProps) {
  const handleSelect = (url: string) => {
    onSelect(url);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Choose Your Avatar</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-4 gap-4 py-4">
          {availableAvatars.map((avatar, index) => (
            <button
              key={index}
              onClick={() => handleSelect(avatar.url)}
              className="aspect-square rounded-full overflow-hidden border-2 border-transparent hover:border-primary focus:border-primary focus:outline-none transition"
            >
              <Image
                src={avatar.url}
                alt={avatar.alt}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
