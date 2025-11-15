import React from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const BadgeCard = ({ badge, earned, index }) => {
  const Icon = LucideIcons[badge.icon_name] || LucideIcons.Award;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className={`glass-card text-center transition-all duration-300 ${earned ? 'border-primary/50' : 'opacity-50 grayscale'}`}>
        <CardHeader>
          <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center border-4 ${earned ? 'bg-gradient-to-br from-primary/20 to-secondary/20 border-primary' : 'bg-muted/20 border-muted'}`}>
            <Icon className={`w-10 h-10 ${earned ? 'text-primary' : 'text-muted-foreground'}`} />
          </div>
        </CardHeader>
        <CardContent>
          <CardTitle className={`text-lg ${earned ? 'text-white' : 'text-muted-foreground'}`}>{badge.name}</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">{badge.description}</p>
          {earned && <p className="text-xs text-primary mt-2">Desbloqueado</p>}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BadgeCard;