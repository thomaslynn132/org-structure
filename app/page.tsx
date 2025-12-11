import { OrgChart } from "@/components/org-chart"
import { organizationData } from "@/data/org-data"

export default function Home() {
  return (
    <main className="w-full h-screen bg-gray-50 overflow-auto">
      <OrgChart data={organizationData} />
    </main>
  )
}
