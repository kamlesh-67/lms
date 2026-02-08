'use client'

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'

const data = [
  {
    name: 'Jan',
    total: 120,
  },
  {
    name: 'Feb',
    total: 150,
  },
  {
    name: 'Mar',
    total: 300,
  },
  {
    name: 'Apr',
    total: 250,
  },
  {
    name: 'May',
    total: 350,
  },
  {
    name: 'Jun',
    total: 400,
  },
  {
    name: 'Jul',
    total: 380,
  },
  {
    name: 'Aug',
    total: 420,
  },
  {
    name: 'Sep',
    total: 450,
  },
  {
    name: 'Oct',
    total: 500,
  },
  {
    name: 'Nov',
    total: 480,
  },
  {
    name: 'Dec',
    total: 600,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip 
          cursor={{ fill: 'transparent' }}
          contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
        />
        <Bar dataKey="total" fill="#2563eb" radius={[4, 4, 0, 0]} className="fill-primary" />
      </BarChart>
    </ResponsiveContainer>
  )
}
