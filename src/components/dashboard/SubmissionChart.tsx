'use client';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface SubmissionChartProps {
  data: { week: string; submissions: number }[];
}

export default function SubmissionChart({ data }: SubmissionChartProps) {
  return (
    <div className="col-span-12 rounded-lg border border-gray-200 bg-white px-5 pt-7.5 pb-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 xl:col-span-4">
      <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">
        Submissions by Week
      </h3>
      <div className="mb-2">
        <div id="chartTwo" className="-ml-5 h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }}  />
              <Tooltip 
                cursor={{ fill: '#1f2937' }} 
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar 
                dataKey="submissions" 
                fill="#24a556" 
                radius={[4, 4, 0, 0]} 
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
