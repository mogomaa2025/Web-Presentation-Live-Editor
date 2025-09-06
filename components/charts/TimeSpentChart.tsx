import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'Facebook', time: 33, color: '#3B82F6' },
  { name: 'YouTube', time: 45, color: '#F87171' },
  { name: 'Instagram', time: 53, color: '#EC4899' },
  { name: 'TikTok', time: 95, color: '#2DD4BF' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg border border-slate-200 text-slate-700 shadow-lg">
        <p className="font-bold">{label}</p>
        <p className="text-sm">{`Time: ${payload[0].value} minutes/day`}</p>
      </div>
    );
  }
  return null;
};

const TimeSpentChart: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-slate-800 p-4">
        <h3 className="text-xl font-semibold mb-4 text-slate-800">Average Daily Time Spent by Users</h3>
        <ResponsiveContainer width="100%" height="90%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" stroke="#6b7280" />
                <YAxis type="category" dataKey="name" stroke="#6b7280" width={80} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(100, 116, 139, 0.1)' }} />
                <Bar dataKey="time" name="Minutes per Day" barSize={30}>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    </div>
  );
};

export default TimeSpentChart;