import { Bell, Search, Plus, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-yellow-500 rounded flex items-center justify-center font-bold text-gray-900">
            T
          </div>
          <span className="font-bold text-lg">timli</span>
        </div>
        <nav className="flex gap-6 text-sm">
          <a href="#" className="hover:text-gray-300">
            People
          </a>
          <a href="#" className="hover:text-gray-300">
            Employee <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded ml-1">30</span>
          </a>
          <a href="#" className="hover:text-gray-300">
            Contract <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded ml-1">20</span>
          </a>
          <a href="#" className="hover:text-gray-300">
            Department <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded ml-1">5</span>
          </a>
          <a href="#" className="hover:text-gray-300">
            Manpower Planning
          </a>
          <a href="#" className="hover:text-gray-300 font-semibold">
            Organization Structure
          </a>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <Button size="icon" variant="ghost" className="hover:bg-gray-800">
          <Plus className="w-5 h-5" />
        </Button>
        <Button size="icon" variant="ghost" className="hover:bg-gray-800">
          <Search className="w-5 h-5" />
        </Button>
        <Button size="icon" variant="ghost" className="hover:bg-gray-800">
          <Bell className="w-5 h-5" />
        </Button>
        <Button size="icon" variant="ghost" className="hover:bg-gray-800">
          <User className="w-5 h-5" />
        </Button>
      </div>
    </header>
  )
}
