// src/components/ui/Button.tsx
import React from 'react'
import { cn } from '@/utils/cn'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gradient'
  size?: 'sm' | 'md' | 'lg'
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}) => {
  const variants = {
    primary: 'bg-primary-purple hover:bg-hover-purple',
    secondary: 'bg-primary-pink hover:bg-hover-pink',
    gradient: 'bg-gradient-primary hover:opacity-90',
  }

  const sizes = {
    sm: 'px-4 py-1.5 text-sm',
    md: 'px-6 py-2 text-base',
    lg: 'px-8 py-3 text-lg',
  }

  return (
    <button
      className={cn(
        'rounded-lg font-semibold transition-all duration-200',
        variants[variant],
        sizes[size],
        'hover:scale-105 hover-glow',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}