import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  ogImage?: string;
}

export function SEO({ title, description, ogImage }: SEOProps) {
  useEffect(() => {
    if (title) {
      document.title = title;
    }

    const metaDescription = document.querySelector('meta[name="description"]');
    if (description && metaDescription) {
      metaDescription.setAttribute('content', description);
    } else if (description) {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = description;
      document.head.appendChild(meta);
    }

    const metaOgImage = document.querySelector('meta[property="og:image"]');
    if (ogImage && metaOgImage) {
      metaOgImage.setAttribute('content', ogImage);
    } else if (ogImage) {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:image');
      meta.content = ogImage;
      document.head.appendChild(meta);
    }
  }, [title, description, ogImage]);

  return null;
}
