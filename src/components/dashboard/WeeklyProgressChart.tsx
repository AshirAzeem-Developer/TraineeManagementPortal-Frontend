'use client';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

interface WeeklyProgressChartProps {
  data: { week: string; progress: number }[];
}

export default function WeeklyProgressChart({ data }: WeeklyProgressChartProps) {
  return (
    <div className="col-span-12 rounded-lg border border-gray-200 bg-white px-5 pt-7.5 pb-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:px-7.5 xl:col-span-8">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Weekly Progress Over Time
          </h4>
        </div>
      </div>

      <div className="mb-2">
        <div id="chartOne" className="-ml-5 h-[355px] w-[105%]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#24a556" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#24a556" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e0e0e0" />
                <Area 
                  type="monotone" 
                  dataKey="progress" 
                  stroke="#24a556" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorProgress)" 
                />
              </AreaChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
