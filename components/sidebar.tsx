import { Home, Users, FileText, Building2, Zap, Settings, MoreVertical, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Sidebar() {
  return (
    <aside className="w-20 bg-white border-r border-gray-200 flex flex-col items-center py-6 gap-4">
      <div className="w-10 h-10 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold">F</div>
      <nav className="flex flex-col gap-4">
        {[
          { icon: Home, label: "Home" },
          { icon: Users, label: "Users" },
          { icon: FileText, label: "Files" },
          { icon: Building2, label: "Building" },
          { icon: Users, label: "Team" },
          { icon: Zap, label: "Zap" },
          { icon: Settings, label: "Settings" },
          { icon: MoreVertical, label: "More" },
          { icon: HelpCircle, label: "Help" },
        ].map((item, i) => (
          <Button key={i} size="icon" variant="ghost" className="hover:bg-gray-100">
            <item.icon className="w-5 h-5 text-gray-600" />
          </Button>
        ))}
      </nav>
    </aside>
  )
}
