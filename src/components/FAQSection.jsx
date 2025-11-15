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
    <section className="py-28 bg-gradient-to-b from-background via-card/30 to-background section-intro-glow">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <div className="flex items-center justify-center mb-8">
            <HelpCircle className="w-16 h-16 text-accent mr-5 opacity-90" />
            <h2 className="text-5xl md:text-6xl font-bold text-foreground animate-text-focus-in" dangerouslySetInnerHTML={{ __html: t('home.faq.title') }} />
          </div>
          <p className="text-xl text-secondary-type max-w-3xl mx-auto">
            {t('home.faq.description')}
          </p>
          <div className="section-divider mt-8"></div>
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
                  <AccordionItem value={`item-${index}`} className="glass-card rounded-xl border-t-2 border-primary/40 shadow-xl shadow-primary/10 overflow-hidden hover:border-accent/60 transition-all duration-300 group">
                    <AccordionTrigger className="px-8 py-6 text-left hover:bg-primary/5 transition-colors w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-card rounded-t-xl [&:hover>div>span]:underline">
                      <div className="flex items-center w-full">
                        <IconComponent className={`w-8 h-8 text-accent mr-5 flex-shrink-0 group-hover:scale-110 transition-transform`} />
                        <span className="text-lg md:text-xl font-semibold text-foreground flex-grow">
                          {faq.question}
                        </span>
                         <ChevronRight className="h-6 w-6 text-muted-foreground transition-transform duration-300 group-data-[state=open]:rotate-90 ml-4" />
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-8 pb-8 pt-2 bg-card/30 rounded-b-xl">
                      <p className="text-secondary-type leading-relaxed text-sm md:text-base">
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
          className="text-center mt-28"
        >
          <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-3xl p-12 text-foreground futuristic-border shadow-2xl shadow-primary/10">
            <MessageSquare className="w-16 h-16 text-accent mx-auto mb-8" />
            <h3 className="text-4xl font-bold mb-6" dangerouslySetInnerHTML={{ __html: t('home.faq.ctaTitle') }} />
            <p className="text-secondary-type text-lg mb-10 max-w-2xl mx-auto">
              {t('home.faq.ctaDescription')}
            </p>
            <Button
              size="lg"
              onClick={() => handleFeatureClick('Contact Support')}
              className="bg-gradient-to-r from-accent to-orange-500 hover:shadow-accent/40 text-accent-foreground px-12 py-5 rounded-xl font-semibold text-xl transition-all futuristic-button pulse-glow shadow-xl shadow-accent/30 group"
            >
              {t('home.faq.ctaButton')} <ChevronRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;