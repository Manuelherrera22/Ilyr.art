import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Star, 
  Zap, 
  Target,
  Award,
  Flame,
  Crown,
  Rocket,
  TrendingUp,
  CheckCircle,
  Sparkles,
  Medal
} from 'lucide-react';

const AchievementsSystem = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState({
    level: 5,
    xp: 2450,
    xpToNextLevel: 3000,
    currentStreak: 7,
    longestStreak: 12,
    totalEarned: 45000,
    badges: [
      { id: 1, name: 'Primer Trabajo', description: 'Completa tu primer trabajo', icon: Rocket, unlocked: true, unlockedAt: '2024-01-15' },
      { id: 2, name: 'Calidad Excepcional', description: 'Obtén una puntuación de 95+', icon: Star, unlocked: true, unlockedAt: '2024-02-20' },
      { id: 3, name: 'Racha de 10', description: 'Completa 10 trabajos consecutivos', icon: Flame, unlocked: false, progress: 7 },
      { id: 4, name: 'Maestro del Tiempo', description: 'Entrega 5 trabajos antes del deadline', icon: Zap, unlocked: false, progress: 3 },
      { id: 5, name: 'Top Earner', description: 'Gana más de $50,000', icon: Crown, unlocked: false, progress: 90 },
      { id: 6, name: 'Perfeccionista', description: 'Obtén 10 revisiones perfectas', icon: Medal, unlocked: false, progress: 6 },
    ],
    recentUnlocks: [
      { id: 2, name: 'Calidad Excepcional', unlockedAt: '2024-02-20' }
    ]
  });

  const getLevelProgress = () => {
    return (achievements.xp / achievements.xpToNextLevel) * 100;
  };

  const getBadgeIcon = (Icon) => {
    return <Icon className="w-8 h-8" />;
  };

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header con Nivel y XP - Responsive */}
      <div className="space-y-3 sm:space-y-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2 flex items-center gap-2 sm:gap-3">
            <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-primary flex-shrink-0" />
            <span className="truncate">Logros y Progreso</span>
          </h2>
          <p className="text-sm sm:text-base text-white/70">Desbloquea logros y sube de nivel</p>
        </div>

        {/* Nivel y Progreso - Responsive */}
        <Card className="bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20 border-primary/30">
          <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-between gap-4 mb-4">
              <div className="flex-1 w-full sm:w-auto">
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl sm:text-3xl font-bold text-white border-2 sm:border-4 border-white/20">
                      {achievements.level}
                    </div>
                    <div className="absolute -top-1 -right-1">
                      <Crown className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-400" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl sm:text-2xl font-bold text-white">Nivel {achievements.level}</h3>
                    <p className="text-white/70 text-xs sm:text-sm">
                      {achievements.xp.toLocaleString()} / {achievements.xpToNextLevel.toLocaleString()} XP
                    </p>
                  </div>
                </div>
                <Progress value={getLevelProgress()} className="h-2 sm:h-3 mt-2 sm:mt-3" />
              </div>
              <div className="text-center sm:text-right w-full sm:w-auto">
                <div className="flex items-center justify-center sm:justify-end gap-2 text-yellow-400 mb-2">
                  <Flame className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-lg sm:text-xl font-bold">{achievements.currentStreak}</span>
                </div>
                <p className="text-xs sm:text-sm text-white/60">Días consecutivos</p>
                <p className="text-xs text-white/50 mt-1">Récord: {achievements.longestStreak} días</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estadísticas Rápidas - Responsive */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20 h-full">
          <CardContent className="pt-4 sm:pt-6 p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-white/60 mb-1">Logros Desbloqueados</p>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {achievements.badges.filter(b => b.unlocked).length} / {achievements.badges.length}
                </p>
              </div>
              <Award className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20 h-full">
          <CardContent className="pt-4 sm:pt-6 p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-white/60 mb-1">XP Total</p>
                <p className="text-xl sm:text-2xl font-bold text-white break-words">{achievements.xp.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-400 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20 h-full">
          <CardContent className="pt-4 sm:pt-6 p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-white/60 mb-1">Racha Actual</p>
                <p className="text-xl sm:text-2xl font-bold text-white">{achievements.currentStreak} días</p>
              </div>
              <Flame className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Badges y Logros - Responsive */}
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-lg sm:text-xl font-bold text-white">Logros Disponibles</h3>
        <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {achievements.badges.map((badge, index) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`bg-gradient-to-br ${
                badge.unlocked 
                  ? 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30' 
                  : 'from-card/40 to-card/20 border-border/40 opacity-60'
              } transition-all duration-300 hover:scale-105`}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${
                      badge.unlocked 
                        ? 'bg-yellow-500/20 text-yellow-400' 
                        : 'bg-white/5 text-white/30'
                    }`}>
                      {getBadgeIcon(badge.icon)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-white">{badge.name}</h4>
                        {badge.unlocked && (
                          <CheckCircle className="w-4 h-4 text-yellow-400" />
                        )}
                      </div>
                      <p className="text-sm text-white/70 mb-3">{badge.description}</p>
                      {badge.unlocked ? (
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Desbloqueado
                        </Badge>
                      ) : badge.progress !== undefined ? (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs text-white/60">
                            <span>Progreso</span>
                            <span>{badge.progress} / {badge.progress < 10 ? 10 : badge.progress < 50 ? 50 : 100}</span>
                          </div>
                          <Progress value={(badge.progress / (badge.progress < 10 ? 10 : badge.progress < 50 ? 50 : 100)) * 100} className="h-2" />
                        </div>
                      ) : (
                        <Badge variant="outline" className="text-xs text-white/50 border-white/10">
                          Bloqueado
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Logros Recientes */}
      {achievements.recentUnlocks.length > 0 && (
        <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              Logros Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {achievements.recentUnlocks.map((unlock) => (
                <div key={unlock.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <div className="p-2 bg-yellow-500/20 rounded-lg">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-white">{unlock.name}</p>
                    <p className="text-xs text-white/60">
                      Desbloqueado el {new Date(unlock.unlockedAt).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                  <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default AchievementsSystem;
