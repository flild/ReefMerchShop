import React from 'react';

type JsonLdProps = {
  data: Record<string, any> | Record<string, any>[];
};

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://reef.com';

export function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Reef",
    "url": siteUrl,
    "logo": `${siteUrl}/icon.png`,
    "description": "Специализированная типография для художников, авторов мерча и создателей коллекционных изделий. Печать акриловых брелоков, стендов и мерча на заказ.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Санкт-Петербург",
      "addressCountry": "RU"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service"
    }
  };

  return <JsonLd data={jsonLd} />;
}

export function WebSiteJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Reef | Типография для мерчеделов",
    "url": siteUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return <JsonLd data={jsonLd} />;
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; item: string }[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `${siteUrl}${item.item}`
    }))
  };

  return <JsonLd data={jsonLd} />;
}