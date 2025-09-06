import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'MySpace', users: 75, color: '#6366F1' },
  { name: 'Twitter', users: 330, color: '#38BDF8' },
  { name: 'Instagram', users: 1200, color: '#EC4899' },
  { name: 'YouTube', users: 2500, color: '#F87171' },
  { name: 'Facebook', users: 2900, color: '#3B82F6' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg border border-slate-200 text-slate-700 shadow-lg">
        <p className="font-bold">{label}</p>
        <p className="text-sm">{`Users: ${payload[0].value} million`}</p>
      </div>
    );
  }
  return null;
};


const PlatformGrowthChart: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-slate-800 p-4">
        <h3 className="text-xl font-semibold mb-4 text-slate-800">Peak Active Users (in Millions)</h3>
        <ResponsiveContainer width="100%" height="90%">
            <BarChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(100, 116, 139, 0.1)' }} />
                <Legend formatter={(value) => <span className="text-slate-600">{value}</span>}/>
                <Bar dataKey="users" name="Users (Millions)" fill="#8884d8">
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    </div>
  );
};

export default PlatformGrowthChart;