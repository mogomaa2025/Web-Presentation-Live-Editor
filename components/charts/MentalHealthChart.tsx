import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Negative Impact', value: 45, color: '#F43F5E' },
  { name: 'No Impact', value: 35, color: '#64748B' },
  { name: 'Positive Impact', value: 20, color: '#22C55E' },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg border border-slate-200 text-slate-700 shadow-lg">
        <p className="font-bold">{`${payload[0].name}: ${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

const MentalHealthChart: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-slate-800 p-4">
        <h3 className="text-xl font-semibold mb-4 text-slate-800">Perceived Impact on Mental Health</h3>
        <ResponsiveContainer width="100%" height="90%">
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend formatter={(value, entry) => <span className="text-slate-600">{value} ({entry.payload?.value}%)</span>} />
            </PieChart>
        </ResponsiveContainer>
    </div>
  );
};

export default MentalHealthChart;