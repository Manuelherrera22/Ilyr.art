import React from 'react';
import { motion } from 'framer-motion';

const StageHeader = ({ stage, title, description, icon: Icon }) => {
  const stageColors = {
    1: { from: "#1A1F71", to: "#FF3CAC" },
    2: { from: "#FF3CAC", to: "#784BA0" },
    3: { from: "#784BA0", to: "#FF805D" }
  };

  const colors = stageColors[stage] || stageColors[2];

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: stage * 0.1 }}
      className="flex items-center space-x-4 mb-8"
    >
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl"
           style={{ background: `linear-gradient(135deg, ${colors.from}, ${colors.to})` }}>
        <Icon className="w-8 h-8 text-white" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>
        <p className="text-white/60 text-lg">{description}</p>
      </div>
    </motion.div>
  );
};

export default StageHeader;