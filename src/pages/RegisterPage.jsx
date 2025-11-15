import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, UserPlus, Sparkles, Home, LogIn } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/customSupabaseClient';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
        toast({
            variant: "destructive",
            title: t('waitlist.errorTitle'),
            description: t('waitlist.errorInvalid'),
        });
        return;
    }
    setIsLoading(true);

    try {
        const { error } = await supabase.from('waitlist').insert({ email });

        if (error) {
            if (error.code === '23505') { // Unique constraint violation
                 toast({
                    variant: "destructive",
                    title: t('waitlist.errorTitle'),
                    description: t('waitlist.errorExists'),
                });
            } else {
                throw error;
            }
        } else {
            toast({
                title: t('waitlist.successTitle'),
                description: t('waitlist.successDescription'),
                className: 'bg-green-500 text-white',
            });
            setEmail('');
        }
    } catch(err) {
        toast({
            variant: "destructive",
            title: t('waitlist.errorTitle'),
            description: err.message || "An unexpected error occurred.",
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background via-secondary/10 to-background p-4">
      <Link to="/" className="absolute top-6 left-6 z-10">
        <Button variant="ghost" className="text-foreground hover:bg-accent/10 hover:text-accent">
          <Home className="mr-2 h-4 w-4" />
          {t('waitlist.backToHome')}
        </Button>
      </Link>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        <Card className="glass-card rounded-2xl border-t-2 border-secondary/50 shadow-2xl shadow-secondary/20">
          <CardHeader className="p-8 pb-4 text-center">
            <motion.div 
              className="w-20 h-20 bg-gradient-to-br from-secondary to-accent rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-secondary/30"
              whileHover={{ scale: 1.1, rotate: -5 }}
            >
              <UserPlus className="w-10 h-10 text-white" />
            </motion.div>
            <CardTitle className="text-foreground text-3xl">{t('waitlist.title')}</CardTitle>
            <CardDescription className="text-secondary-type mt-2">{t('waitlist.description')}</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="sr-only">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    id="email"
                    name="email" 
                    type="email" 
                    placeholder={t('waitlist.placeholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    className="pl-10 bg-background/50 border-secondary/25 text-lg h-14" />
                </div>
              </div>

              <Button type="submit" disabled={isLoading} size="lg" className="w-full bg-gradient-to-r from-secondary to-accent hover:opacity-95 text-primary-foreground py-6 text-lg font-semibold futuristic-button pulse-glow">
                {isLoading ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-5 h-5 mr-3"><Sparkles className="w-full h-full" /></motion.div>
                ) : <UserPlus className="mr-3 h-5 w-5" />}
                {isLoading ? t('waitlist.button') + '...' : t('waitlist.button')}
              </Button>
            </form>
            <div className="mt-8 text-center">
              <p className="text-muted-foreground">
                {t('waitlist.haveAccount')}{' '}
                <Link to="/login" className="font-semibold text-accent hover:text-accent/80 transition-colors">
                   {t('waitlist.login')}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default RegisterPage;