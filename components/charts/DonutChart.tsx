'use client';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import type { ChartData } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

import { donutChartOptions } from '@/lib/constants';

ChartJS.register(ArcElement, Tooltip, Legend);

type ChartProps = {
    data: ChartData<'doughnut'>;
};

const DonutChart = ({ data }: ChartProps) => {
    return <Doughnut data={data} options={donutChartOptions} />;
};

export default DonutChart;
