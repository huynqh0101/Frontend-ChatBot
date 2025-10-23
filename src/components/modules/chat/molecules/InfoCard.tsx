import React from 'react'

export default function InfoCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex cursor-pointer items-center gap-4 rounded-xl bg-zinc-800 p-4 transition-transform hover:scale-105 dark:bg-zinc-700">
      <div className="rounded-full bg-zinc-700 p-2 dark:bg-zinc-600">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-white">{title}</h3>
        <p className="text-sm text-zinc-400 dark:text-zinc-300">
          {description}
        </p>
      </div>
    </div>
  )
}
