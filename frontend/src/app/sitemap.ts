import { MetadataRoute } from 'next';
import { getBlogPosts } from '@/lib/cms-store';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://bahi.app';
  const posts = getBlogPosts();

  const staticPages = [
    '',
    '/features',
    '/pricing',
    '/solutions',
    '/customers',
    '/integrations',
    '/about',
    '/contact',
    '/careers',
    '/security',
    '/terms',
    '/privacy',
    '/cookies',
    '/refund',
    '/docs',
    '/blog',
    '/status',
  ];

  const staticRoutes = staticPages.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  const blogRoutes = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt).toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...blogRoutes];
}

