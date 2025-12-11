import type { Employee } from "@/types/employee"

interface EmployeeNode extends Employee {
  children: EmployeeNode[]
}

export function buildOrgTree(employees: Employee[]): EmployeeNode {
  const employeeMap = new Map<string | number, EmployeeNode>()
  let root: EmployeeNode | null = null

  // Create nodes for all employees
  employees.forEach((emp) => {
    employeeMap.set(emp.id, {
      ...emp,
      children: [],
    })
  })

  // Build tree structure
  employees.forEach((emp) => {
    if (!emp.parentId) {
      root = employeeMap.get(emp.id)!
    } else {
      const parent = employeeMap.get(emp.parentId)
      const child = employeeMap.get(emp.id)
      if (parent && child) {
        parent.children.push(child)
      }
    }
  })

  if (!root) {
    throw new Error("No root employee found (employee with no parentId)")
  }

  return root
}

export function getEmployeesByLevel(root: EmployeeNode): EmployeeNode[][] {
  const levels: EmployeeNode[][] = []
  const queue: [EmployeeNode, number][] = [[root, 0]]

  while (queue.length > 0) {
    const [node, level] = queue.shift()!

    if (!levels[level]) {
      levels[level] = []
    }
    levels[level].push(node)

    node.children.forEach((child) => {
      queue.push([child, level + 1])
    })
  }

  return levels
}
