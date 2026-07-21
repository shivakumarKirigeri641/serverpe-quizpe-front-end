/**
 * QuizPe — the public site.
 *
 * A single page, because the product is a single decision: say "hi" or don't.
 * Everything factual (counts, boards, grades, testimonials, policies) is read
 * from the back-end so the page can never claim something the product cannot
 * do, and so it updates itself as content and customers grow.
 */

import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { api, safe } from './lib/api';
import { WHATSAPP_DISPLAY, WHATSAPP_NUMBER, SUPPORT_EMAIL } from './content';

import Header from './components/Header.jsx';
import Hero from './sections/Hero.jsx';
import HowItWorks from './sections/HowItWorks.jsx';
import Preview from './sections/Preview.jsx';
import Features from './sections/Features.jsx';
import Stats from './sections/Stats.jsx';
import Coverage from './sections/Coverage.jsx';
import Pricing from './sections/Pricing.jsx';
import About from './sections/About.jsx';
import Testimonials from './sections/Testimonials.jsx';
import Faq from './sections/Faq.jsx';
import Contact from './sections/Contact.jsx';
import Footer from './components/Footer.jsx';
import StickyCta from './components/StickyCta.jsx';

export default function App() {
  const [stats, setStats] = useState(null);
  const [coverage, setCoverage] = useState(null);
  const [legal, setLegal] = useState(null);

  useEffect(() => {
    safe(api.stats()).then((d) => d && setStats(d.stats));
    safe(api.coverage()).then(setCoverage);
    safe(api.legal()).then(setLegal);
  }, []);

  const business = legal?.business || {};

  // Rich results in Google: what the product is, and the FAQ, in a form the
  // crawler understands. This is what earns an expanded organic listing.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: business.company_name || 'ServerPe App Solutions',
        url: 'https://quizpe.in/',
        logo: 'https://quizpe.in/assets/logo-full.png',
        email: SUPPORT_EMAIL,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Bangalore', addressRegion: 'Karnataka', addressCountry: 'IN',
        },
        contactPoint: {
          '@type': 'ContactPoint', contactType: 'customer support',
          telephone: `+${WHATSAPP_NUMBER}`, email: SUPPORT_EMAIL,
          areaServed: 'IN', availableLanguage: ['en'],
        },
      },
      {
        '@type': 'Product',
        name: 'QuizPe — Daily WhatsApp Quiz',
        description:
          'A daily 10-question practice quiz delivered on WhatsApp for school children in Grades 1-10, ' +
          'aligned to CBSE, ICSE and Karnataka State syllabus, with a full explanation report.',
        brand: { '@type': 'Brand', name: 'QuizPe' },
        offers: {
          '@type': 'AggregateOffer', priceCurrency: 'INR',
          lowPrice: '99', highPrice: '249', offerCount: 3,
          availability: 'https://schema.org/InStock',
        },
        ...(stats?.ratings_count > 0 && Number(stats.average_rating) > 0 ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: String(stats.average_rating),
            reviewCount: String(stats.ratings_count),
            bestRating: '5', worstRating: '1',
          },
        } : {}),
      },
    ],
  };

  return (
    <>
      <Helmet>
        <html lang="en-IN" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <Header />
      <main>
        <Hero stats={stats} />
        <HowItWorks />
        <Preview />
        <Features />
        <Stats stats={stats} />
        <Coverage coverage={coverage} />
        <Pricing />
        <About />
        <Testimonials />
        <Faq />
        <Contact />
      </main>
      <Footer legal={legal} business={business} />
      <StickyCta />
    </>
  );
}
