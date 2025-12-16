import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Componente de gráfico de barras simple para estadísticas
 */
const StatsChart = ({ data, title, color = 'primary', height = 200 }) => {
  const maxValue = Math.max(...data.map(d => d.value), 1);

  return (
    <Card className="bg-card/40 border-border/40">
      <CardHeader>
        <CardTitle className="text-white text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/80">{item.label}</span>
                <span className="font-semibold text-white">{item.value}</span>
              </div>
              <div className="relative h-3 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r from-${color}-500 to-${color}-400 rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.value / maxValue) * 100}%` }}
                  transition={{ delay: index * 0.1, duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Gráfico de línea simple para tendencias
 */
export const LineChart = ({ data, title, color = 'primary' }) => {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  const minValue = Math.min(...data.map(d => d.value), 0);
  const range = maxValue - minValue || 1;

  const points = data.map((item, index) => {
    const x = (index / (data.length - 1 || 1)) * 100;
    const y = 100 - ((item.value - minValue) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <Card className="bg-card/40 border-border/40">
      <CardHeader>
        <CardTitle className="text-white text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-48">
          <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={`hsl(var(--${color}))`} stopOpacity="0.3" />
                <stop offset="100%" stopColor={`hsl(var(--${color}))`} stopOpacity="0.05" />
              </linearGradient>
            </defs>
            <polyline
              points={points}
              fill="none"
              stroke={`hsl(var(--${color}))`}
              strokeWidth="2"
              className="drop-shadow-lg"
            />
            <polygon
              points={`0,100 ${points} 100,100`}
              fill={`url(#gradient-${color})`}
            />
            {data.map((item, index) => {
              const x = (index / (data.length - 1 || 1)) * 100;
              const y = 100 - ((item.value - minValue) / range) * 100;
              return (
                <motion.circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="2"
                  fill={`hsl(var(--${color}))`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                />
              );
            })}
          </svg>
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-white/50 px-2">
            {data.map((item, index) => (
              <span key={index}>{item.label}</span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Gráfico circular (donut) para porcentajes
 */
export const DonutChart = ({ value, max = 100, title, color = 'primary', size = 120 }) => {
  const percentage = (value / max) * 100;
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <Card className="bg-card/40 border-border/40">
      <CardHeader>
        <CardTitle className="text-white text-lg text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="transform -rotate-90">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-white/10"
            />
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={`hsl(var(--${color}))`}
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{value.toFixed(0)}</div>
              <div className="text-sm text-white/60">de {max}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsChart;
