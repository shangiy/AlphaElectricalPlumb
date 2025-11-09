export interface BlogPost {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  imageId: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Dancing with Universal Energy',
    date: 'October 26, 2023',
    excerpt: "What if the universe isn't distant, but alive within us—guiding, shaping, and flowing through our everyday choices? Step into a journey of alignment and inner awakening.",
    imageId: 'blog-post-1',
  },
  {
    id: '2',
    title: 'The Language of Trees',
    date: 'September 15, 2023',
    excerpt: 'Every tree holds a story—rooted in silence, whispered through leaves, and carried by the wind. Discover how nature speaks when we slow down enough to listen.',
    imageId: 'blog-post-2',
  },
  {
    id: '3',
    title: 'The Soul of Style',
    date: 'August 02, 2023',
    excerpt: "Style isn't just fashion—it's the poetry of self-expression. Explore how what we wear becomes an extension of the soul, carrying stories beyond words.",
    imageId: 'blog-post-3',
  },
  {
    id: '4',
    title: 'The Journey Inward: Lessons from the Winding Road',
    date: 'July 21, 2023',
    excerpt: 'Life, much like a mountain road, is full of twists and turns. It is in navigating these unexpected bends that we discover our true strength...',
    imageId: 'blog-post-4',
  },
];
