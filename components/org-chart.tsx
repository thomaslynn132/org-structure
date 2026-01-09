"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmployeeCard } from "@/components/employee-card";
import { Filter, Download, Share2, Settings } from "lucide-react";
import type { Employee } from "@/types/employee";
import { buildOrgTree, getEmployeesByLevel } from "@/lib/org-utils";

interface OrgChartProps {
  data: Employee[];
}

interface Position {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}
export function OrgChart({ data }: OrgChartProps) {
  const [employees, setEmployees] = useState<Employee[]>(data);

  useEffect(() => {
    setEmployees(data);
  }, [data]);

  const [searchTerm, setSearchTerm] = useState("");
  const [positions, setPositions] = useState<Record<number, Position>>({});
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  const root = useMemo(() => {
    try {
      return buildOrgTree(employees);
    } catch {
      return null;
    }
  }, [employees]);

  const levels = useMemo(() => (root ? getEmployeesByLevel(root) : []), [root]);

  const filteredIds = useMemo(() => {
    return new Set(
      employees
        .filter(
          (e) =>
            e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((e) => e.id)
    );
  }, [employees, searchTerm]);
  useEffect(() => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const next: Record<number, Position> = {};

    cardRefs.current.forEach((el, id) => {
      const rect = el.getBoundingClientRect();
      const emp = employees.find((e) => e.id === id);
      if (!emp) return;

      next[id] = {
        id,
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top,
        width: rect.width,
        height: rect.height,
        color: emp.color ?? "gray",
      };
    });

    setPositions(next);
  }, [employees, filteredIds, isMobile]);
  const connections = useMemo(() => {
    return employees
      .filter((e) => e.parentId && positions[e.id] && positions[e.parentId])
      .map((e) => {
        const parent = positions[e.parentId!];
        const child = positions[e.id];
        const midY = (parent.y + parent.height + child.y) / 2;

        return {
          id: `${e.parentId}-${e.id}`,
          color: getLineColor(parent.color),
          parent,
          child,
          midY,
        };
      });
  }, [employees, positions]);

  if (!root) {
    return (
      <div className="p-8 text-center text-gray-600 bg-white rounded-lg">
        Error: Could not build organization structure.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Organization Structure</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Version History
          </Button>
          <Button className="bg-teal-600 text-white" size="sm">
            ✎ Edit Structure
          </Button>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg space-y-3">
        <div className="flex gap-2">
          <Input
            placeholder="Search employee"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex justify-end gap-1">
          <IconBtn Icon={Settings} />
          <IconBtn Icon={Download} />
          <IconBtn Icon={Share2} />
        </div>
      </div>
      <div
        ref={containerRef}
        className="relative bg-white rounded-lg p-8 min-h-96 overflow-x-auto">
        {/* SVG */}
        <svg className="absolute inset-0 pointer-events-none w-full h-full">
          {connections.map(({ id, parent, child, midY, color }) => (
            <g key={id}>
              <path
                d={`M ${parent.x} ${parent.y + parent.height} V ${midY} H ${
                  child.x
                } V ${child.y}`}
                stroke={color}
                strokeWidth={2}
                fill="none"
              />
              <circle
                cx={parent.x}
                cy={parent.y + parent.height}
                r={4}
                fill={color}
              />
              <circle cx={child.x} cy={child.y} r={4} fill={color} />
            </g>
          ))}
        </svg>
        <div className="flex flex-col items-center gap-16 relative z-10">
          {levels.map((level, i) => (
            <div key={i} className="flex flex-wrap justify-center gap-8">
              {level
                .filter((e) => filteredIds.has(e.id))
                .map((emp) => (
                  <div
                    key={emp.id}
                    draggable
                    onDragStart={() => {
                      draggedId.current = emp.id;
                    }}
                    onDragEnd={() => {
                      draggedId.current = null;
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (draggedId.current === null) return;
                      if (draggedId.current === emp.id) return;

                      setEmployees((prev) =>
                        prev.map((e) =>
                          e.id === draggedId.current
                            ? { ...e, parentId: emp.id }
                            : e
                        )
                      );
                    }}
                    ref={(el) => {
                      if (el) cardRefs.current.set(emp.id, el);
                      else cardRefs.current.delete(emp.id);
                    }}
                    className="cursor-grab">
                    <EmployeeCard {...emp} />
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function IconBtn({ Icon }: { Icon: React.ElementType }) {
  return (
    <Button size="icon" variant="ghost" className="h-8 w-8">
      <Icon className="w-4 h-4" />
    </Button>
  );
}

function getLineColor(color: string) {
  return (
    {
      orange: "#f97316",
      blue: "#3b82f6",
      purple: "#a855f7",
      green: "#22c55e",
      red: "#ef4444",
      gray: "#6b7280",
    }[color] ?? "#6b7280"
  );
}
