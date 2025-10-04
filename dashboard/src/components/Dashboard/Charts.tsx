import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { AgeingBucket, ExpiryRisk } from '../../types';

interface ChartsProps {
  ageingBuckets: AgeingBucket[];
  expiryRisks: ExpiryRisk[];
  trendData: { month: string; qty: number }[];
}

const COLORS = {
  green: '#008000',
  yellow: '#FFD700',
  red: '#FF0000',
  blue: '#1976D2',
  orange: '#FF8C00',
};

export default function Charts({ ageingBuckets, expiryRisks, trendData }: ChartsProps) {
  const getBucketColor = (label: string) => {
    if (label.includes('0-30')) return COLORS.green;
    if (label.includes('30-60')) return COLORS.yellow;
    if (label.includes('60-90')) return COLORS.orange;
    return COLORS.red;
  };

  const getRiskColor = (category: string) => {
    if (category.includes('<30')) return COLORS.red;
    if (category.includes('30-90')) return COLORS.yellow;
    return COLORS.green;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Inventory Ageing Distribution
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={ageingBuckets}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="qty" name="Quantity" radius={[8, 8, 0, 0]}>
              {ageingBuckets.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBucketColor(entry.label)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Expiry Risk Breakdown
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={expiryRisks as any}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry: any) => `${entry.category}: ${entry.percentage}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="count"
            >
              {expiryRisks.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getRiskColor(entry.category)} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:col-span-2">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quantity Trends
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="qty"
              name="Total Quantity"
              stroke={COLORS.blue}
              strokeWidth={2}
              dot={{ fill: COLORS.blue, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
