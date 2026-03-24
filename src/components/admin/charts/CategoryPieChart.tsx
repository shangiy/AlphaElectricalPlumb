
"use client"

import * as React from "react"
import { Pie, PieChart, Sector, Tooltip } from "recharts"
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { category: "plumbing", sales: 275, fill: "var(--color-plumbing)" },
  { category: "lighting", sales: 200, fill: "var(--color-lighting)" },
  { category: "decor", sales: 187, fill: "var(--color-decor)" },
  { category: "tanks", sales: 173, fill: "var(--color-tanks)" },
  { category: "roofing", sales: 90, fill: "var(--color-roofing)" },
]

const chartConfig = {
  sales: {
    label: "Sales",
  },
  plumbing: {
    label: "Plumbing",
    color: "hsl(var(--chart-1))",
  },
  lighting: {
    label: "Lighting",
    color: "hsl(var(--chart-2))",
  },
  decor: {
    label: "Decor",
    color: "hsl(var(--chart-3))",
  },
  tanks: {
    label: "Tanks",
    color: "hsl(var(--chart-4))",
  },
  roofing: {
    label: "Roofing",
    color: "hsl(var(--chart-5))",
  },
}

export default function CategoryPieChart() {
  const id = "pie-interactive"
  const [activeCategory, setActiveCategory] = React.useState(chartData[0].category)

  const activeIndex = React.useMemo(
    () => chartData.findIndex((item) => item.category === activeCategory),
    [activeCategory]
  )

  return (
    <div className="w-full h-[300px] flex items-center justify-center">
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square"
      >
        <PieChart>
          <Tooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={chartData}
            dataKey="sales"
            nameKey="category"
            innerRadius={60}
            strokeWidth={5}
            activeIndex={activeIndex}
            activeShape={({ outerRadius = 0, ...props }) => (
              <g>
                <Sector {...props} outerRadius={outerRadius + 10} />
                <Sector
                  {...props}
                  outerRadius={outerRadius}
                  innerRadius={outerRadius - 8}
                />
              </g>
            )}
            onMouseOver={(_, index) => {
              setActiveCategory(chartData[index].category)
            }}
          />
        </PieChart>
      </ChartContainer>
    </div>
  )
}
