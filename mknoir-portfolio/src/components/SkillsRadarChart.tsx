'use client'

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

const skillsData = [
  { skill: 'Coding', value: 78 },
  { skill: 'Mol. Biology', value: 70 },
  { skill: 'Comp. Biology', value: 70 },
  { skill: 'Statistics', value: 70 },
  { skill: 'Swim', value: 30 },
  { skill: 'Bike', value: 40 },
  { skill: 'Run', value: 70 },
  { skill: 'Robotics', value: 65 },
  { skill: 'Snowboarding', value: 75 },
  { skill: 'Beer Tasting', value: 90 },
]

const chartConfig = {
  value: {
    label: 'Level',
    color: 'var(--primary)',
  },
} satisfies ChartConfig

export default function SkillsRadarChart() {
  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square w-full max-w-[480px]"
    >
      <RadarChart data={skillsData} cx="50%" cy="50%" outerRadius="70%">
        <PolarGrid
          stroke="var(--border)"
          strokeOpacity={0.3}
        />
        <PolarAngleAxis
          dataKey="skill"
          tick={{
            fill: 'var(--muted-foreground)',
            fontSize: 11,
            fontWeight: 500,
          }}
          tickLine={false}
        />
        <PolarRadiusAxis
          angle={30}
          domain={[0, 100]}
          tick={false}
          axisLine={false}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Radar
          name="Skills"
          dataKey="value"
          stroke="var(--primary)"
          fill="var(--primary)"
          fillOpacity={0.2}
          strokeWidth={2}
          dot={{
            r: 3,
            fill: 'var(--primary)',
            fillOpacity: 1,
          }}
        />
      </RadarChart>
    </ChartContainer>
  )
}
