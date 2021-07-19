import React from 'react'
import { Chart } from 'primereact/chart';

function RunsVsOversBarChart({ overs }) {
    const basicData = {
        labels: Array.from((Array(overs.length).keys())).map((key => `Over ${key + 1}`)),
        datasets: [
            {
                label: 'Runs',
                backgroundColor: '#2196F3',
                data: Array.from(overs.map(over => over.totalRunsInThisOver))
            }
        ]
    };

    let basicOptions = {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
            legend: {
                labels: {
                    color: '#2196F3'
                }
            }
        },
        scales: {
            x: {
                grid: {
                    color: '#ebedef'
                }
            },
            y: {
                grid: {
                    color: '#ebedef'
                },
                beginAtZero: true
            }
        }
    };

    return (
        <div class="rca-batting-score rca-padding ">
            <Chart style={{ height: '325px' }} type="bar" data={basicData} options={basicOptions} />
        </div>
    )
}

export default RunsVsOversBarChart
