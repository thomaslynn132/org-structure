export interface Employee {
  id: string | number
  name: string
  title: string
  avatar: string
  color?: "orange" | "blue" | "purple" | string
  parentId?: string | number | null
}

export interface OrgChartData {
  employees: Employee[]
}
