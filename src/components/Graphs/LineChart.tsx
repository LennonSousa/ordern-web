import React from 'react';
import { Line } from 'react-chartjs-2';

interface LineChartProps {
    labels: string[];
    label: string;
    data: number[];
}

const LineChart: React.FC<LineChartProps> = (props) => {
    const data = {
        labels: props.labels,
        datasets: [
            {
                label: props.label,
                data: props.data,
                borderColor: ['rgba(220, 53, 69, 0.2)'],
                backgroundColor: ['rgba(220, 53, 69, 0.2)'],
                pointBackgroundColor: ['rgba(220, 53, 69, 0.2)'],
                pointBorderColor: ['rgba(220, 53, 69, 0.2)']
            }
        ]
    }
    return <Line data={data} />
}

export default LineChart;