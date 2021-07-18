import React from 'react'
import { Chart } from 'primereact/chart';
import { YET_TO_START } from '../constants';

const COLORS = ['#2196F3', '#FFFF00'];

function TotalScoreVsOversLineChart({ innings, team, overs, fow }) {
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
                    label: inning.battingTeam,
                    data: [0, ...inning.overs.map((over, index) => {
                        let score = 0;
                        for (let i = 0; i <= index; i++) {
                            score = score + inning.overs[i].totalRunsInThisOver
                        }
                        return score;
                    }), ...inning.fow ? Array.from(inning.fow.map(wkt => wkt.score)) : []].sort((a, b) => a - b),
                    fill: false,
                    borderColor: COLORS[index],
                    tension: .4,
                    radius: function (context) {
                        let index = context.dataIndex;
                        let value = context.dataset.data[index];
                        return inning.fow && inning.fow.some(wkt => wkt.score === value) ? 5 : 0
                    },
                    pointBackgroundColor: COLORS[index]
                }
            })
        };
    } else {
        basicData = {
            labels: [0, ...Array.from((Array(overs.length).keys())).map((key => `${key + 1}`))],
            datasets: [
                {
                    label: team,
                    data: [0, ...overs.map((over, index) => {
                        let score = 0;
                        for (let i = 0; i <= index; i++) {
                            score = score + overs[i].totalRunsInThisOver
                        }
                        return score;
                    }), ...fow ? Array.from(fow.map(wkt => wkt.score)) : []].sort((a, b) => a - b),
                    fill: false,
                    borderColor: '#2196F3',
                    tension: .4,
                    radius: function (context) {
                        let index = context.dataIndex;
                        let value = context.dataset.data[index];
                        return fow && fow.some(wkt => wkt.score === value) ? 5 : 0
                    },
                    pointBackgroundColor: '#2196F3'
                }
            ]
        };
    }

    let basicOptions = {
        responsive: true,
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
                }
            },
            y: {
                stacked: true,
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

export default TotalScoreVsOversLineChart
