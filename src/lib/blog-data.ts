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
    title: 'Whispers of the Woods: A Morning Walk',
    date: 'October 26, 2023',
    excerpt: 'The forest floor was a tapestry of fallen leaves, each one a story of the season past. As I walked, the crisp morning air filled my lungs...',
    imageId: 'blog-post-1',
  },
  {
    id: '2',
    title: 'Reflections on the Water: Finding Clarity',
    date: 'September 15, 2023',
    excerpt: 'There is a certain magic to the stillness of a lake at dawn. The water, a perfect mirror, reflects not just the sky but also the state of one\'s soul...',
    imageId: 'blog-post-2',
  },
  {
    id: '3',
    title: 'The Unwritten Page: Embracing the Blank Slate',
    date: 'August 02, 2023',
    excerpt: 'Every writer knows the fear and the thrill of a blank page. It is a promise of potential, a canvas for thoughts yet to be born...',
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
