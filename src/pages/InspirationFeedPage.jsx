import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Bookmark, MessageCircle, User, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const CreationCard = ({ creation, index }) => {
  const { toast } = useToast();
  const handleInteraction = () => {
    toast({
      title: "🚧 Funcionalidad en desarrollo",
      description: "Las interacciones estarán disponibles pronto.",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group"
    >
      <Card className="glass-card overflow-hidden">
        <div className="aspect-video bg-black/30 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
          <img  alt={creation.title || 'Visual creado por la comunidad'} className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1596672565061-b276adb3cf39" />
        </div>
        <CardContent className="p-4">
          <h3 className="font-bold text-white truncate">{creation.title || 'Sin Título'}</h3>
          <div className="flex items-center text-sm text-white/60 mt-1">
            <User className="w-4 h-4 mr-2" />
            <span>{creation.profiles?.full_name || 'Anónimo'}</span>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-4">
              <button onClick={handleInteraction} className="flex items-center space-x-1 text-white/70 hover:text-red-500 transition-colors">
                <Heart className="w-5 h-5" />
                <span>{creation.likes_count || 0}</span>
              </button>
              <button onClick={handleInteraction} className="flex items-center space-x-1 text-white/70 hover:text-primary transition-colors">
                <MessageCircle className="w-5 h-5" />
                <span>{creation.comments_count || 0}</span>
              </button>
            </div>
            <button onClick={handleInteraction} className="text-white/70 hover:text-secondary transition-colors">
              <Bookmark className="w-5 h-5" />
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const InspirationFeedPage = ({ setHeaderStep }) => {
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (setHeaderStep) {
      setHeaderStep('Feed de Inspiración', 0, 0);
    }
    fetchCreations();
  }, [setHeaderStep]);

  const fetchCreations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('creations')
      .select('*, profiles(full_name)')
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error fetching creations:', error);
    } else {
      setCreations(data);
    }
    setLoading(false);
  };

  return (
    <div className="w-full px-2 sm:px-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-8 sm:mb-10 md:mb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center sm:text-left flex-1"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Feed de Inspiración</h1>
          <p className="text-base sm:text-lg text-white/70 mt-2">Descubre lo que otros creadores están haciendo en ILYR.art</p>
        </motion.div>
        {!setHeaderStep && (
          <Button 
            onClick={() => navigate('/portal')}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10 w-full sm:w-auto text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Portal
          </Button>
        )}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : creations.length === 0 ? (
        <div className="text-center text-white/60 py-12 sm:py-16 md:py-20 px-4">
          <p className="text-sm sm:text-base">Aún no hay creaciones públicas. ¡Sé el primero en compartir!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {creations.map((creation, index) => (
            <CreationCard key={creation.id} creation={creation} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default InspirationFeedPage;