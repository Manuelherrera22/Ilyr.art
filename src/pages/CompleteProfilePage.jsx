import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, UserPlus, Sparkles, Briefcase, Building2, UserCheck } from 'lucide-react';
import { useProfile } from '@/contexts/ProfileContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

const CompleteProfilePage = () => {
  const { profile, refreshProfile } = useProfile();
  const [formData, setFormData] = useState({ full_name: '', profile_type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        profile_type: profile.profile_type || '',
      });
    }
  }, [profile]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value) => {
    setFormData({ ...formData, profile_type: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.full_name || !formData.profile_type) {
      toast({
        title: '⚠️ Faltan datos',
        description: 'Por favor, completa todos los campos para continuar.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    
    const { error } = await supabase.rpc('update_user_profile', {
      full_name_input: formData.full_name,
      profile_type_input: formData.profile_type
    });

    if (error) {
      toast({
        title: '❌ Error al actualizar',
        description: error.message,
        variant: 'destructive',
      });
      setIsLoading(false);
    } else {
      await refreshProfile();
      toast({
        title: '✅ ¡Perfil completado!',
        description: 'Tu portal está listo para comenzar a co-crear.',
        className: 'bg-green-500 text-white',
      });
      navigate('/portal');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background via-primary/10 to-background p-4">
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
              <UserPlus className="w-10 h-10 text-white" />
            </motion.div>
            <CardTitle className="text-foreground text-3xl">Completa tu Perfil</CardTitle>
            <CardDescription className="text-secondary-type mt-2">Solo un paso más para desbloquear tu potencial creativo.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="full_name" className="text-sm font-medium text-foreground">Nombre Completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    id="full_name" 
                    name="full_name" 
                    type="text" 
                    placeholder="Tu nombre y apellido" 
                    value={formData.full_name}
                    onChange={handleInputChange} 
                    required 
                    className="pl-10 bg-background/50 border-primary/25"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">¿Cuál es tu perfil?</label>
                <Select onValueChange={handleSelectChange} value={formData.profile_type} required>
                  <SelectTrigger className="w-full bg-background/50 border-secondary/25">
                    <SelectValue placeholder="Selecciona tu perfil..." />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-secondary/50 text-foreground backdrop-blur-md">
                    <SelectItem value="freelancer" className="focus:bg-accent/20 cursor-pointer"><UserCheck className="inline-block mr-2 h-4 w-4 text-accent"/>Freelancer</SelectItem>
                    <SelectItem value="agencia" className="focus:bg-accent/20 cursor-pointer"><Building2 className="inline-block mr-2 h-4 w-4 text-accent"/>Agencia</SelectItem>
                    <SelectItem value="marca" className="focus:bg-accent/20 cursor-pointer"><Briefcase className="inline-block mr-2 h-4 w-4 text-accent"/>Marca / Empresa</SelectItem>
                  </SelectContent>
                </Select>
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
                ) : <UserPlus className="mr-3 h-5 w-5" />}
                {isLoading ? 'Guardando...' : 'Guardar y Continuar'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CompleteProfilePage;