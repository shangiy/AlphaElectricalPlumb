import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingProps extends React.HTMLAttributes<HTMLDivElement> {
  rating: number;
  totalStars?: number;
  size?: number;
  showReviewCount?: boolean;
  reviewCount?: number;
}

/**
 * High-Precision Rating Component v4.6.0: 
 * Features a pixel-perfect layering engine for half-star visualization.
 */
export function Rating({ rating, totalStars = 5, size = 16, className, reviewCount, showReviewCount = false, ...props }: RatingProps) {
  const safeRating = typeof rating === 'number' && !isNaN(rating) ? Math.max(0, Math.min(totalStars, rating)) : 0;
  
  return (
    <div className={cn('flex items-center gap-1', className)} {...props}>
      <div className="flex items-center">
        {[...Array(totalStars)].map((_, i) => {
          const starIndex = i + 1;
          // Determine if this star should be full, half, or empty
          const isFull = starIndex <= Math.floor(safeRating);
          const isHalf = !isFull && (starIndex <= Math.ceil(safeRating)) && (safeRating % 1 !== 0);
          
          return (
            <div key={i} className="relative" style={{ width: size, height: size }}>
              {/* Base Star (Empty State) */}
              <Star 
                className="text-muted/20 fill-muted/20" 
                style={{ width: size, height: size }} 
              />
              
              {/* Full Star Overlay */}
              {isFull && (
                <div className="absolute inset-0">
                  <Star 
                    className="text-yellow-400 fill-yellow-400" 
                    style={{ width: size, height: size }} 
                  />
                </div>
              )}
              
              {/* Half Star Overlay (Width-Clipped) */}
              {isHalf && (
                <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                  <Star 
                    className="text-yellow-400 fill-yellow-400" 
                    style={{ width: size, height: size }} 
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {showReviewCount && (
        <span className="text-[10px] font-bold text-muted-foreground ml-1">
          ({reviewCount || 0})
        </span>
      )}
    </div>
  );
}
