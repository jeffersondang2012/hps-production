import React from 'react';
import { Chart } from '@/components/molecules/Chart';
import { ChartData, TooltipItem } from 'chart.js';

interface ExpenseChartProps {
  data: {
    labels: string[];
    labor: number[];
    electricity: number[];
    maintenance: number[];
  };
}

export const ExpenseChart = ({ data }: ExpenseChartProps) => {
  const chartData: ChartData<'bar'> = {
    labels: data?.labels || [],
    datasets: [
      {
        label: 'Nhân công',
        data: data?.labor || [],
        backgroundColor: '#60A5FA',
      },
      {
        label: 'Điện',
        data: data?.electricity || [],
        backgroundColor: '#34D399',
      },
      {
        label: 'Sửa chữa',
        data: data?.maintenance || [],
        backgroundColor: '#F87171',
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        stacked: true,
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
      x: {
        stacked: true,
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem: TooltipItem<'bar'>) => {
            return `${tooltipItem.dataset.label}: ${new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
              maximumFractionDigits: 0,
            }).format(tooltipItem.raw as number)}`;
          },
        },
      },
    },
  };

  return (
    <Chart
      type="bar"
      data={chartData}
      options={options}
    />
  );
}; 