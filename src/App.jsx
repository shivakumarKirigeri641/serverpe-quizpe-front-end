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
import { trackView, trackWA } from './lib/track';
import { SUPPORT_EMAIL } from './content';

import Header from './components/Header.jsx';
import Hero from './sections/Hero.jsx';
import HowItWorks from './sections/HowItWorks.jsx';
import Preview from './sections/Preview.jsx';
import Features from './sections/Features.jsx';
import Stats from './sections/Stats.jsx';
import Coverage from './sections/Coverage.jsx';
import Pricing from './sections/Pricing.jsx';
import Rewards from './sections/Rewards.jsx';
import WhyNotAI from './sections/WhyNotAI.jsx';
import WhyQuizPe from './sections/WhyQuizPe.jsx';
import LaunchBanner from './components/LaunchBanner.jsx';
import NoticeBanner from './components/NoticeBanner.jsx';
import SchoolDemo from './sections/SchoolDemo.jsx';
import About from './sections/About.jsx';
import Testimonials from './sections/Testimonials.jsx';
import Faq from './sections/Faq.jsx';
import Contact from './sections/Contact.jsx';
import Footer from './components/Footer.jsx';
import StickyCta from './components/StickyCta.jsx';
import Policy, { policySlug } from './sections/Policy.jsx';
import ParentApp from './pages/ParentApp.jsx';
import HangingNotice from './components/HangingNotice.jsx';

export default function App() {
  // Clean policy URLs (/privacy, /terms, /data-deletion …). The site has no
  // router, but nginx already serves index.html for unknown paths, so reading
  // the pathname is enough to give each policy its own public URL — which is
  // what WhatsApp/Meta require for business verification.
  //
  // The slug is read here but the early return happens AFTER the hooks below:
  // hooks must run unconditionally and in the same order on every render, so
  // returning before them would break the Rules of Hooks.
  const slug = policySlug();
  // The parent's account, quizpe.in/app (2026-10-08: WhatsApp is retired).
  const isApp = /^\/app(\/|$)/.test(window.location.pathname);

  const [stats, setStats] = useState(null);
  const [coverage, setCoverage] = useState(null);
  const [legal, setLegal] = useState(null);

  useEffect(() => {
    if (slug || isApp) return;   // a policy page or the account needs none of this
    safe(api.stats()).then((d) => d && setStats(d.stats));
    safe(api.coverage()).then(setCoverage);
    safe(api.legal()).then(setLegal);
  }, [slug, isApp]);

  // Visitor tracking: one page view on load, and a site-wide click delegate so
  // every start / sign-in button (there are many, all to quizpe.in/app since
  // 2026-10-08) is counted without wiring each button individually. The
  // counter keeps its old name in the visitor log.
  useEffect(() => {
    if (isApp) return undefined;
    trackView();
    const onClick = (e) => {
      const a = e.target.closest?.('a[href]');
      if (a && /^\/app(\/|$|\?)/.test(a.getAttribute('href') || '')) {
        trackWA((a.textContent || '').trim().slice(0, 60));
      }
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [isApp]);

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
          email: SUPPORT_EMAIL,
          areaServed: 'IN', availableLanguage: ['en'],
        },
      },
      {
        '@type': 'Product',
        name: 'QuizPe — Daily Revision Quiz',
        description:
          'A daily practice quiz for school children in Grades 1-10, taken in the browser at quizpe.in, ' +
          'aligned to the CBSE and Karnataka State syllabus, with a full explanation report.',
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

  // all hooks have run — safe to branch now
  // The hanging notice (2026-10-10) on every page: WhatsApp is gone, QuizPe is on the web.
  if (slug) return <><HangingNotice /><Policy slug={slug} /></>;
  if (isApp) return <><HangingNotice /><ParentApp /></>;

  return (
    <>
      <Helmet>
        <html lang="en-IN" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <HangingNotice top={0} />
      <NoticeBanner />
      <LaunchBanner />
      <Header />
      <main>
        <Hero stats={stats} />
        <HowItWorks />
        <Preview />
        <Features />
        {/* The four everyday frustrations QuizPe removes — including the
            adaptive engine, the one thing a parent can't do with a search box. */}
        <WhyQuizPe />
        {/* Answers the objection while the product is still fresh in mind, and
            before the price is asked for. */}
        <WhyNotAI />
        <Stats stats={stats} />
        <Coverage coverage={coverage} />
        {/* Rewards sit immediately before pricing: "will my child keep doing
            it?" is the doubt that decides whether the price is worth it. */}
        <Rewards />
        <Pricing />
        <About />
        <Testimonials />
        <SchoolDemo />
        <Faq />
        <Contact />
      </main>
      <Footer legal={legal} business={business} />
      <StickyCta />
    </>
  );
}
