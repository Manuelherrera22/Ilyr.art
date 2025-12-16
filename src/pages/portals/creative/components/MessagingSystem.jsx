import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  MessageSquare, 
  Send, 
  Paperclip,
  Search,
  User,
  Clock,
  CheckCircle,
  CheckCircle2,
  MoreVertical,
  Image as ImageIcon,
  FileText,
  ArrowLeft
} from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

const MessagingSystem = () => {
  const { user } = useAuth();
  const { i18n } = useTranslation();
  const currentLocale = i18n.language === 'es' ? es : enUS;
  
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // TODO: Fetch conversations from API
    const fetchConversations = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        // Simulated conversations data
        setConversations([
          {
            id: 1,
            participant: {
              id: 'producer1',
              name: 'María González',
              role: 'Productora',
              avatar: null
            },
            lastMessage: 'Perfecto, el trabajo quedó excelente. ¿Puedes hacer un pequeño ajuste?',
            lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
            unreadCount: 2,
            jobId: '1',
            jobTitle: 'Animación 3D para Campaña'
          },
          {
            id: 2,
            participant: {
              id: 'producer2',
              name: 'Carlos Ruiz',
              role: 'Productor',
              avatar: null
            },
            lastMessage: 'Gracias por la entrega rápida. El cliente está muy contento.',
            lastMessageTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
            unreadCount: 0,
            jobId: '2',
            jobTitle: 'VFX para Comercial'
          }
        ]);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [user]);

  useEffect(() => {
    if (selectedConversation) {
      // TODO: Fetch messages for selected conversation
      setMessages([
        {
          id: 1,
          senderId: 'producer1',
          senderName: 'María González',
          content: 'Hola, ¿cómo va el trabajo?',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
          read: true
        },
        {
          id: 2,
          senderId: user.id,
          senderName: 'Tú',
          content: 'Muy bien, casi terminado. Te envío un preview en unas horas.',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          read: true
        },
        {
          id: 3,
          senderId: 'producer1',
          senderName: 'María González',
          content: 'Perfecto, el trabajo quedó excelente. ¿Puedes hacer un pequeño ajuste?',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          read: false
        }
      ]);
    }
  }, [selectedConversation, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message = {
      id: messages.length + 1,
      senderId: user.id,
      senderName: 'Tú',
      content: newMessage,
      timestamp: new Date(),
      read: false
    };

    setMessages([...messages, message]);
    setNewMessage('');
    
    // TODO: Send message to API
  };

  const formatMessageTime = (date) => {
    if (isToday(date)) {
      return format(date, 'HH:mm', { locale: currentLocale });
    } else if (isYesterday(date)) {
      return 'Ayer';
    } else {
      return format(date, 'dd MMM', { locale: currentLocale });
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-primary" />
          Mensajería
        </h2>
        <p className="text-white/70">Comunícate con productores y clientes</p>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-3 h-[calc(100vh-200px)] sm:h-[calc(100vh-250px)] lg:h-[calc(100vh-300px)]">
        {/* Lista de conversaciones - Responsive */}
        <div className={`lg:col-span-1 flex flex-col ${selectedConversation ? 'hidden lg:flex' : 'flex'}`}>
          <Card className="bg-card/40 border-border/40 flex-1 flex flex-col h-full">
            <CardHeader className="p-3 sm:p-6">
              <div className="relative mb-3 sm:mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                <Input
                  placeholder="Buscar conversaciones..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background/50 border-white/10 text-white placeholder:text-white/40 text-sm"
                />
              </div>
              <CardTitle className="text-white text-base sm:text-lg">Conversaciones</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto space-y-2 p-3 sm:p-6 pt-0">
              {filteredConversations.length === 0 ? (
                <div className="text-center py-8 text-white/60">
                  <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p>No hay conversaciones</p>
                </div>
              ) : (
                filteredConversations.map((conversation) => (
                  <motion.div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      selectedConversation?.id === conversation.id
                        ? 'bg-primary/20 border border-primary/30'
                        : 'bg-white/5 border border-transparent hover:bg-white/10'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-primary/20 text-primary">
                          {conversation.participant.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-white text-sm truncate">
                            {conversation.participant.name}
                          </h4>
                          {conversation.unreadCount > 0 && (
                            <Badge className="bg-primary text-white text-xs">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-white/60 mb-1 truncate">
                          {conversation.jobTitle}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-white/50 truncate flex-1">
                            {conversation.lastMessage}
                          </p>
                          <span className="text-xs text-white/40 ml-2">
                            {formatMessageTime(conversation.lastMessageTime)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Área de mensajes - Responsive */}
        <div className={`lg:col-span-2 flex flex-col ${selectedConversation ? 'flex' : 'hidden lg:flex'}`}>
          {selectedConversation ? (
            <Card className="bg-card/40 border-border/40 flex-1 flex flex-col h-full">
              <CardHeader className="border-b border-white/10 p-3 sm:p-6">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedConversation(null)}
                      className="lg:hidden flex-shrink-0"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <Avatar className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
                      <AvatarFallback className="bg-primary/20 text-primary text-xs sm:text-sm">
                        {selectedConversation.participant.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-white text-base sm:text-lg truncate">
                        {selectedConversation.participant.name}
                      </CardTitle>
                      <p className="text-xs sm:text-sm text-white/60 truncate">
                        {selectedConversation.participant.role} • {selectedConversation.jobTitle}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="flex-shrink-0">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 overflow-y-auto space-y-3 sm:space-y-4 p-3 sm:p-4 md:p-6">
                <AnimatePresence>
                  {messages.map((message, index) => {
                    const isOwnMessage = message.senderId === user.id;
                    
                    return (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[85%] sm:max-w-[75%] md:max-w-[70%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                          {!isOwnMessage && (
                            <p className="text-xs text-white/60 mb-1 ml-2">
                              {message.senderName}
                            </p>
                          )}
                          <div className={`rounded-lg p-2 sm:p-3 ${
                            isOwnMessage
                              ? 'bg-primary/20 border border-primary/30'
                              : 'bg-white/10 border border-white/20'
                          }`}>
                            <p className="text-white text-sm break-words">{message.content}</p>
                            <div className="flex items-center gap-2 mt-1.5 sm:mt-2">
                              <span className="text-xs text-white/50">
                                {formatMessageTime(message.timestamp)}
                              </span>
                              {isOwnMessage && (
                                message.read ? (
                                  <CheckCircle2 className="w-3 h-3 text-blue-400 flex-shrink-0" />
                                ) : (
                                  <CheckCircle className="w-3 h-3 text-white/40 flex-shrink-0" />
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </CardContent>

              {/* Input de mensaje - Responsive */}
              <div className="border-t border-white/10 p-2 sm:p-3 md:p-4">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Button variant="ghost" size="icon" className="text-white/60 hover:text-white flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Input
                    placeholder="Escribe un mensaje..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="flex-1 bg-background/50 border-white/10 text-white placeholder:text-white/40 text-sm"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-primary hover:bg-primary/90 flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 p-0"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="bg-card/40 border-border/40 flex-1 flex items-center justify-center">
              <CardContent className="text-center">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-white/30" />
                <CardTitle className="text-white mb-2">Selecciona una conversación</CardTitle>
                <p className="text-white/70">
                  Elige una conversación de la lista para comenzar a chatear
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MessagingSystem;
