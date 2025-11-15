import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Trash2, Lightbulb, Loader2, ServerCrash, FileQuestion, Image as ImageIcon, Edit } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { listarIdeas, deleteIdea } from '@/services/api/ideas';

const ProfessionalDashboardPage = ({ setHeaderStep }) => {
  const { session } = useAuth();
  const { toast } = useToast();

  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setHeaderStep('Gestor de Ideas', 0, 0);
  }, [setHeaderStep]);

  const fetchIdeas = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    setError(null);
    try {
      const fetchedIdeas = await listarIdeas(session);
      setIdeas(fetchedIdeas || []);
    } catch (err) {
      setError(err.message);
      toast({
        variant: 'destructive',
        title: 'Error de Carga',
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  }, [session, toast]);

  useEffect(() => {
    fetchIdeas();
  }, [fetchIdeas]);

  const handleDeleteIdea = async (ideaId) => {
    try {
      await deleteIdea(ideaId, session);
      toast({
        title: 'Idea Eliminada',
        description: 'La idea ha sido eliminada correctamente.',
        className: 'bg-green-500 text-white'
      });
      setIdeas(prevIdeas => prevIdeas.filter(idea => idea.id !== ideaId));
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error al Eliminar',
        description: err.message,
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 sm:mb-8"
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
          <Lightbulb className="text-primary h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 flex-shrink-0" />
          <span>Gestor de Ideas Visuales</span>
        </h1>
        <p className="text-white/60 mt-2 text-sm sm:text-base">Aquí puedes ver, editar y gestionar las ideas que has subido en el Flujo DIY.</p>
      </motion.div>

      <div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center h-64 flex flex-col justify-center items-center bg-red-500/10 rounded-lg">
            <ServerCrash className="h-12 w-12 text-red-400 mb-4" />
            <p className="text-xl text-red-400">Error al cargar las ideas</p>
            <p className="text-white/60">{error}</p>
            <Button onClick={fetchIdeas} variant="outline" className="mt-4">Reintentar</Button>
          </div>
        ) : ideas.length === 0 ? (
          <div className="text-center h-64 flex flex-col justify-center items-center bg-white/5 rounded-lg">
            <FileQuestion className="h-12 w-12 text-white/40 mb-4" />
            <p className="text-xl text-white/80">No tienes ideas guardadas</p>
            <p className="text-white/60">Ve al 'Flujo DIY' para empezar a crear.</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {ideas.map(idea => (
                <motion.div key={idea.id} variants={itemVariants} layout exit={{ opacity: 0, scale: 0.8 }}>
                  <Card className="glass-card h-full flex flex-col overflow-hidden">
                    <CardHeader className="flex-row items-center justify-between p-3 sm:p-4 gap-2">
                       <p className="text-[10px] sm:text-xs text-white/50 truncate">ID: {idea.id.substring(0,8)}...</p>
                       <div className="flex items-center space-x-1 flex-shrink-0">
                          <Button asChild variant="ghost" size="icon" className="text-primary hover:bg-primary/20 hover:text-primary-focus flex-shrink-0 h-7 w-7 sm:h-8 sm:w-8">
                            <Link to={`/dashboard/diy?ideaId=${idea.id}`}>
                              <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" className="text-red-400 hover:bg-red-500/20 hover:text-red-300 flex-shrink-0 h-7 w-7 sm:h-8 sm:w-8" onClick={() => handleDeleteIdea(idea.id)}>
                            <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </Button>
                       </div>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-4 pt-0 flex-grow grid grid-cols-2 gap-3 sm:gap-4">
                      <div className="space-y-2">
                        <p className="text-sm font-bold text-white/80">Producto</p>
                        <div className="aspect-square bg-black/20 rounded-lg flex items-center justify-center">
                          {idea.imagen_producto ? (
                            <img src={idea.imagen_producto} alt="Producto" className="w-full h-full object-cover rounded-lg" />
                          ): (
                            <ImageIcon className="h-8 w-8 text-white/30" />
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-bold text-white/80">Fondo</p>
                         <div className="aspect-square bg-black/20 rounded-lg flex items-center justify-center">
                          {idea.imagen_fondo ? (
                            <img src={idea.imagen_fondo} alt="Fondo" className="w-full h-full object-cover rounded-lg" />
                          ): (
                            <ImageIcon className="h-8 w-8 text-white/30" />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalDashboardPage;