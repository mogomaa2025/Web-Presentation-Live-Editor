import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { year: '2021', size: 104, },
  { year: '2023', size: 250, },
  { year: '2025', size: 370, },
  { year: '2027', size: 480, },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg border border-slate-200 text-slate-700 shadow-lg">
        <p className="font-bold">{`Year: ${label}`}</p>
        <p className="text-sm">{`Market Size: $${payload[0].value} Billion`}</p>
      </div>
    );
  }
  return null;
};

const CreatorEconomyChart: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-slate-800 p-4">
        <h3 className="text-xl font-semibold mb-4 text-slate-800">Creator Economy Market Size (Projected)</h3>
        <ResponsiveContainer width="100%" height="90%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 30, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="year" stroke="#6b7280" />
                <YAxis stroke="#6b7280" label={{ value: 'USD (Billions)', angle: -90, position: 'insideLeft', fill: '#6b7280' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend formatter={(value) => <span className="text-slate-600">{value}</span>}/>
                <Line type="monotone" dataKey="size" name="Market Size ($B)" stroke="#3B82F6" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
            </LineChart>
        </ResponsiveContainer>
    </div>
  );
};

export default CreatorEconomyChart;