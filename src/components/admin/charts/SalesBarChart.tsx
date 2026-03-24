
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"


const chartData = [
  { month: "January", sales: 186, goal: 160 },
  { month: "February", sales: 305, goal: 280 },
  { month: "March", sales: 237, goal: 200 },
  { month: "April", sales: 173, goal: 190 },
  { month: "May", sales: 209, goal: 200 },
  { month: "June", sales: 214, goal: 220 },
]

const chartConfig = {
  sales: {
    label: "Sales",
    color: "hsl(var(--chart-1))",
  },
  goal: {
    label: "Goal",
    color: "hsl(var(--muted))",
  },
}

export default function SalesBarChart() {
  return (
    <div className="h-[300px] w-full">
        <ChartContainer config={chartConfig}>
            <BarChart data={chartData} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                />
                 <YAxis 
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                 />
                <Tooltip 
                    cursor={false} 
                    content={<ChartTooltipContent indicator="dot" />} 
                />
                <Bar dataKey="goal" fill="var(--color-goal)" radius={4} />
                <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
            </BarChart>
        </ChartContainer>
    </div>
  )
}
