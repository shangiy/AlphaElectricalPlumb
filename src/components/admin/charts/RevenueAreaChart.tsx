
"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { month: "January", revenue: 18600 },
  { month: "February", revenue: 30500 },
  { month: "March", revenue: 23700 },
  { month: "April", revenue: 17300 },
  { month: "May", revenue: 20900 },
  { month: "June", revenue: 41430 },
]

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
}

export default function RevenueAreaChart() {
  return (
    <div className="h-[300px] w-full">
      <ChartContainer config={chartConfig}>
        <AreaChart
          accessibilityLayer
          data={chartData}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
          />
           <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => `Ksh ${Number(value) / 1000}k`}
          />
          <Tooltip
            cursor={false}
            content={<ChartTooltipContent 
                formatter={(value) => `Ksh ${Number(value).toLocaleString()}`}
                indicator="line"
             />}
          />
          <Area
            dataKey="revenue"
            type="natural"
            fill="var(--color-revenue)"
            fillOpacity={0.4}
            stroke="var(--color-revenue)"
            stackId="a"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}
