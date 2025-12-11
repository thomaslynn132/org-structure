import { Phone, Mail, Linkedin, FileText, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmployeeCardProps {
  name: string
  title: string
  avatar: string
  color: string
}

export function EmployeeCard({ name, title, avatar, color }: EmployeeCardProps) {
  const colorClasses: Record<string, string> = {
    orange: "border-t-4 border-t-orange-500",
    blue: "border-t-4 border-t-blue-500",
    purple: "border-t-4 border-t-purple-500",
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm p-3 md:p-4 w-full md:w-48 ${colorClasses[color]}`}>
      <div className="flex flex-col items-center mb-3">
        <img src={avatar || "/placeholder.svg"} alt={name} className="w-10 md:w-12 h-10 md:h-12 rounded-full mb-2" />
        <h3 className="font-semibold text-xs md:text-sm text-gray-900 text-center line-clamp-2">{name}</h3>
        <p className="text-xs text-gray-600 text-center line-clamp-2">{title}</p>
      </div>
      <div className="flex justify-center gap-1 md:gap-2 border-t pt-2 md:pt-3">
        <Button size="icon" variant="ghost" className="h-7 md:h-8 w-7 md:w-8">
          <Phone className="w-3 md:w-4 h-3 md:h-4 text-gray-600" />
        </Button>
        <Button size="icon" variant="ghost" className="h-7 md:h-8 w-7 md:w-8">
          <Mail className="w-3 md:w-4 h-3 md:h-4 text-gray-600" />
        </Button>
        <Button size="icon" variant="ghost" className="h-7 md:h-8 w-7 md:w-8">
          <Linkedin className="w-3 md:w-4 h-3 md:h-4 text-gray-600" />
        </Button>
        <Button size="icon" variant="ghost" className="h-7 md:h-8 w-7 md:w-8">
          <FileText className="w-3 md:w-4 h-3 md:h-4 text-gray-600" />
        </Button>
        <Button size="icon" variant="ghost" className="h-7 md:h-8 w-7 md:w-8">
          <MoreHorizontal className="w-3 md:w-4 h-3 md:h-4 text-gray-600" />
        </Button>
      </div>
    </div>
  )
}
