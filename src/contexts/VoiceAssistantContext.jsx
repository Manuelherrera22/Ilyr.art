import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useProfile } from '@/contexts/ProfileContext';
import { useToast } from '@/components/ui/use-toast';

const VoiceAssistantContext = createContext(undefined);

export const VoiceAssistantProvider = ({ children }) => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const location = useLocation();
  const { toast } = useToast();

  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [lastUserAction, setLastUserAction] = useState(null);

  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const speechSynthesis = window.speechSynthesis;
    
    if (SpeechRecognition && speechSynthesis) {
      setIsSupported(true);
      
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'es-ES';
      
      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setTranscript('');
      };
      
      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        setTranscript(finalTranscript || interimTranscript);
        
        if (finalTranscript) {
          handleVoiceInput(finalTranscript);
        }
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Error de reconocimiento de voz",
          description: "No se pudo procesar tu voz. Intenta de nuevo.",
          variant: "destructive"
        });
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
      
      synthRef.current = speechSynthesis;
    } else {
      setIsSupported(false);
      toast({
        title: "Navegador no compatible",
        description: "Tu navegador no soporta reconocimiento de voz. Usa el modo texto.",
        variant: "destructive"
      });
    }
  }, []);

  const getCurrentContext = useCallback(() => {
    const currentRoute = location.pathname;
    const userStatus = {
      has_uploaded: false,
      has_preview: false,
      current_project: null,
      last_action: lastUserAction
    };

    return {
      current_route: currentRoute,
      user_status: userStatus,
      profile_type: profile?.profile_type || 'usuario',
      user_name: profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Usuario',
      timestamp: new Date().toISOString()
    };
  }, [location.pathname, profile, user, lastUserAction]);

  const handleVoiceInput = useCallback(async (speechText) => {
    const context = getCurrentContext();
    
    const voiceData = {
      speech_input: speechText,
      context: context
    };

    console.log('Voice input captured:', voiceData);

    try {
      const response = await processVoiceCommand(voiceData);
      if (response) {
        speak(response);
      }
    } catch (error) {
      console.error('Error processing voice command:', error);
      speak("Lo siento, hubo un error procesando tu solicitud. ¿Puedes intentar de nuevo?");
    }
  }, [getCurrentContext]);

  const processVoiceCommand = useCallback(async (voiceData) => {
    const { speech_input, context } = voiceData;
    
    const responses = {
      'subir': 'Perfecto, te ayudo a subir tu producto. Puedes arrastrar y soltar tu imagen en la zona de carga o hacer clic en el botón de subir.',
      'previsualizar': 'Excelente idea. Para previsualizar tu producto, primero necesitas subir una imagen. Luego podrás elegir diferentes fondos y estilos.',
      'editor': 'Te llevo al editor visual. Allí podrás añadir tipografías, logos y animaciones a tu proyecto.',
      'exportar': 'Para exportar tu proyecto, ve a la sección de exportador inteligente donde podrás elegir el formato perfecto para cada red social.',
      'ayuda': 'Estoy aquí para ayudarte. Puedes pedirme que te guíe por cualquier función de ILYR.art o preguntarme sobre mejores prácticas creativas.',
      'dashboard': 'Te encuentras en tu dashboard creativo. Desde aquí puedes acceder a todas las herramientas de ILYR.art organizadas por etapas.',
      'perfil': 'Para completar tu perfil, ve a la sección de configuración donde podrás añadir tu información personal y preferencias creativas.'
    };

    const lowerInput = speech_input.toLowerCase();
    
    for (const [keyword, response] of Object.entries(responses)) {
      if (lowerInput.includes(keyword)) {
        return response;
      }
    }

    if (context.current_route.includes('diy')) {
      return `Estás en el modo DIY. ${speech_input.includes('cómo') ? 'Te recomiendo empezar subiendo tu producto y luego usar el previsualizador.' : 'Puedes usar todas las herramientas de IA para crear tu contenido.'}`;
    }

    if (context.current_route.includes('professional')) {
      return `Estás en el modo profesional. ${speech_input.includes('cómo') ? 'Te sugiero crear un brief detallado para que nuestro equipo pueda ayudarte mejor.' : 'Nuestro equipo creativo está listo para trabajar en tu proyecto.'}`;
    }

    return `Entiendo que dijiste: "${speech_input}". Esta funcionalidad de IA conversacional está en desarrollo. Por ahora, puedo ayudarte con navegación básica y sugerencias generales.`;
  }, []);

  const speak = useCallback((text) => {
    if (!synthRef.current || isSpeaking) return;

    synthRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  }, [isSpeaking]);

  const startListening = useCallback(() => {
    if (!isSupported || !recognitionRef.current || isListening) return;

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      toast({
        title: "Error al iniciar grabación",
        description: "No se pudo activar el micrófono. Verifica los permisos.",
        variant: "destructive"
      });
    }
  }, [isSupported, isListening, toast]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const trackUserAction = useCallback((action) => {
    setLastUserAction({
      action,
      timestamp: new Date().toISOString(),
      route: location.pathname
    });
  }, [location.pathname]);

  const value = {
    isListening,
    isSpeaking,
    transcript,
    isSupported,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    trackUserAction,
    getCurrentContext
  };

  return (
    <VoiceAssistantContext.Provider value={value}>
      {children}
    </VoiceAssistantContext.Provider>
  );
};

export const useVoiceAssistant = () => {
  const context = useContext(VoiceAssistantContext);
  if (context === undefined) {
    throw new Error('useVoiceAssistant must be used within a VoiceAssistantProvider');
  }
  return context;
};