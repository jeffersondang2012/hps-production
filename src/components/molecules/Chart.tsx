import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ChartProps {
  type: 'line' | 'bar' | 'pie';
  data: ChartData<any>;
  options?: ChartOptions<any>;
}

export const Chart = ({ type, data, options = {} }: ChartProps) => {
  const defaultOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  const mergedOptions = { ...defaultOptions, ...options };

  const chartComponents = {
    line: Line,
    bar: Bar,
    pie: Pie,
  };

  const ChartComponent = chartComponents[type];

  return (
    <div className="h-[300px]">
      <ChartComponent data={data} options={mergedOptions} />
    </div>
  );
}; 