import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { year: '2018', users: 3.20, color: '#6366F1' },
  { year: '2020', users: 3.96, color: '#38BDF8' },
  { year: '2022', users: 4.59, color: '#34D399' },
  { year: '2024', users: 5.17, color: '#F87171' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg border border-slate-200 text-slate-700 shadow-lg">
        <p className="font-bold">{`Year: ${label}`}</p>
        <p className="text-sm">{`Active Users: ${payload[0].value} Billion`}</p>
      </div>
    );
  }
  return null;
};

const GlobalUsageChart: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-slate-800 p-4">
        <h3 className="text-xl font-semibold mb-4 text-slate-800">Global Social Media Users</h3>
        <ResponsiveContainer width="100%" height="90%">
            <BarChart data={data} margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="year" stroke="#6b7280" />
                <YAxis stroke="#6b7280" label={{ value: 'Users (in Billions)', angle: -90, position: 'insideLeft', fill: '#6b7280' }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(100, 116, 139, 0.1)' }} />
                <Bar dataKey="users" name="Users (Billions)">
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    </div>
  );
};

export default GlobalUsageChart;