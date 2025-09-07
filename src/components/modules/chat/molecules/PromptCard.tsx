import { ArrowRight } from 'lucide-react'

export default function PromptCard({
  image,
  title,
  description,
}: {
  image: string
  title: string
  description: string
}) {
  return (
    <div className="relative cursor-pointer rounded-xl border bg-white p-4 transition-shadow hover:shadow-lg">
      <div className="flex items-start gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={title} className="h-8 w-8 rounded-full" />
        <div>
          <h3 className="font-semibold text-zinc-800">&quot;{title}&quot;</h3>
          <p className="text-sm text-zinc-500">{description}</p>
        </div>
      </div>
      <ArrowRight className="absolute right-4 bottom-4 h-5 w-5 text-zinc-400" />
    </div>
  )
}
