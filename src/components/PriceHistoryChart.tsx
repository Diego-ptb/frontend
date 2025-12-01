import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../context/LanguageContext';

interface PriceHistoryEntry {
  price: number;
  soldAt: string;
}

interface PriceHistoryChartProps {
  data: PriceHistoryEntry[];
}

export const PriceHistoryChart: React.FC<PriceHistoryChartProps> = ({ data }) => {
  const { t } = useLanguage();
  // Procesar datos agrupando por hora del mismo día
  const processData = () => {
    const grouped: { [key: string]: { prices: number[], soldAt: string } } = {};
    data.forEach(item => {
      const date = new Date(item.soldAt);
      const hour = date.getHours().toString().padStart(2, '0');
      const minute = date.getMinutes().toString().padStart(2, '0');
      const timeKey = `${hour}:${minute}`;

      if (!grouped[timeKey]) {
        grouped[timeKey] = { prices: [], soldAt: item.soldAt };
      }
      grouped[timeKey].prices.push(item.price);
    });

    return Object.entries(grouped).map(([time, { prices, soldAt }]) => ({
      time,
      price: prices[prices.length - 1], // Último precio en esa hora
      count: prices.length,
      prices: prices.sort((a, b) => a - b),
      soldAt
    })).sort((a, b) => {
      const [aH, aM] = a.time.split(':').map(Number);
      const [bH, bM] = b.time.split(':').map(Number);
      return (aH * 60 + aM) - (bH * 60 + bM);
    });
  };

  const chartData = processData();

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-base-300 border border-base-content rounded px-3 py-2 shadow-lg">
          <p className="text-base-content text-sm font-semibold">${data.price.toFixed(2)}</p>
          <p className="text-base-content/70 text-xs">{data.time}</p>
          {data.count > 1 && (
            <p className="text-warning text-xs">+{data.count} ventas</p>
          )}
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return <div className="text-center py-8 text-base-content/50">{t.catalog.noPriceHistory}</div>;
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.3} />
          <XAxis
            dataKey="time"
            stroke="currentColor"
            opacity={0.7}
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="currentColor"
            opacity={0.7}
            label={{ value: 'Precio ($)', angle: -90, position: 'insideLeft', style: { fill: 'currentColor', opacity: 0.7 } }}
            style={{ fontSize: '12px' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="linear"
            dataKey="price"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: '#3b82f6', r: 4 }}
            activeDot={{ r: 6, fill: '#60a5fa' }}
            fillOpacity={1}
            fill="url(#colorPrice)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};