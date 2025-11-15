import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CreativeStudioCard = ({ 
  icon: Icon, 
  title, 
  description, 
  features, 
  ctaText, 
  onClick, 
  gradient,
  size = "large" 
}) => {
  const cardSizes = {
    large: "col-span-2 row-span-2",
    medium: "col-span-1 row-span-2", 
    small: "col-span-1 row-span-1"
  };

  return (
    <motion.div
      className={`${cardSizes[size]}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -8, scale: 1.02 }}
    >
      <Card className={`h-full bg-gradient-to-br ${gradient} border border-white/20 backdrop-blur-xl shadow-2xl hover:shadow-[#FF3CAC]/20 transition-all duration-500 cursor-pointer group`}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-white mb-2">{title}</CardTitle>
                <p className="text-white/70 text-lg">{description}</p>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col justify-between">
          {features && (
            <div className="space-y-3 mb-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                  <span className="text-white/80">{feature}</span>
                </div>
              ))}
            </div>
          )}
          
          <Button 
            onClick={onClick}
            className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 hover:border-white/50 transition-all duration-300 group-hover:scale-105"
            size="lg"
          >
            {ctaText}
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CreativeStudioCard;