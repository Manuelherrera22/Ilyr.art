import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Mic, Volume2 } from 'lucide-react';
import { useVoiceAssistant } from '@/contexts/VoiceAssistantContext';
import VoiceCopilotModal from '@/components/voice/VoiceCopilotModal';

const VoiceCopilotBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  
  const { isListening, isSpeaking } = useVoiceAssistant();

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
                  🎙️ ¿Necesitas ayuda? ¡Háblame!
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
              animate={{ 
                rotate: isListening ? [0, 5, -5, 0] : [0, 5, -5, 0],
                scale: isSpeaking ? [1, 1.1, 1] : 1
              }}
              transition={{ 
                rotate: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                scale: { duration: 0.5, repeat: Infinity }
              }}
            >
              {isListening ? (
                <Mic className="w-8 h-8 text-white" />
              ) : isSpeaking ? (
                <Volume2 className="w-8 h-8 text-white" />
              ) : (
                <Brain className="w-8 h-8 text-white" />
              )}
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

      <VoiceCopilotModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default VoiceCopilotBubble;