import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, X, Mic, Volume2, MessageSquare, Sparkles, Lightbulb, Zap, Bot } from 'lucide-react';
import { useVoiceAssistant } from '@/contexts/VoiceAssistantContext';
import VoiceAssistantButton from '@/components/VoiceAssistantButton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const VoiceCopilotModal = ({ isOpen, onClose }) => {
  const [message, setMessage] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);
  const [personality, setPersonality] = useState('creativo');
  
  const {
    isListening,
    isSpeaking,
    transcript,
    isSupported,
    speak,
    trackUserAction,
    getCurrentContext
  } = useVoiceAssistant();

  useEffect(() => {
    if (isOpen) {
      setConversationHistory([
        {
          id: Date.now(),
          type: 'bot',
          text: '¡Hola! Soy ILYR Copilot. Elige mi personalidad y dime cómo puedo ayudarte hoy.',
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (transcript && isOpen) {
      handleVoiceMessage(transcript);
    }
  }, [transcript, isOpen]);

  const handleVoiceMessage = (voiceText) => {
    if (!voiceText.trim()) return;
    const userMessage = { id: Date.now(), type: 'user', text: voiceText, timestamp: new Date(), isVoice: true };
    setConversationHistory(prev => [...prev, userMessage]);
    trackUserAction(`voice_query: ${voiceText}`);
    generateAndShowResponse(voiceText);
  };

  const handleTextMessage = () => {
    if (!message.trim()) return;
    const userMessage = { id: Date.now(), type: 'user', text: message, timestamp: new Date(), isVoice: false };
    setConversationHistory(prev => [...prev, userMessage]);
    trackUserAction(`text_query: ${message}`);
    generateAndShowResponse(message);
    setMessage('');
  };

  const generateAndShowResponse = (text) => {
    setTimeout(() => {
      const context = getCurrentContext();
      const botResponse = generateContextualResponse(text, context, personality);
      const botMessage = { id: Date.now() + 1, type: 'bot', text: botResponse, timestamp: new Date() };
      setConversationHistory(prev => [...prev, botMessage]);
      speak(botResponse);
    }, 800);
  };

  const generateContextualResponse = (input, context, personality) => {
    const lowerInput = input.toLowerCase();
    const { user_name } = context;

    const personalities = {
      creativo: {
        greeting: `¡Hola, ${user_name}! ✨ ¿Qué maravilla vamos a crear hoy? Desata tu imaginación.`,
        help: "Piensa en mí como tu musa personal. Puedo sugerirte estilos visuales, paletas de colores o conceptos innovadores. ¡Solo pregunta!",
        default: `Interesante... "${input}". Eso me hace pensar en... ¿qué tal si exploramos una estética onírica con animaciones fluidas? O quizás algo más audaz y vibrante. ¡Las posibilidades son infinitas!`
      },
      tecnico: {
        greeting: `Saludos, ${user_name}. Asistente técnico listo para optimizar. ¿Cuál es el objetivo de la sesión?`,
        help: "Mi función es asegurar la eficiencia. Puedo guiarte sobre formatos de archivo, resolución óptima, y los pasos técnicos para lograr tu visión sin contratiempos.",
        default: `Recibido: "${input}". Analizando... Para esta solicitud, te recomiendo usar un archivo PNG con fondo transparente para el producto y un video de fondo en formato MP4, H.264, a 30fps para máxima compatibilidad.`
      },
      tendencia: {
        greeting: `¡Hey, ${user_name}! 🚀 ¿Listos para romperla? Te diré qué está de moda ahora mismo.`,
        help: "Soy tu radar de tendencias. Te diré qué estilos, música y formatos están generando más impacto en redes sociales para que tu contenido se vuelva viral.",
        default: `Ok, "${input}". Justo ahora, los videos con estética 'Y2K' y música Phonk están teniendo un +35% de engagement en Reels. Te sugiero usar transiciones de glitch y una tipografía pixelada. ¿Lo intentamos?`
      }
    };

    const p = personalities[personality];

    if (lowerInput.includes('hola') || lowerInput.includes('buenos')) return p.greeting;
    if (lowerInput.includes('ayuda') || lowerInput.includes('cómo')) return p.help;
    
    return p.default;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[80vh] flex flex-col"
          >
            <Card className="bg-gradient-to-br from-[#0D0F15]/95 to-[#0B0D12]/95 border border-[#FF3CAC]/30 backdrop-blur-xl shadow-2xl flex flex-col h-full">
              <CardHeader className="pb-4 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-white text-xl">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#FF3CAC] to-[#784BA0] rounded-lg flex items-center justify-center mr-3">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    Asistente Progresivo IA
                  </CardTitle>
                  <Button variant="ghost" size="icon" onClick={onClose} className="text-white/70 hover:text-white hover:bg-white/10">
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                <div className="flex items-center justify-between mt-2">
                    <p className="text-white/60 text-sm">Personalidad del Asistente:</p>
                    <Select value={personality} onValueChange={setPersonality}>
                        <SelectTrigger className="w-[180px] bg-white/5 border-white/20">
                            <SelectValue placeholder="Elige una personalidad" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="creativo">Creativo ✨</SelectItem>
                            <SelectItem value="tecnico">Técnico ⚙️</SelectItem>
                            <SelectItem value="tendencia">Tendencia 🚀</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col space-y-4 overflow-hidden">
                <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                  {conversationHistory.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] p-3 rounded-lg text-sm ${ msg.type === 'user' ? 'bg-gradient-to-r from-[#FF3CAC] to-[#784BA0] text-white rounded-br-none' : 'bg-white/10 text-white rounded-bl-none border border-white/20'}`}>
                        <div className="flex items-center mb-1">
                          {msg.type === 'bot' && <Bot className="w-4 h-4 mr-2 text-[#FF3CAC]" />}
                          {msg.type === 'user' && (msg.isVoice ? <Mic className="w-4 h-4 mr-2" /> : <MessageSquare className="w-4 h-4 mr-2" />)}
                          <span className="text-xs opacity-70">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        {msg.text}
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <div className="border-t border-white/10 pt-4 flex-shrink-0">
                  <div className="flex space-x-2">
                    <VoiceAssistantButton showTextMode={false} />
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleTextMessage()}
                      placeholder="Escribe o habla conmigo..."
                      className="flex-1 bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#FF3CAC]/50 focus:bg-white/10 transition-all"
                    />
                    <Button onClick={handleTextMessage} disabled={!message.trim()} className="bg-gradient-to-r from-[#FF3CAC] to-[#784BA0] hover:opacity-90 disabled:opacity-50 px-4">
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VoiceCopilotModal;