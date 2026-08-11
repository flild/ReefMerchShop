export function JsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Reef",
    "image": "https://reef.ru/og-image.jpg",
    "@id": "https://reef.ru",
    "url": "https://reef.ru",
    "telephone": "",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Санкт-Петербург",
      "addressCountry": "RU"
    },
    "description": "Специализированная типография для художников, авторов мерча и создателей коллекционных изделий. Печать на акриле, брелоки, стенды.",
    "priceRange": "$$"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}