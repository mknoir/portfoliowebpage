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

import { skillsData } from '@/lib/skills'
export { skillsData } from '@/lib/skills'

function SkillLabel({ x = 0, y = 0, payload }: { x?: number; y?: number; payload?: { value: string } }) {
  const lines = payload?.value === 'Mol. Biology' ? ['Mol.', 'Biology']
    : payload?.value === 'Comp. Biology' ? ['Comp.', 'Biology']
      : payload?.value === 'Beer Tasting' ? ['Beer', 'Tasting']
        : [payload?.value ?? '']
  return <text x={x} y={y} fill="var(--muted-foreground)" textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={500}>
    {lines.map((line, index) => <tspan key={line} x={x} dy={index === 0 ? (lines.length > 1 ? -5 : 0) : 12}>{line}</tspan>)}
  </text>
}

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
      role="img"
      aria-label="Skills and interests radar: a playful self-assessment from 0 to 100, with beer tasting highest and swimming lowest."
    >
      <RadarChart data={skillsData} cx="50%" cy="50%" outerRadius="62%">
        <PolarGrid
          stroke="var(--border)"
          strokeOpacity={0.3}
        />
        <PolarAngleAxis
          dataKey="skill"
          tick={<SkillLabel />}
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
          content={<ChartTooltipContent hideLabel formatter={(value, _name, item) => <><span>{item.payload.skill}</span><strong>{value} / 100</strong></>} />}
        />
        <Radar
          name="Skills"
          dataKey="value"
          stroke="var(--primary)"
          fill="var(--primary)"
          fillOpacity={0.2}
          strokeWidth={2}
          isAnimationActive={false}
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
