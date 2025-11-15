import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, X, CornerDownLeft, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

const CopilotChatModal = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (isOpen) {
      setMessages([
        { 
          id: Date.now(), 
          text: "¡Hola! Soy ILYR Copilot, tu asistente de diseño IA. Describe tu concepto o necesidad visual y te ayudaré a definir estilos, explorar tendencias y estructurar tu proyecto.", 
          sender: 'bot' 
        }
      ]);
      setInputValue(''); // Clear input when modal opens
    }
  }, [isOpen]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    const newUserMessage = { id: Date.now(), text: inputValue, sender: 'user' };
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setInputValue('');

    // Simulate bot response
    setTimeout(() => {
      const botResponseText = `Entendido. Has indicado: "${inputValue}". Estoy analizando tu solicitud para generar conceptos visuales y sugerencias técnicas...`;
      const botThinkingMessage = { id: Date.now() + 1, text: botResponseText, sender: 'bot' };
      setMessages(prevMessages => [...prevMessages, botThinkingMessage]);
      
      setTimeout(() => {
        toast({
          title: "🚧 Lógica IA en desarrollo",
          description: "La interpretación avanzada de IA y la generación de previsualizaciones detalladas se implementarán en futuras actualizaciones.",
          duration: 5000,
          className: 'bg-card text-card-foreground border-primary futuristic-border',
        });
        const botFollowUp = { id: Date.now() + 2, text: "¿Deseas que intente generar una previsualización básica basada en tu descripción? (Esta funcionalidad se encuentra en desarrollo)", sender: 'bot' };
        setMessages(prevMessages => [...prevMessages, botFollowUp]);
      }, 1500);

    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-card text-card-foreground w-full max-w-lg rounded-xl shadow-2xl futuristic-border flex flex-col overflow-hidden max-h-[80vh]"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <header className="p-5 border-b border-border/50 flex justify-between items-center bg-card/80">
              <div className="flex items-center space-x-3">
                <Sparkles className="w-7 h-7 text-primary animate-pulse" />
                <h2 className="text-xl font-bold gradient-text">ILYR Copilot</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:text-accent">
                <X className="w-6 h-6" />
              </Button>
            </header>

            <div className="flex-grow p-6 space-y-4 overflow-y-auto custom-scrollbar">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg text-sm md:text-base ${
                      msg.sender === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-muted/50 text-foreground rounded-bl-none border border-border/30'
                    }`}
                  >
                    {msg.sender === 'bot' && <Bot className="w-5 h-5 inline-block mr-2 mb-0.5 text-secondary" />}
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-5 border-t border-border/50 bg-card/80">
              <div className="flex items-center space-x-3">
                <Input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Describe tu idea o necesidad visual..."
                  className="flex-grow bg-background/50 border-border/50 focus:border-primary text-base py-3 px-4"
                  aria-label="Mensaje para ILYR Copilot"
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  className="w-12 h-12 bg-gradient-to-r from-accent to-orange-500 text-accent-foreground futuristic-button pulse-glow"
                  disabled={!inputValue.trim()}
                  aria-label="Enviar mensaje"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                <CornerDownLeft className="w-3 h-3 inline mr-1" /> Presiona Enter o haz clic en Enviar.
              </p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CopilotChatModal;