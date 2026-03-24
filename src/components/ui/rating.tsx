import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingProps extends React.HTMLAttributes<HTMLDivElement> {
  rating: number;
  totalStars?: number;
  size?: number;
  showReviewCount?: boolean;
  reviewCount?: number;
}

export function Rating({ rating, totalStars = 5, size = 16, className, reviewCount, showReviewCount=false, ...props }: RatingProps) {
  const fullStars = Math.floor(rating);
  const emptyStars = totalStars - Math.ceil(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className={cn('flex items-center gap-2', className)} {...props}>
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="text-yellow-500 fill-yellow-500" style={{width: size, height: size}} />
        ))}
        {hasHalfStar && (
           <div style={{ position: 'relative', display: 'inline-block', width: size, height: size }}>
            <Star className="text-yellow-500" style={{ width: size, height: size, position: 'absolute', left: 0, top: 0, clipPath: 'inset(0 50% 0 0)' }} fill="currentColor" />
            <Star className="text-gray-300" style={{ width: size, height: size }} />
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="text-gray-300" style={{width: size, height: size}} fill="currentColor"/>
        ))}
      </div>
       {showReviewCount && reviewCount && (
        <span className="text-xs text-muted-foreground">({reviewCount})</span>
      )}
    </div>
  );
}
