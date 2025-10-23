interface PromptCardProps {
  image: string
  title: string
  description: string
  onClick?: () => void
}

export default function PromptCard({
  image,
  title,
  description,
  onClick,
}: PromptCardProps) {
  return (
    <div
      className="cursor-pointer rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={title} className="h-8 w-8 rounded" />
        <div>
          <h3 className="font-semibold text-zinc-800 dark:text-zinc-100">
            {title}
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}
