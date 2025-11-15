import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import DemoSection from '@/components/DemoSection';
import ModulesSection from '@/components/ModulesSection';
import CreativeAnalysisSection from '@/components/CreativeAnalysisSection';
import DashboardSection from '@/components/DashboardSection';
import PricingSection from '@/components/PricingSection';
import FAQSection from '@/components/FAQSection';
import Footer from '@/components/Footer';
import CreativeCopilotBubble from '@/components/CreativeCopilotBubble';
import AnnouncementBanner from '@/components/AnnouncementBanner';
import InspirationFeedSection from '@/components/InspirationFeedSection';
import GamificationSection from '@/components/GamificationSection';
import CaseStudiesSection from '@/components/CaseStudiesSection';
import AgenciesFreelancersSection from '@/components/AgenciesFreelancersSection';
import ScrollProgress from '@/components/ScrollProgress';
import CookieBanner from '@/components/CookieBanner';

const HomePage = () => {
  return (
    <>
      <ScrollProgress />
      <Header />
      <main className="flex-grow" role="main" aria-label="Contenido principal de la página">
        <AnnouncementBanner />
        <HeroSection />
        <HowItWorksSection />
        <ModulesSection />
        <CaseStudiesSection />
        <DashboardSection />
        <CreativeAnalysisSection />
        <DemoSection />
        <AgenciesFreelancersSection />
        <InspirationFeedSection />
        <GamificationSection />
        <PricingSection />
        <FAQSection />
      </main>
      <Footer />
      <CreativeCopilotBubble />
      <CookieBanner />
    </>
  );
};

export default HomePage;