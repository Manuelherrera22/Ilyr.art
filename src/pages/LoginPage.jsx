import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Lock, LogIn, UserPlus, Eye, EyeOff, Sparkles, Home } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from 'react-i18next';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { error } = await signIn(formData.email, formData.password);
    
    if (error) {
      toast({
        variant: "destructive",
        title: t('login.errorTitle'),
        description: error.message || "Credenciales incorrectas",
      });
      setIsLoading(false);
    } else {
      toast({
        title: t('login.successTitle'),
        description: t('login.successDescription'),
        className: 'bg-green-500 text-white',
      });
      
      setTimeout(() => {
        window.location.href = "/portal";
      }, 1000);
    }
  };
  
  const handleForgotPassword = () => {
    toast({
      title: "🚧 Funcionalidad en desarrollo",
      description: "La recuperación de contraseña estará disponible pronto. ¡Gracias por tu paciencia!",
      duration: 4000,
      className: 'bg-card text-card-foreground border-primary futuristic-border',
    });
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background via-primary/10 to-background p-4">
      <Link to="/" className="absolute top-6 left-6 z-10">
        <Button variant="ghost" className="text-foreground hover:bg-accent/10 hover:text-accent">
          <Home className="mr-2 h-4 w-4" />
          {t('login.backToHome')}
        </Button>
      </Link>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        <Card className="glass-card rounded-2xl border-t-2 border-primary/50 shadow-2xl shadow-primary/20">
          <CardHeader className="p-8 pb-4 text-center">
            <motion.div 
              className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/30"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <LogIn className="w-10 h-10 text-white" />
            </motion.div>
            <CardTitle className="text-foreground text-3xl">{t('login.title')}</CardTitle>
            <CardDescription className="text-secondary-type mt-2">{t('login.description')}</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">{t('login.emailLabel')}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    placeholder="tu@email.com" 
                    value={formData.email}
                    onChange={handleInputChange} 
                    required 
                    className="pl-10 bg-background/50 border-primary/25"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">{t('login.passwordLabel')}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    id="password" 
                    name="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    value={formData.password}
                    onChange={handleInputChange} 
                    required 
                    className="pl-10 pr-10 bg-background/50 border-primary/25"
                  />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground" 
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="text-right">
                <Button type="button" variant="link" className="p-0 h-auto text-accent text-sm" onClick={handleForgotPassword}>
                  {t('login.forgotPassword')}
                </Button>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading} 
                size="lg" 
                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-95 text-primary-foreground py-6 text-lg font-semibold futuristic-button pulse-glow"
              >
                {isLoading ? (
                  <motion.div 
                    animate={{ rotate: 360 }} 
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }} 
                    className="w-5 h-5 mr-3"
                  >
                    <Sparkles className="w-full h-full" />
                  </motion.div>
                ) : <LogIn className="mr-3 h-5 w-5" />}
                {isLoading ? t('login.loading') : t('login.button')}
              </Button>
            </form>
            <div className="mt-8 text-center">
              <p className="text-muted-foreground">
                {t('login.noAccount')}{' '}
                <Link to="/register" className="font-semibold text-accent hover:text-accent/80 transition-colors">
                  <Button variant="ghost" className="text-accent hover:text-accent/80 hover:bg-accent/10">
                    <UserPlus className="mr-2 h-4 w-4" />{t('login.joinWaitlist')}
                  </Button>
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;