import React from 'react'
import clsx from 'clsx'

interface CardProps {
  text: string
  icon: React.ReactNode
  index: CardColors
}

enum CardColors {
  Orange = 0,
  Blue = 1,
  Green = 2,
  Red = 3,
  Purple = 4,
}

const COLORS: { [key in CardColors]: string } = {
  [CardColors.Orange]: 'bg-orange-200',
  [CardColors.Blue]: 'bg-blue-200',
  [CardColors.Green]: 'bg-green-200',
  [CardColors.Red]: 'bg-red-200',
  [CardColors.Purple]: 'bg-purple-200',
}

const Card = ({ text, icon, index = 0 }: CardProps) => {
  return (
    <div
      className={clsx(
        `${COLORS[index]} flex grid-flow-row grid-cols-1 flex-col place-items-center justify-center gap-4 rounded-md px-4 py-10 text-center max-[767px]:p-8 hover:scale-105 hover:rotate-6  duration-300 `
      )}
    >
      <div>{icon}</div>
      {text}
    </div>
  )
}

export default Card
