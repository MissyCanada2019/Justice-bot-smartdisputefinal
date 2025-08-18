import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://justicebotai.com' // Will update when you get your custom domain

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/dashboard/billing',
        '/dashboard/evidence-locker',
        '/_next/',
        '/admin/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}