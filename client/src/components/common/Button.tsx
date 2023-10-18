import React from 'react'
import clsx from 'clsx'

interface ButtonProps {
  onClick: () => void
  children: React.ReactNode
  variant?: ButtonTypes
}

type ButtonTypes = 'primary'

const VARIANT = {
  primary:
    'border p-2 w-32 border-white hover:bg-black hover:text-white transition-all duration-200',
}

const Button = ({ onClick, children, variant = 'primary' }: ButtonProps) => {
  return (
    <button className={`${clsx(VARIANT[variant])}`} onClick={onClick}>
      {children}
    </button>
  )
}

export default Button
