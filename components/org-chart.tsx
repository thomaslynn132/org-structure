"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { EmployeeCard } from "@/components/employee-card"
import { Filter, Download, Share2, Settings } from "lucide-react"
import { useState, useMemo, useRef, useEffect } from "react"
import type { Employee } from "@/types/employee"
import { buildOrgTree, getEmployeesByLevel } from "@/lib/org-utils"

interface OrgChartProps {
  data: Employee[]
}

interface EmployeePosition {
  id: number
  x: number
  y: number
  width: number
  height: number
  color: string
}

export function OrgChart({ data }: OrgChartProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [positions, setPositions] = useState<EmployeePosition[]>([])
  const [isMobile, setIsMobile] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  // Build org tree from flat data
  const root = useMemo(() => {
    try {
      return buildOrgTree(data)
    } catch (error) {
      console.error("Error building org tree:", error)
      return null
    }
  }, [data])

  // Get employees organized by level
  const levels = useMemo(() => {
    return root ? getEmployeesByLevel(root) : []
  }, [root])

  // Filter employees by search term
  const filteredData = useMemo(() => {
    return data.filter(
      (emp) =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.title.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [data, searchTerm])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    if (!containerRef.current) return

    const cards = containerRef.current.querySelectorAll("[data-employee-id]")
    const newPositions: EmployeePosition[] = []

    cards.forEach((card) => {
      const employeeId = Number.parseInt(card.getAttribute("data-employee-id") || "0")
      const employee = data.find((e) => e.id === employeeId)
      if (!employee) return

      const rect = card.getBoundingClientRect()
      const containerRect = containerRef.current!.getBoundingClientRect()

      newPositions.push({
        id: employeeId,
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top,
        width: rect.width,
        height: rect.height,
        color: employee.color || "gray",
      })
    })

    setPositions(newPositions)
  }, [data, filteredData, isMobile])

  useEffect(() => {
    if (!svgRef.current || positions.length === 0) return

    const svg = svgRef.current
    const container = containerRef.current
    if (!container) return

    const containerRect = container.getBoundingClientRect()
    svg.setAttribute("width", containerRect.width.toString())
    svg.setAttribute("height", containerRect.height.toString())

    // Clear previous lines
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild)
    }

    data.forEach((employee) => {
      if (!employee.parentId) return

      const parentPos = positions.find((p) => p.id === employee.parentId)
      const childPos = positions.find((p) => p.id === employee.id)

      if (!parentPos || !childPos) return

      const parentCenterX = parentPos.x
      const parentBottomY = parentPos.y + parentPos.height

      const childCenterX = childPos.x
      const childTopY = childPos.y

      const verticalGap = isMobile ? 20 : 40
      const midY = (parentBottomY + childTopY) / 2

      const color = getLineColor(parentPos.color)

      // Draw vertical line from parent
      const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path")
      path1.setAttribute("d", `M ${parentCenterX} ${parentBottomY} L ${parentCenterX} ${midY}`)
      path1.setAttribute("stroke", color)
      path1.setAttribute("stroke-width", "2")
      path1.setAttribute("fill", "none")
      svg.appendChild(path1)

      // Draw horizontal line
      const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path")
      path2.setAttribute("d", `M ${parentCenterX} ${midY} L ${childCenterX} ${midY}`)
      path2.setAttribute("stroke", color)
      path2.setAttribute("stroke-width", "2")
      path2.setAttribute("fill", "none")
      svg.appendChild(path2)

      // Draw vertical line to child
      const path3 = document.createElementNS("http://www.w3.org/2000/svg", "path")
      path3.setAttribute("d", `M ${childCenterX} ${midY} L ${childCenterX} ${childTopY}`)
      path3.setAttribute("stroke", color)
      path3.setAttribute("stroke-width", "2")
      path3.setAttribute("fill", "none")
      svg.appendChild(path3)

      // Draw circle connectors
      const circle1 = document.createElementNS("http://www.w3.org/2000/svg", "circle")
      circle1.setAttribute("cx", parentCenterX.toString())
      circle1.setAttribute("cy", parentBottomY.toString())
      circle1.setAttribute("r", "4")
      circle1.setAttribute("fill", color)
      svg.appendChild(circle1)

      const circle2 = document.createElementNS("http://www.w3.org/2000/svg", "circle")
      circle2.setAttribute("cx", childCenterX.toString())
      circle2.setAttribute("cy", childTopY.toString())
      circle2.setAttribute("r", "4")
      circle2.setAttribute("fill", color)
      svg.appendChild(circle2)
    })
  }, [positions, data, isMobile])

  if (!root) {
    return (
      <div className="space-y-4 px-4 md:px-0">
        <h1 className="text-2xl font-bold text-gray-900">Organization Structure</h1>
        <div className="bg-white rounded-lg p-8 text-center text-gray-600">
          Error: Could not build organization structure. Ensure there is one employee with no parentId.
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 px-4 md:px-0">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Organization Structure</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Button variant="outline" size="sm" className="text-xs bg-transparent">
            Version History
          </Button>
          <Button className="bg-teal-600 hover:bg-teal-700 text-white text-xs">✎ Edit Structure</Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 bg-white p-4 rounded-lg">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search employee"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-50 text-sm"
            />
          </div>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent whitespace-nowrap">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filter Role</span>
          </Button>
        </div>
        <div className="flex gap-2 justify-end">
          <Button size="icon" variant="ghost" className="h-8 w-8">
            <Settings className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8">
            <Download className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 md:p-8 overflow-x-auto relative min-h-96" ref={containerRef}>
        <svg ref={svgRef} className="absolute inset-0 pointer-events-none" style={{ width: "100%", height: "100%" }} />
        <div
          className={`flex ${isMobile ? "flex-col" : "flex-col"} ${!isMobile && "items-center"} gap-4 md:gap-16 relative z-10`}
        >
          {levels.map((levelEmployees, levelIndex) => (
            <div
              key={levelIndex}
              className={`w-full flex ${isMobile ? "flex-col" : "flex-wrap"} justify-center gap-4 md:gap-8`}
            >
              {levelEmployees
                .filter((emp) => filteredData.some((d) => d.id === emp.id))
                .map((employee) => (
                  <div key={employee.id} data-employee-id={employee.id}>
                    <EmployeeCard {...employee} />
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function getLineColor(color: string): string {
  const colorMap: Record<string, string> = {
    orange: "#f97316",
    blue: "#3b82f6",
    purple: "#a855f7",
    green: "#22c55e",
    red: "#ef4444",
    gray: "#6b7280",
  }
  return colorMap[color] || colorMap.gray
}
