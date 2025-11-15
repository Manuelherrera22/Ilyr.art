import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

const ActionCard = ({ icon: Icon, title, description, ctaText, ctaIcon: CtaIcon, onClick, stage }) => {
  const [isHovered, setIsHovered] = useState(false);

  const stageColors = {
    1: { from: "#1A1F71", to: "#FF3CAC", glow: "#1A1F71" },
    2: { from: "#FF3CAC", to: "#784BA0", glow: "#FF3CAC" },
    3: { from: "#784BA0", to: "#FF805D", glow: "#FF805D" }
  };

  const colors = stageColors[stage] || stageColors[2];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <Card className="relative overflow-hidden bg-gradient-to-br from-[#0D0F15]/90 to-[#0B0D12]/90 border border-white/10 backdrop-blur-xl transition-all duration-500 ease-out hover:transform hover:-translate-y-3 hover:scale-105"
      style={{
        boxShadow: isHovered 
          ? `0 25px 50px -12px ${colors.glow}40, 0 0 0 1px ${colors.glow}30, 0 0 30px ${colors.glow}20 inset`
          : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}
      >
        <div className="absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 hover:opacity-10"
             style={{ background: `linear-gradient(135deg, ${colors.from}20, ${colors.to}20)` }} />
        
        <CardHeader className="relative z-10 pb-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300"
              style={{ 
                background: isHovered 
                  ? `linear-gradient(135deg, ${colors.from}, ${colors.to})`
                  : `linear-gradient(135deg, ${colors.from}80, ${colors.to}80)`
              }}
              animate={{ 
                scale: isHovered ? 1.1 : 1,
                rotate: isHovered ? 5 : 0
              }}
            >
              <Icon className="w-6 h-6 text-white" />
            </motion.div>
            <motion.div
              animate={{ x: isHovered ? 5 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ArrowRight className={`w-5 h-5 transition-colors duration-300 ${isHovered ? 'text-white' : 'text-white/40'}`} />
            </motion.div>
          </div>
          <CardTitle className="text-xl font-bold text-white mt-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r transition-all duration-300"
                    style={{ backgroundImage: isHovered ? `linear-gradient(135deg, ${colors.from}, ${colors.to})` : 'none' }}>
            {title}
          </CardTitle>
          <CardDescription className="text-white/60 text-sm leading-relaxed">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-10 pt-0">
          <motion.div
            animate={{ y: isHovered ? -2 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button 
              className="w-full transition-all duration-300 font-semibold bg-white/10 text-white/80 hover:bg-white/20"
              style={{ 
                background: isHovered 
                  ? `linear-gradient(135deg, ${colors.from}, ${colors.to})`
                  : undefined,
                color: isHovered ? 'white' : undefined
              }}
            >
              {CtaIcon && <CtaIcon className="mr-2 h-4 w-4" />}
              {isHovered ? ctaText : title}
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ActionCard;