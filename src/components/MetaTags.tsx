import { useEffect } from 'react';

interface MetaTagsProps {
  title: string;
  description: string;
  image?: string;
  url: string;
  type?: 'website' | 'article' | 'music.song' | 'music.album' | 'profile' | 'music.playlist';
}

export const MetaTags: React.FC<MetaTagsProps> = ({
  title,
  description,
  image,
  url,
  type = 'website',
}) => {
  useEffect(() => {
    const fullUrl = `${window.location.origin}${url}`;
    const defaultImage = `${window.location.origin}/og-default-image.png`;
    // const defaultImage = `${window.location.origin}/og-default-image.svg`;

    // Actualizar título
    document.title = `${title} | MyBandLab`;

    // Función para actualizar o crear meta tags
    const setMetaTag = (name: string, content: string, isProperty: boolean = false) => {
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector);

      if (!meta) {
        meta = document.createElement('meta');
        if (isProperty) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }

      meta.setAttribute('content', content);
    };

    // Limpiar meta tags anteriores (opcional, para evitar duplicados)
    const cleanOldTags = () => {
      const ogProperties = [
        'og:type',
        'og:url',
        'og:title',
        'og:description',
        'og:image',
        'og:site_name',
      ];
      const twitterProperties = [
        'twitter:card',
        'twitter:url',
        'twitter:title',
        'twitter:description',
        'twitter:image',
      ];

      [...ogProperties, ...twitterProperties, 'description'].forEach((prop) => {
        const selector = prop.startsWith('og:')
          ? `meta[property="${prop}"]`
          : `meta[name="${prop}"]`;
        const existing = document.querySelector(selector);
        if (existing) {
          existing.remove();
        }
      });
    };

    cleanOldTags();

    // Open Graph / Facebook
    setMetaTag('og:type', type, true);
    setMetaTag('og:url', fullUrl, true);
    setMetaTag('og:title', title, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:image', image || defaultImage, true);
    setMetaTag('og:site_name', 'MyBandLab', true);

    // Twitter
    setMetaTag('twitter:card', 'summary_large_image', false);
    setMetaTag('twitter:url', fullUrl, false);
    setMetaTag('twitter:title', title, false);
    setMetaTag('twitter:description', description, false);
    setMetaTag('twitter:image', image || defaultImage, false);

    // Description estándar
    setMetaTag('description', description, false);
  }, [title, description, image, url, type]);

  return null;
};
