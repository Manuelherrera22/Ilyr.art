import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX, MessageSquare } from 'lucide-react';
import { useVoiceAssistant } from '@/contexts/VoiceAssistantContext';
import { useToast } from '@/components/ui/use-toast';

const VoiceAssistantButton = ({ showTextMode = true, className = "" }) => {
  const {
    isListening,
    isSpeaking,
    transcript,
    isSupported,
    startListening,
    stopListening,
    stopSpeaking
  } = useVoiceAssistant();
  
  const { toast } = useToast();
  const [showTranscript, setShowTranscript] = useState(false);

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else if (isSpeaking) {
      stopSpeaking();
    } else {
      startListening();
    }
  };

  const handleTextMode = () => {
    toast({
      title: "🚧 Modo texto en desarrollo",
      description: "El chat de texto estará disponible pronto. Por ahora usa el modo voz.",
      duration: 4000,
    });
  };

  if (!isSupported) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Button
          onClick={handleTextMode}
          variant="outline"
          size="sm"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Modo Texto
        </Button>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <motion.div className="relative">
        <Button
          onClick={handleVoiceToggle}
          variant={isListening ? "destructive" : isSpeaking ? "secondary" : "default"}
          size="sm"
          className={`relative overflow-hidden transition-all duration-300 ${
            isListening 
              ? "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30" 
              : isSpeaking
              ? "bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30"
              : "bg-gradient-to-r from-[#FF3CAC] to-[#784BA0] hover:opacity-90 text-white shadow-lg shadow-[#FF3CAC]/30"
          }`}
          disabled={!isSupported}
        >
          <motion.div
            animate={isListening ? { scale: [1, 1.2, 1] } : isSpeaking ? { rotate: [0, 10, -10, 0] } : {}}
            transition={isListening ? { duration: 1, repeat: Infinity } : isSpeaking ? { duration: 0.5, repeat: Infinity } : {}}
          >
            {isListening ? (
              <MicOff className="w-4 h-4 mr-2" />
            ) : isSpeaking ? (
              <VolumeX className="w-4 h-4 mr-2" />
            ) : (
              <Mic className="w-4 h-4 mr-2" />
            )}
          </motion.div>
          
          {isListening ? "Detener" : isSpeaking ? "Silenciar" : "🎙️ Hablar"}
          
          {isListening && (
            <motion.div
              className="absolute inset-0 bg-white/20"
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </Button>

        {(isListening || isSpeaking) && (
          <motion.div
            className={`absolute -inset-1 rounded-lg ${
              isListening ? "bg-red-500/30" : "bg-blue-500/30"
            }`}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </motion.div>

      {showTextMode && (
        <Button
          onClick={handleTextMode}
          variant="outline"
          size="sm"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Texto
        </Button>
      )}

      <AnimatePresence>
        {transcript && isListening && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.8 }}
            className="absolute left-full ml-4 top-1/2 transform -translate-y-1/2 bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2 max-w-xs"
          >
            <p className="text-white text-sm">
              <span className="text-[#FF3CAC] font-semibold">Escuchando:</span> {transcript}
            </p>
            <div className="absolute left-[-6px] top-1/2 transform -translate-y-1/2 w-0 h-0 border-r-[6px] border-r-black/80 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoiceAssistantButton;