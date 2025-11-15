import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Bell, Sun, Moon, Menu } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import VoiceAssistantButton from '@/components/VoiceAssistantButton';

const DashboardHeader = ({ toggleSidebar, currentStepName, currentStepIndex, totalSteps }) => {
  const { toast } = useToast();
  
  const handleThemeToggle = () => {
    toast({ 
      title: "🚧 Esta funcionalidad no está implementada aún—¡pero no te preocupes! ¡Puedes solicitarla en tu próximo prompt! 🚀", 
      description: "El cambio de tema estará disponible pronto." 
    });
  };
  
  const handleNotifications = () => {
    toast({ 
      title: "🚧 Esta funcionalidad no está implementada aún—¡pero no te preocupes! ¡Puedes solicitarla en tu próximo prompt! 🚀", 
      description: "Las notificaciones estarán disponibles pronto." 
    });
  };

  return (
    <header className="flex-shrink-0 flex flex-col h-auto px-4 sm:px-8 border-b border-white/10 bg-[#0B0D12]/80 backdrop-blur-xl">
      <div className="flex items-center justify-between h-[65px]">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="lg:hidden text-white hover:bg-white/10 mr-2" onClick={toggleSidebar}>
            <Menu className="h-5 w-5" />
          </Button>
          <p className="text-sm text-white/60 hidden sm:block">{currentStepName}</p>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <VoiceAssistantButton />
          <Button variant="ghost" size="icon" onClick={handleThemeToggle} className="text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300">
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleNotifications} className="text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </div>
      {totalSteps > 0 && (
        <div className="w-full bg-white/5 rounded-full h-2 my-2">
            <motion.div
                className="bg-gradient-to-r from-[#FF3CAC] to-[#784BA0] h-2 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
            />
        </div>
      )}
    </header>
  );
};

export default DashboardHeader;