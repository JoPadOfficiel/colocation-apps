import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Custom tooltip pour afficher le montant en format français
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded shadow-sm">
        <p className="text-sm font-medium text-[#0e141b]">{payload[0].payload.month}</p>
        <p className="text-sm text-[#4799eb] font-semibold">
          {payload[0].value.toFixed(2).replace(".", ",")} €
        </p>
      </div>
    );
  }
  return null;
};

export default function FinancesChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey="month" 
          tick={{ fill: '#4e7397', fontSize: 12 }}
          axisLine={{ stroke: '#e5e7eb' }}
        />
        <YAxis 
          tick={{ fill: '#4e7397', fontSize: 12 }}
          axisLine={{ stroke: '#e5e7eb' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="amount" fill="#4799eb" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
