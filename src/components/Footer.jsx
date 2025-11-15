import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Instagram, Linkedin, Youtube, Sparkles, Shield, FileText, Scale, Cookie, Mail, Trash2 } from 'lucide-react'; 
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  const { toast } = useToast();

  const handleFeatureClick = (feature) => {
    toast({
      title: t('footer.toast.featureDev'),
      description: t('footer.toast.featureDevDesc', { feature }),
      duration: 3000,
      className: 'bg-card text-card-foreground border-primary futuristic-border',
    });
  };

  const quickLinks = [
    { name: t('footer.nav.home'), sectionId: 'hero' },
    { name: t('footer.nav.demo'), sectionId: 'demo' },
    { name: t('footer.nav.pricing'), sectionId: 'pricing' },
    { name: t('footer.nav.login'), to: '/login' }
  ];

  const legalLinks = [
    { name: t('footer.legal.privacy'), to: '/privacy-policy', icon: Shield },
    { name: t('footer.legal.terms'), to: '/terms-of-service', icon: FileText },
    { name: t('footer.legal.notice'), to: '/legal-notice', icon: Scale },
    { name: t('footer.legal.cookies'), to: '/cookie-policy', icon: Cookie }
  ];

  const contactLinks = [
    { name: t('footer.legal.contact'), email: 'legal@ilyr.art', icon: Mail },
    { name: t('footer.legal.deleteAccount'), email: 'privacy@ilyr.art', icon: Trash2 }
  ];

  const socialLinks = [
    { icon: Instagram, name: 'Instagram', url: 'https://www.instagram.com/ilyr.artt' },
    { icon: Linkedin, name: 'LinkedIn', url: '#' },
    { icon: Youtube, name: 'YouTube', url: '#' }
  ];
  
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    } else {
      toast({
        title: t('footer.toast.sectionNotFound'),
        description: t('footer.toast.sectionNotFoundDesc', { sectionId }),
        duration: 3000,
        variant: "destructive",
        className: 'bg-destructive text-destructive-foreground border-red-600',
      });
    }
  };

  const handleEmailContact = (email, subject) => {
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
  };

  return (
    <footer 
      className="bg-gradient-to-b from-card to-background text-foreground border-t-2 border-primary/25 shadow-xl shadow-primary/15"
      role="contentinfo"
      aria-label="Pie de página de ILYR.art"
    >
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-[5px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-6 sm:mb-7 md:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="flex items-center py-[5px]">
              <img 
                src="/logo-ilyr-art.svg" 
                alt="ILYR.art Logo" 
                className="h-6 sm:h-7 md:h-8 w-auto"
                width="120"
                height="32"
                loading="lazy"
              />
            </div>
            <p 
              className="text-foreground/90 text-sm sm:text-base md:text-lg leading-relaxed" 
              dangerouslySetInnerHTML={{ __html: t('footer.tagline') }}
              aria-label={t('footer.tagline').replace(/<[^>]*>/g, '')}
            />
          </motion.div>

          <motion.nav
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-5"
            aria-label={t('footer.quickLinks')}
          >
            <h3 className="text-lg sm:text-xl font-semibold text-foreground tracking-wide">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2.5" role="list">
              {quickLinks.map((link) => (
                <li key={link.name} role="listitem">
                  {link.to ? (
                    <Link 
                      to={link.to}
                      className="focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background rounded"
                      aria-label={`Ir a ${link.name}`}
                    >
                      <motion.span
                        whileHover={{ x: 5, color: 'hsl(var(--accent))', textShadow: '0 0 5px hsl(var(--accent))' }}
                        whileTap={{ scale: 0.95 }}
                        className="text-secondary-type hover:text-foreground transition-all duration-200 text-xs sm:text-sm cursor-pointer inline-block"
                      >
                        {link.name}
                      </motion.span>
                    </Link>
                  ) : (
                    <motion.button
                      whileHover={{ x: 5, color: 'hsl(var(--accent))', textShadow: '0 0 5px hsl(var(--accent))' }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => link.sectionId ? scrollToSection(link.sectionId) : link.action?.()}
                      className="text-secondary-type hover:text-foreground transition-all duration-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background rounded"
                      aria-label={`Desplazarse a ${link.name}`}
                    >
                      {link.name}
                    </motion.button>
                  )}
                </li>
              ))}
            </ul>
          </motion.nav>

          <motion.nav
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="space-y-5"
            aria-label={t('footer.legalAndPrivacy')}
          >
            <h3 className="text-lg sm:text-xl font-semibold text-foreground tracking-wide">{t('footer.legalAndPrivacy')}</h3>
            <ul className="space-y-2.5" role="list">
              {legalLinks.map((link) => (
                <li key={link.name} role="listitem">
                  <Link 
                    to={link.to}
                    className="focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background rounded"
                    aria-label={`Ir a ${link.name}`}
                  >
                    <motion.div
                      whileHover={{ x: 5, color: 'hsl(var(--accent))', textShadow: '0 0 5px hsl(var(--accent))' }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center text-secondary-type hover:text-foreground transition-all duration-200 text-xs sm:text-sm"
                    >
                      <link.icon className="w-4 h-4 mr-2" aria-hidden="true" />
                      {link.name}
                    </motion.div>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="pt-3 border-t border-border/30">
              <h4 className="text-sm font-medium text-foreground/80 block mb-2">{t('footer.legalContact')}</h4>
              {contactLinks.map((contact) => (
                <motion.button
                  key={contact.name}
                  whileHover={{ x: 5, color: 'hsl(var(--accent))' }}
                  onClick={() => handleEmailContact(contact.email, `Inquiry: ${contact.name}`)}
                  className="flex items-center text-secondary-type hover:text-foreground transition-all duration-200 text-xs mb-1 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background rounded text-[10px] sm:text-xs"
                  aria-label={`Contactar por ${contact.name} a ${contact.email}`}
                >
                  <contact.icon className="w-3 h-3 mr-2" aria-hidden="true" />
                  {contact.name}
                </motion.button>
              ))}
            </div>
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="space-y-5"
          >
            <h3 className="text-lg sm:text-xl font-semibold text-foreground tracking-wide">{t('footer.socialMedia')}</h3>
            <div className="flex flex-wrap gap-3" role="list" aria-label="Enlaces a redes sociales">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target={social.url !== '#' ? '_blank' : '_self'}
                  rel={social.url !== '#' ? 'noopener noreferrer' : undefined}
                  whileHover={{ scale: 1.1, y: -2, boxShadow: '0 0 12px hsl(var(--accent)/0.5)' }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    if (social.url === '#') {
                      e.preventDefault();
                      handleFeatureClick(social.name);
                    }
                  }}
                  className="w-10 h-10 bg-card/90 backdrop-blur-sm rounded-lg flex items-center justify-center border border-primary/20 hover:border-accent transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-accent/20 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
                  aria-label={`Visitar ${social.name}`}
                  role="listitem"
                >
                  <social.icon className="w-5 h-5 text-secondary-type group-hover:text-accent transition-colors" aria-hidden="true" />
                </motion.a>
              ))}
            </div>
            <div className="pt-3">
              <h4 className="text-sm font-medium text-foreground/80 block mb-2">{t('footer.compliance')}</h4>
              <div className="flex flex-wrap gap-2" role="list" aria-label="Estándares de cumplimiento">
                <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded" role="listitem">GDPR</span>
                <span className="px-2 py-1 bg-secondary/20 text-secondary text-xs rounded" role="listitem">ISO 27001</span>
                <span className="px-2 py-1 bg-accent/20 text-accent text-xs rounded" role="listitem">Habeas Data</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="section-divider my-3 sm:my-4"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center space-y-1.5 sm:space-y-2 px-4"
        >
          <p className="text-secondary-type text-xs sm:text-sm">
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </p>
          <p className="text-muted-foreground text-[10px] sm:text-xs flex flex-wrap items-center justify-center gap-1">
            <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-accent" />
            {t('footer.holding')} <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent mx-0.5 sm:mx-1">ILYR.AI</span>
            <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-accent" />
          </p>
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            {t('footer.securityStandards')}
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;