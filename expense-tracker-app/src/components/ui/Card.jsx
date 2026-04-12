import React from 'react';
import { motion } from 'framer-motion';

const Card = ({
  children,
  className = '',
  hover = true,
  gradient = false,
  padding = 'p-6',
  onClick,
  id,
  ...props
}) => {
  return (
    <motion.div
      id={id}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={hover ? { y: -2, transition: { duration: 0.2 } } : {}}
      className={`
        rounded-2xl border border-theme-border
        ${gradient ? 'bg-gradient-to-br from-theme-card to-theme-card-hover' : 'bg-theme-card'}
        shadow-theme
        transition-all duration-300
        ${hover ? 'hover:shadow-theme-lg hover:border-theme-primary/30' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${padding}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
