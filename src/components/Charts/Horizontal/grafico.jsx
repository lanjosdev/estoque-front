import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { category: 'Eletrônicos', quantity: 120 },
  { category: 'Roupas', quantity: 95 },
  { category: 'Alimentos', quantity: 150 },
  { category: 'Brinquedos', quantity: 60 },
  { category: 'Móveis', quantity: 0 }
];

export default function HorizontalBarChart() {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart layout="vertical" data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis type="number" />
          <YAxis dataKey="category" type="category" width={100} />
          <Tooltip />
          <Bar dataKey="quantity" fill="#8884d8" barSize={30} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
