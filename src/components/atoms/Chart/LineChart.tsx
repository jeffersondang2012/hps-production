import { FC } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface DataPoint {
  name: string;
  revenue: number;
  expense: number;
}

interface LineChartProps {
  data: DataPoint[];
}

export const LineChart: FC<LineChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map(d => d.name),
    datasets: [
      {
        label: 'Doanh thu',
        data: data.map(d => d.revenue),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
      {
        label: 'Chi phí',
        data: data.map(d => d.expense),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  return <Line options={options} data={chartData} />;
}; 