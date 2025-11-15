import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, X, Send, Sparkles, Lightbulb, Zap, MessageCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const CreativeCopilotBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [message, setMessage] = useState('');
  const { toast } = useToast();

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    toast({
      title: "🚧 Esta funcionalidad no está implementada aún—¡pero no te preocupes! ¡Puedes solicitarla en tu próximo prompt! 🚀",
      description: "El Copilot IA estará disponible pronto para ayudarte con tus proyectos creativos.",
      duration: 4000,
    });
    
    setMessage('');
    setIsOpen(false);
  };

  const quickSuggestions = [
    {
      icon: Lightbulb,
      text: "¿Cómo empiezo mi primer proyecto?",
      gradient: "from-yellow-400 to-orange-500"
    },
    {
      icon: Sparkles,
      text: "Mejores prácticas para visualización",
      gradient: "from-purple-400 to-pink-500"
    },
    {
      icon: Zap,
      text: "Optimizar mi flujo de trabajo",
      gradient: "from-blue-400 to-cyan-500"
    }
  ];

  return (
    <>
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <motion.div
          onMouseEnter={() => setIsTooltipVisible(true)}
          onMouseLeave={() => setIsTooltipVisible(false)}
          className="relative"
        >
          <AnimatePresence>
            {isTooltipVisible && !isOpen && (
              <motion.div
                initial={{ opacity: 0, x: 20, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-[#0B0D12]/95 backdrop-blur-xl border border-[#FF3CAC]/30 rounded-lg px-4 py-2 shadow-xl"
              >
                <p className="text-white text-sm whitespace-nowrap font-medium">
                  ¿Necesitas ayuda para continuar?
                </p>
                <div className="absolute right-[-6px] top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-[6px] border-l-[#FF3CAC]/30 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent"></div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 bg-gradient-to-br from-[#FF3CAC] to-[#784BA0] rounded-full flex items-center justify-center shadow-2xl shadow-[#FF3CAC]/30 border-2 border-white/10"
            whileHover={{ 
              scale: 1.1,
              boxShadow: "0 0 30px rgba(255, 60, 172, 0.5)"
            }}
            whileTap={{ scale: 0.95 }}
            animate={{
              boxShadow: [
                "0 0 20px rgba(255, 60, 172, 0.3)",
                "0 0 30px rgba(255, 60, 172, 0.5)",
                "0 0 20px rgba(255, 60, 172, 0.3)"
              ]
            }}
            transition={{
              boxShadow: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Brain className="w-8 h-8 text-white" />
            </motion.div>
          </motion.button>

          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.7, 1]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <Card className="bg-gradient-to-br from-[#0D0F15]/95 to-[#0B0D12]/95 border border-[#FF3CAC]/30 backdrop-blur-xl shadow-2xl">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center text-white text-xl">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#FF3CAC] to-[#784BA0] rounded-lg flex items-center justify-center mr-3">
                        <Brain className="w-6 h-6 text-white" />
                      </div>
                      Copilot Creativo IA
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsOpen(false)}
                      className="text-white/70 hover:text-white hover:bg-white/10"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                  <p className="text-white/60 text-sm mt-2">
                    ¡Hola! Soy tu asistente creativo. ¿En qué puedo ayudarte hoy?
                  </p>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <p className="text-white/80 text-sm font-medium">Sugerencias rápidas:</p>
                    {quickSuggestions.map((suggestion, index) => (
                      <motion.button
                        key={index}
                        onClick={() => {
                          setMessage(suggestion.text);
                          handleSendMessage();
                        }}
                        className="w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#FF3CAC]/30 transition-all duration-300 text-left group"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center">
                          <div className={`w-8 h-8 bg-gradient-to-r ${suggestion.gradient} rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform`}>
                            <suggestion.icon className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-white/80 text-sm group-hover:text-white transition-colors">
                            {suggestion.text}
                          </span>
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Escribe tu pregunta aquí..."
                        className="flex-1 bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#FF3CAC]/50 focus:bg-white/10 transition-all"
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!message.trim()}
                        className="bg-gradient-to-r from-[#FF3CAC] to-[#784BA0] hover:opacity-90 disabled:opacity-50 px-4"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-white/40 text-xs">
                      Powered by ILYR.AI • Disponible 24/7
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CreativeCopilotBubble;