import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingProps extends React.HTMLAttributes<HTMLDivElement> {
  rating: number;
  totalStars?: number;
  size?: number;
  showReviewCount?: boolean;
  reviewCount?: number;
}

/**
 * Updated Rating component: 
 * Matches the reference image with yellow stars and proper sizing.
 */
export function Rating({ rating, totalStars = 5, size = 16, className, reviewCount, showReviewCount = false, ...props }: RatingProps) {
  const safeRating = typeof rating === 'number' && !isNaN(rating) ? Math.max(0, Math.min(totalStars, rating)) : 0;
  
  const fullStars = Math.floor(safeRating);
  const hasHalfStar = safeRating % 1 >= 0.5;
  const emptyStars = Math.max(0, totalStars - fullStars - (hasHalfStar ? 1 : 0));

  return (
    <div className={cn('flex items-center gap-1', className)} {...props}>
      <div className="flex items-center">
        {/* Full Stars */}
        {[...Array(fullStars)].map((_, i) => (
          <Star 
            key={`full-${i}`} 
            className="text-yellow-400 fill-yellow-400" 
            style={{ width: size, height: size }} 
          />
        ))}
        
        {/* Half Star */}
        {hasHalfStar && (
          <div className="relative" style={{ width: size, height: size }}>
            <Star 
              className="text-muted/20 fill-muted/20" 
              style={{ width: size, height: size }} 
            />
            <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
              <Star 
                className="text-yellow-400 fill-yellow-400" 
                style={{ width: size, height: size }} 
              />
            </div>
          </div>
        )}
        
        {/* Empty Stars */}
        {[...Array(emptyStars)].map((_, i) => (
          <Star 
            key={`empty-${i}`} 
            className="text-muted/20 fill-muted/20" 
            style={{ width: size, height: size }} 
          />
        ))}
      </div>
      
      {showReviewCount && (
        <span className="text-[10px] font-bold text-muted-foreground">
          ({reviewCount || 0})
        </span>
      )}
    </div>
  );
}
