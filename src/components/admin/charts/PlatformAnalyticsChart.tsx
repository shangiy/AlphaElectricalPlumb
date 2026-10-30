"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { time: "00:00", vercel: 120, supabase: 80 },
  { time: "04:00", vercel: 80, supabase: 45 },
  { time: "08:00", vercel: 450, supabase: 320 },
  { time: "12:00", vercel: 890, supabase: 610 },
  { time: "16:00", vercel: 720, supabase: 540 },
  { time: "20:00", vercel: 980, supabase: 890 },
  { time: "23:59", vercel: 410, supabase: 350 },
]

const chartConfig = {
  vercel: {
    label: "Vercel Edge Requests",
    color: "hsl(var(--accent))",
  },
  supabase: {
    label: "Supabase DB Queries",
    color: "hsl(var(--primary))",
  },
}

export default function PlatformAnalyticsChart() {
  return (
    <div className="h-[300px] w-full">
      <ChartContainer config={chartConfig}>
        <LineChart
          data={chartData}
          margin={{
            left: 0,
            right: 0,
            top: 20,
            bottom: 0,
          }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.1} />
          <XAxis
            dataKey="time"
            tickLine={false}
            axisLine={false}
            tickMargin={12}
            className="text-[10px] font-bold uppercase"
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={12}
            className="text-[10px] font-bold uppercase"
          />
          <Tooltip
            cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1 }}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <Line
            type="monotone"
            dataKey="vercel"
            stroke="var(--color-vercel)"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
          <Line
            type="monotone"
            dataKey="supabase"
            stroke="var(--color-supabase)"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  )
}
