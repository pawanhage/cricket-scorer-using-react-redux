import React from 'react'
import { Chart } from 'primereact/chart';
import { YET_TO_START } from '../constants';

const COLORS = ['#2196F3', '#FFFF00'];

function ComparisionChart({ innings }) {
    let basicData;
    if (innings) {
        let maxOvers;
        if (innings[0].status !== YET_TO_START) {
            maxOvers = innings[0].overs;
        }
        if (innings[1].status !== YET_TO_START) {
            maxOvers = innings[0].overs.length > innings[1].overs.length ? innings[0].overs : innings[1].overs
        }
        basicData = {
            labels: [0, ...Array.from((Array(maxOvers.length).keys())).map((key => `${key + 1}`))],
            datasets: innings.map((inning, index) => {
                return {
                    type: 'line',
                    label: inning.battingTeam,
                    data: [0, ...inning.overs.map((over, index) => {
                        let score = 0;
                        for (let i = 0; i <= index; i++) {
                            score = score + inning.overs[i].totalRunsInThisOver
                        }
                        return score;
                    })],
                    fill: false,
                    borderColor: COLORS[index],
                    tension: .4,
                    radius: 0,
                    pointBackgroundColor: COLORS[index]
                }
            })
        };

        basicData = {
            ...basicData,
            datasets: [
                ...basicData.datasets,
                ...innings.map((inning, index) => {
                    return {
                        type: 'bar',
                        label: `${inning.battingTeam} Runs Per Over`,
                        data: [0, ...Array.from(inning.overs.map(over => over.totalRunsInThisOver))],
                        backgroundColor: COLORS[index]
                    }
                })
            ]
        }
    }

    let basicOptions = {
        maintainAspectRatio: false,
        aspectRatio: .6,
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                },
            },
            y: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            }
        }
    };

    return (
        <div class="rca-batting-score rca-padding ">
            <Chart style={{ height: '325px' }} type="line" data={basicData} options={basicOptions} />
        </div>
    )
}

export default ComparisionChart
