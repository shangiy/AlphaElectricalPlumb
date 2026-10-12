import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingProps extends React.HTMLAttributes<HTMLDivElement> {
  rating: number;
  totalStars?: number;
  size?: number;
  showReviewCount?: boolean;
  reviewCount?: number;
}

export function Rating({ rating, totalStars = 5, size = 16, className, reviewCount, showReviewCount = false, ...props }: RatingProps) {
  // Ensure rating is a valid number and within bounds [0, totalStars]
  const safeRating = typeof rating === 'number' && !isNaN(rating) ? Math.max(0, Math.min(totalStars, rating)) : 0;
  
  const fullStars = Math.floor(safeRating);
  const hasHalfStar = safeRating % 1 !== 0;
  const emptyStars = Math.max(0, totalStars - Math.ceil(safeRating));

  return (
    <div className={cn('flex items-center gap-2', className)} {...props}>
      <div className="flex items-center">
        {/* Full Stars */}
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="text-yellow-500 fill-yellow-500" style={{ width: size, height: size }} />
        ))}
        
        {/* Half Star */}
        {hasHalfStar && (
          <div style={{ position: 'relative', display: 'inline-block', width: size, height: size }}>
            <Star className="text-yellow-500" style={{ width: size, height: size, position: 'absolute', left: 0, top: 0, clipPath: 'inset(0 50% 0 0)' }} fill="currentColor" />
            <Star className="text-gray-300" style={{ width: size, height: size }} />
          </div>
        )}
        
        {/* Empty Stars */}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="text-gray-300" style={{ width: size, height: size }} fill="currentColor" />
        ))}
      </div>
      
      {showReviewCount && typeof reviewCount === 'number' && (
        <span className="text-xs text-muted-foreground">({reviewCount})</span>
      )}
    </div>
  );
}
