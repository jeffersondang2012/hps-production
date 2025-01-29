import React from 'react';
import { Chart } from '@/components/molecules/Chart';
import { ChartData } from 'chart.js';

interface RevenueChartProps {
  data: {
    labels: string[];
    revenue: number[];
    profit: number[];
  };
}

export const RevenueChart = ({ data }: RevenueChartProps) => {
  const chartData: ChartData<'line'> = {
    labels: data?.labels || [],
    datasets: [
      {
        label: 'Doanh thu',
        data: data?.revenue || [],
        borderColor: '#60A5FA',
        backgroundColor: 'rgba(96, 165, 250, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Lợi nhuận',
        data: data?.profit || [],
        borderColor: '#34D399',
        backgroundColor: 'rgba(52, 211, 153, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => {
            return new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
              maximumFractionDigits: 0,
            }).format(value);
          },
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
              maximumFractionDigits: 0,
            }).format(context.raw);
          },
        },
      },
    },
  };

  return (
    <Chart
      type="line"
      data={chartData}
      options={options}
    />
  );
}; 