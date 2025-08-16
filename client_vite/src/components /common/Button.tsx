import React from 'react'
import clsx from 'clsx'

interface ButtonProps {
  className?: string
  onClick: () => void
  children: React.ReactNode
  variant?: ButtonTypes
}

type ButtonTypes = 'primary' | 'secondary' | 'danger'

const VARIANT = {
  primary: 'border-white hover:bg-black',
  secondary: 'border-black hover:bg-black',
  danger: 'border-white hover:bg-red-900',
}

const Button = ({ onClick, children, variant = 'primary', className }: ButtonProps) => {
  const baseClass =
    'border p-2 w-32 hover:text-white transition-all duration-200'
  return (
    <button
      className={`${baseClass} ${clsx(VARIANT[variant])} ${clsx(className)}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button
