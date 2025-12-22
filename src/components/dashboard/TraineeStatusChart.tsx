'use client';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface TraineeStatusChartProps {
  data: { name: string; value: number; color: string }[];
}

export default function TraineeStatusChart({ data }: TraineeStatusChartProps) {
  return (
    <div className="col-span-12 rounded-lg border border-stroke bg-white dark:bg-black/90 px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-4">
      <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">
        Trainee Status
      </h3>
      <div className="mb-2 h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
               contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Centered Total or Label if needed, usually absolute positioned. 
          For simple doughnut, text in center involves more complex SVG or CSS positioning.
          Simple Legend is often enough. 
      */}
      <div className="text-center text-sm text-gray-500">
         Based on current enrollment
      </div>
    </div>
  );
}
