import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Award, 
  Plus, 
  Search,
  CheckCircle,
  X,
  Star,
  TrendingUp,
  Target,
  Zap,
  Shield,
  Sparkles
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const SkillsManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [skills, setSkills] = useState([]);
  const [availableSkills, setAvailableSkills] = useState([
    'Blender', 'After Effects', 'Cinema 4D', 'Maya', 'Houdini', 'Nuke',
    'Photoshop', 'Illustrator', 'Premiere Pro', 'DaVinci Resolve',
    '3D Modeling', 'VFX', 'Motion Graphics', 'Video Editing', 'Compositing',
    'Character Animation', 'Rigging', 'Texturing', 'Lighting', 'Rendering'
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch skills from API
    const fetchSkills = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        // Simulated skills data
        setSkills([
          {
            id: 1,
            name: 'Blender',
            level: 'expert',
            verified: true,
            verifiedAt: '2024-01-15',
            projectsCount: 12,
            averageQuality: 95
          },
          {
            id: 2,
            name: 'After Effects',
            level: 'advanced',
            verified: true,
            verifiedAt: '2024-02-20',
            projectsCount: 8,
            averageQuality: 92
          },
          {
            id: 3,
            name: '3D Modeling',
            level: 'expert',
            verified: false,
            projectsCount: 15,
            averageQuality: 94
          },
          {
            id: 4,
            name: 'VFX',
            level: 'intermediate',
            verified: false,
            projectsCount: 5,
            averageQuality: 88
          }
        ]);
      } catch (error) {
        console.error('Error fetching skills:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, [user]);

  const handleAddSkill = async () => {
    if (!newSkill.trim()) return;

    const skill = {
      id: skills.length + 1,
      name: newSkill,
      level: 'beginner',
      verified: false,
      projectsCount: 0,
      averageQuality: 0
    };

    setSkills([...skills, skill]);
    setNewSkill('');
    
    toast({
      title: 'Habilidad agregada',
      description: `${newSkill} ha sido agregada a tu perfil`,
      className: 'bg-green-500 text-white',
    });
  };

  const handleRemoveSkill = (skillId) => {
    setSkills(skills.filter(s => s.id !== skillId));
    toast({
      title: 'Habilidad eliminada',
      description: 'La habilidad ha sido removida de tu perfil',
    });
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'expert':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'advanced':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'intermediate':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
  };

  const getLevelLabel = (level) => {
    const labels = {
      'expert': 'Experto',
      'advanced': 'Avanzado',
      'intermediate': 'Intermedio',
      'beginner': 'Principiante'
    };
    return labels[level] || level;
  };

  const filteredAvailableSkills = availableSkills.filter(skill =>
    skill.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !skills.some(s => s.name.toLowerCase() === skill.toLowerCase())
  );

  const verifiedSkillsCount = skills.filter(s => s.verified).length;
  const totalProjects = skills.reduce((sum, s) => sum + s.projectsCount, 0);
  const averageQuality = skills.length > 0
    ? skills.reduce((sum, s) => sum + s.averageQuality, 0) / skills.length
    : 0;

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header - Responsive */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2 flex items-center gap-2 sm:gap-3">
            <Award className="w-6 h-6 sm:w-8 sm:h-8 text-primary flex-shrink-0" />
            <span className="truncate">Gestión de Habilidades</span>
          </h2>
          <p className="text-sm sm:text-base text-white/70">Gestiona tus habilidades y competencias profesionales</p>
        </div>
      </div>

      {/* Estadísticas - Responsive */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20 h-full">
          <CardContent className="pt-4 sm:pt-6 p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-white/60 mb-1">Habilidades Totales</p>
                <p className="text-xl sm:text-2xl font-bold text-white">{skills.length}</p>
              </div>
              <Award className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20 h-full">
          <CardContent className="pt-4 sm:pt-6 p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-white/60 mb-1">Verificadas</p>
                <p className="text-xl sm:text-2xl font-bold text-white">{verifiedSkillsCount}</p>
              </div>
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-green-400 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20 h-full">
          <CardContent className="pt-4 sm:pt-6 p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-white/60 mb-1">Proyectos</p>
                <p className="text-xl sm:text-2xl font-bold text-white">{totalProjects}</p>
              </div>
              <Target className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20 h-full">
          <CardContent className="pt-4 sm:pt-6 p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-white/60 mb-1">Calidad Promedio</p>
                <p className="text-xl sm:text-2xl font-bold text-white">{averageQuality.toFixed(1)}</p>
              </div>
              <Star className="w-6 h-6 sm:w-8 sm:h-8 text-orange-400 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Mis Habilidades */}
        <Card className="bg-card/40 border-border/40">
          <CardHeader>
            <CardTitle className="text-white">Mis Habilidades</CardTitle>
            <CardDescription className="text-white/70">
              Habilidades que has agregado a tu perfil
            </CardDescription>
          </CardHeader>
          <CardContent>
            {skills.length === 0 ? (
              <div className="text-center py-8 text-white/60">
                <Award className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p>No tienes habilidades agregadas</p>
              </div>
            ) : (
              <div className="space-y-3">
                {skills.map((skill, index) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-primary/30 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-white">{skill.name}</h4>
                          {skill.verified && (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              <Shield className="w-3 h-3 mr-1" />
                              Verificada
                            </Badge>
                          )}
                          <Badge className={getLevelColor(skill.level)}>
                            {getLevelLabel(skill.level)}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-white/60">Proyectos</p>
                            <p className="font-semibold text-white">{skill.projectsCount}</p>
                          </div>
                          <div>
                            <p className="text-white/60">Calidad Promedio</p>
                            <p className="font-semibold text-white">{skill.averageQuality}/100</p>
                          </div>
                        </div>
                        {skill.averageQuality > 0 && (
                          <div className="mt-3">
                            <Progress value={skill.averageQuality} className="h-2" />
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveSkill(skill.id)}
                        className="text-white/60 hover:text-red-400"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Agregar Habilidades */}
        <Card className="bg-card/40 border-border/40">
          <CardHeader>
            <CardTitle className="text-white">Agregar Habilidades</CardTitle>
            <CardDescription className="text-white/70">
              Busca y agrega nuevas habilidades a tu perfil
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Input para nueva habilidad */}
              <div className="flex gap-2">
                <Input
                  placeholder="Escribe una nueva habilidad..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddSkill();
                    }
                  }}
                  className="flex-1 bg-background/50 border-white/10 text-white placeholder:text-white/40"
                />
                <Button
                  onClick={handleAddSkill}
                  disabled={!newSkill.trim()}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Búsqueda de habilidades disponibles */}
              <div>
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                  <Input
                    placeholder="Buscar habilidades..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background/50 border-white/10 text-white placeholder:text-white/40"
                  />
                </div>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {filteredAvailableSkills.length === 0 ? (
                    <p className="text-center py-4 text-white/60 text-sm">
                      {searchQuery ? 'No se encontraron habilidades' : 'Todas las habilidades están agregadas'}
                    </p>
                  ) : (
                    filteredAvailableSkills.map((skill, index) => (
                      <motion.div
                        key={skill}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-3 bg-white/5 rounded-lg border border-white/10 hover:border-primary/30 transition-all cursor-pointer"
                        onClick={() => {
                          setNewSkill(skill);
                          handleAddSkill();
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-white font-medium">{skill}</span>
                          <Plus className="w-4 h-4 text-white/60" />
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Información sobre verificación */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Verificación de Habilidades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-white/70">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              <p>Las habilidades verificadas aumentan tu credibilidad y visibilidad en la plataforma</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              <p>La verificación se basa en la calidad de tus trabajos y feedback de clientes</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              <p>Completa más trabajos exitosos para verificar automáticamente tus habilidades</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SkillsManagement;
