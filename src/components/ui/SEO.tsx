
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  article?: boolean;
}

const SEO: React.FC<SEOProps> = ({
  title = "Protega – India's Most Advanced Post-Purchase Protection Platform",
  description = "Boost your margins, build brand trust, and protect customer happiness with India's most advanced post-purchase protection platform — powered by AI.",
  image = "/lovable-uploads/ddead5cc-c654-4db0-a604-18a016161e2c.png",
  url = "https://protega.ai",
  type = "website",
  article = false,
}) => {
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://protega.ai';
  const canonicalUrl = `${siteUrl}${typeof window !== 'undefined' ? window.location.pathname : ''}`;
  const imageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;
  
  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook meta tags */}
      <meta property="og:type" content={article ? 'article' : type} />
      <meta property="og:url" content={url || canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Protega" />

      {/* Twitter Card meta tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      
      {/* Additional article meta tags if it's an article */}
      {article && (
        <>
          <meta property="article:published_time" content={new Date().toISOString()} />
          <meta property="article:author" content="Protega" />
        </>
      )}
    </Helmet>
  );
};

export default SEO;
