import { Sidebar } from '../organisms/Sidebar'
import { MainContent } from '../organisms/MainContent'

export function ChatTemplate() {
  return (
    <div className="flex h-screen bg-[#F3F6FB] font-sans">
      <Sidebar />
      <MainContent />
    </div>
  )
}
