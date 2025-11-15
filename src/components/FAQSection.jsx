import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { HelpCircle, Brain, DownloadCloud, CreditCard, UserPlus, Settings2, FileText, Clock, ShieldCheck, MessageSquare, ChevronRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';

const FAQSection = () => {
  const { t } = useTranslation();
  const { toast } = useToast();

  const handleFeatureClick = (feature) => {
    toast({
      title: t('home.faq.toast.devTitle'),
      description: t('home.faq.toast.devDesc', { feature }),
      duration: 3000,
      className: 'bg-card text-card-foreground border-primary futuristic-border',
    });
  };
  
  const faqs = t('home.faq.questions', { returnObjects: true });
  const icons = [Brain, DownloadCloud, CreditCard, UserPlus, Settings2, FileText, Clock, ShieldCheck];
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const faqItemVariants = {
    hidden: { opacity: 0, x: -30, filter: 'blur(3px)' },
    visible: { 
      opacity: 1, 
      x: 0, 
      filter: 'blur(0px)',
      transition: { type: "spring", stiffness: 50, damping: 15 }
    }
  };

  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-28 bg-gradient-to-b from-background via-card/30 to-background section-intro-glow">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16 md:mb-20 lg:mb-24"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center mb-6 sm:mb-7 md:mb-8 gap-3 sm:gap-4 md:gap-5">
            <HelpCircle className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-accent sm:mr-5 opacity-90 flex-shrink-0" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground animate-text-focus-in px-2" dangerouslySetInnerHTML={{ __html: t('home.faq.title') }} />
          </div>
          <p className="text-base sm:text-lg md:text-xl text-secondary-type max-w-3xl mx-auto px-4">
            {t('home.faq.description')}
          </p>
          <div className="section-divider mt-6 sm:mt-7 md:mt-8"></div>
        </motion.div>

        <motion.div 
          className="max-w-4xl mx-auto grid grid-cols-1 gap-y-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {faqs.map((faq, index) => {
            const IconComponent = icons[index % icons.length];
            return (
              <motion.div
                key={index}
                variants={faqItemVariants}
              >
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value={`item-${index}`} className="glass-card rounded-lg sm:rounded-xl border-t-2 border-primary/40 shadow-xl shadow-primary/10 overflow-hidden hover:border-accent/60 transition-all duration-300 group">
                    <AccordionTrigger className="px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 text-left hover:bg-primary/5 transition-colors w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-card rounded-t-lg sm:rounded-t-xl [&:hover>div>span]:underline">
                      <div className="flex items-center w-full gap-2 sm:gap-3 md:gap-4">
                        <IconComponent className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-accent sm:mr-3 md:mr-5 flex-shrink-0 group-hover:scale-110 transition-transform`} />
                        <span className="text-base sm:text-lg md:text-xl font-semibold text-foreground flex-grow text-left">
                          {faq.question}
                        </span>
                         <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground transition-transform duration-300 group-data-[state=open]:rotate-90 ml-2 sm:ml-3 md:ml-4 flex-shrink-0" />
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 md:pb-8 pt-2 bg-card/30 rounded-b-lg sm:rounded-b-xl">
                      <p className="text-secondary-type leading-relaxed text-sm sm:text-base">
                        {faq.answer}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </motion.div>
            )
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mt-12 sm:mt-16 md:mt-20 lg:mt-28"
        >
          <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 text-foreground futuristic-border shadow-2xl shadow-primary/10">
            <MessageSquare className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-accent mx-auto mb-6 sm:mb-7 md:mb-8" />
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-5 md:mb-6 px-2" dangerouslySetInnerHTML={{ __html: t('home.faq.ctaTitle') }} />
            <p className="text-secondary-type text-base sm:text-lg mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto px-4">
              {t('home.faq.ctaDescription')}
            </p>
            <Button
              size="lg"
              onClick={() => handleFeatureClick('Contact Support')}
              className="bg-gradient-to-r from-accent to-orange-500 hover:shadow-accent/40 text-accent-foreground px-6 sm:px-8 md:px-10 lg:px-12 py-4 sm:py-4.5 md:py-5 rounded-lg sm:rounded-xl font-semibold text-base sm:text-lg md:text-xl transition-all futuristic-button pulse-glow shadow-xl shadow-accent/30 group w-full sm:w-auto"
            >
              {t('home.faq.ctaButton')} <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;