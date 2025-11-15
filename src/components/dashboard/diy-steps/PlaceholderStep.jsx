import React from 'react';
import { motion } from 'framer-motion';

const PlaceholderStep = ({ title, description }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="text-center text-white flex flex-col items-center justify-center h-full"
    >
      <h2 className="text-3xl font-bold">{title}</h2>
      <p className="text-white/60 mt-2">{description}</p>
    </motion.div>
  );
};

export default PlaceholderStep;