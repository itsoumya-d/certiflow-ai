import { MetadataRoute } from 'next';

/**
 * Robots.txt configuration for CertiFlow AI
 * https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */
export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://certiflow.ai';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/',
                    '/dashboard/',
                    '/auditor/',
                    '/settings/',
                    '/evidence/',
                    '/agents/',
                ],
            },
            {
                userAgent: 'Googlebot',
                allow: '/',
                disallow: ['/api/', '/dashboard/', '/auditor/'],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
