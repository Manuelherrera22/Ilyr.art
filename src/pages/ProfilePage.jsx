import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useProfile } from '@/contexts/ProfileContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, User } from 'lucide-react';

const ProfilePage = ({ setHeaderStep }) => {
  const { user } = useAuth();
  const { profile, loadingProfile, refreshProfile } = useProfile();
  const { toast } = useToast();

  const [fullName, setFullName] = useState('');
  const [profileType, setProfileType] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setHeaderStep('Mi Cuenta', 0, 0);
    if (profile) {
      setFullName(profile.full_name || '');
      setProfileType(profile.profile_type || '');
    }
  }, [setHeaderStep, profile]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName, profile_type: profileType })
        .eq('id', user.id);
      
      if (error) throw error;

      toast({ title: 'Perfil actualizado', description: 'Tus datos se han guardado correctamente.' });
      refreshProfile();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error al actualizar', description: error.message });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 sm:space-y-8 px-2 sm:px-4">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4"><User className="text-primary h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 flex-shrink-0" /><span>Mi Cuenta</span></h1>
        <p className="text-white/60 mt-2 text-sm sm:text-base">Gestiona tu información personal y revisa la actividad de tu cuenta.</p>
      </motion.div>

      <Card className="glass-card">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-white text-lg sm:text-xl">Información del Perfil</CardTitle>
          <CardDescription className="text-sm sm:text-base">Actualiza tu nombre y tipo de perfil.</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {loadingProfile ? (
            <div className="flex justify-center items-center h-32 sm:h-40"><Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary" /></div>
          ) : (
            <form onSubmit={handleUpdateProfile} className="space-y-4 sm:space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/80 text-sm sm:text-base">Email</Label>
                <Input id="email" type="email" value={user?.email || ''} disabled className="bg-white/10 border-white/20 text-sm sm:text-base" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-white/80 text-sm sm:text-base">Nombre Completo</Label>
                <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} className="bg-white/5 border-white/20 text-white text-sm sm:text-base" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profileType" className="text-white/80 text-sm sm:text-base">Tipo de Perfil</Label>
                <Input id="profileType" value={profileType} disabled className="bg-white/10 border-white/20 text-sm sm:text-base" />
              </div>
              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={isUpdating} className="bg-gradient-to-r from-[#FF3CAC] to-[#784BA0] w-full sm:w-auto text-sm sm:text-base">
                  {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isUpdating ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;