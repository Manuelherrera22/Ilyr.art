import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Wand2, Users, ArrowRight, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/contexts/ProfileContext';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const FlowChoiceCard = ({ icon: Icon, title, description, cta, path, delay, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    whileHover={{ y: -10, scale: 1.03 }}
    className="w-full max-w-lg cursor-pointer"
    onClick={() => onClick(path)}
  >
    <div className="glass-card rounded-2xl p-8 h-full flex flex-col group">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-[#FF3CAC]/20 to-[#784BA0]/20 rounded-xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-8 h-8 text-[#FF3CAC]" />
        </div>
        <h2 className="text-3xl font-bold text-white">{title}</h2>
      </div>
      <p className="text-white/70 text-lg flex-grow mb-8">{description}</p>
      <Button
        variant="ghost"
        className="w-full text-lg justify-center py-6 bg-white/5 hover:bg-white/10 text-white border border-white/10 group-hover:border-[#FF3CAC]/50 transition-all duration-300"
      >
        {cta}
        <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  </motion.div>
);

const CreativeFlowSelectionPage = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { user } = useAuth();
  const userName = profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Creador';

  const handleSelection = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen w-full bg-[#0B0D12] bg-pattern flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 section-intro-glow" />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="text-center z-10"
      >
        <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-[#FF3CAC] to-[#784BA0] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#FF3CAC]/20">
          <Zap className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
          ¿Cómo quieres crear tu video, <span className="gradient-text">{userName}</span>?
        </h1>
        <p className="text-xl md:text-2xl text-white/60 max-w-3xl mx-auto">
          Elige tu camino. Ya sea que prefieras la velocidad de la IA o el toque de nuestros expertos, tenemos la solución perfecta para ti.
        </p>
      </motion.div>

      <div className="flex flex-col lg:flex-row items-stretch justify-center gap-12 mt-16 z-10">
        <FlowChoiceCard
          icon={Wand2}
          title="Yo lo hago con IA"
          description="Crea como un profesional, sin serlo. Construye tu idea con nuestras herramientas inteligentes y obtén resultados espectaculares en minutos."
          cta="Empezar con IA"
          path="/dashboard/diy"
          delay={0.3}
          onClick={handleSelection}
        />
        <FlowChoiceCard
          icon={Users}
          title="Delegar al equipo"
          description="Dedícate a soñar, nosotros lo hacemos realidad. Nuestro equipo de creativos expertos transformará tu visión en una pieza final impactante."
          cta="Encargar a Profesionales"
          path="/dashboard/professional"
          delay={0.5}
          onClick={handleSelection}
        />
      </div>
    </div>
  );
};

export default CreativeFlowSelectionPage;