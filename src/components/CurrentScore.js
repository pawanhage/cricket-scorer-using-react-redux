import React, { useState } from 'react'
import { connect } from 'react-redux'
import { COMPLETED, IN_PROGRESS, YET_TO_START } from '../constants';
import {
    getCurrentBowler,
    getCurrentInning,
    getCurrentOver,
    getCurrentRunRate,
    getNonStrikerBatsman,
    getRequiredRunRate,
    getStrikerBatsman,
    getTeams,
    getTotalOversCount,
    getTotalOversPerInning
} from '../redux'

function CurrentScore({
    currentInning,
    totalOvers,
    currentRunRate,
    strikerBatsman,
    nonStrikerBatsman,
    currentOver,
    currentBowler,
    totalOversPerInning,
    currentInningIndex,
    tossResult,
    teams,
    requiredRunRate,
    matchResult,
    fow
}) {

    const [whoWonToss,] = useState(Number(String(tossResult).split('')[2]));
    const [tossDecision,] = useState(Number(String(tossResult).split('')[0]) === whoWonToss ? "bat" : "bowl");

    if (currentInning.status === IN_PROGRESS) {
        return (
            <>
                <div class="rca-column-4 rca-no-right-padding">
                    <div class="rca-menu-widget rca-left-border">
                        <div class="pad-10 rca-no-bottom-padding">
                            <span class="rca-match-title">{currentInning.battingTeam}:</span>
                            <span class="rca-match-score bold">{currentInning.totalScore}/{currentInning.totalWickets}</span>
                            <span class="rca-match-title">Overs:</span>
                            <span class="rca-match-score bold">{totalOvers} ({totalOversPerInning})</span>
                            <span class="rca-match-title">CRR:</span>
                            <span class="rca-match-score bold">{currentRunRate}</span>
                        </div>
                        <div class="pad-10">
                            {
                                (() => {
                                    if (currentInning.target) {
                                        return (
                                            <>
                                                <span class="rca-match-title">Target:</span>
                                                <span class="rca-match-score bold">{currentInning.target}</span>
                                                <span class="rca-match-title">RRR:</span>
                                                <span class="rca-match-score bold">{requiredRunRate}</span>
                                            </>
                                        )
                                    } else {
                                        return (
                                            <>
                                                <span class="rca-match-title">Toss:</span>
                                                <span class="rca-match-score bold">{teams[whoWonToss - 1]}({tossDecision})</span>
                                            </>
                                        )
                                    }
                                })()
                            }
                            {
                                (() => {
                                    const partnership = currentInning.partnerships[currentInning.partnerships.length - 1];
                                    const totalBallsFaced = Object.keys(partnership).reduce(((balls, key) => balls + partnership[key].ballsFaced), 0);
                                    const lastWicketScore = fow ? fow[fow.length - 1].score : 0;
                                    return (
                                        <>
                                            <span class="rca-match-title">Partnership:</span>
                                            <span class="rca-match-score bold">{currentInning.totalScore - lastWicketScore}({totalBallsFaced})</span>
                                        </>
                                    )
                                })()
                            }
                        </div>
                    </div>
                </div>
                <div class="rca-column-2  rca-no-right-padding rca-no-left-padding">
                    <div class="rca-left-border" style={{ backgroundColor: 'white' }}>
                        {
                            (() => {
                                return (
                                    <>
                                        {(() => {
                                            if (strikerBatsman) {
                                                return (
                                                    <div className="pad-10 rca-no-bottom-padding">
                                                        <div className="rca-batsman">
                                                            <span className="player">{strikerBatsman.name}</span>
                                                            <span style={{ float: 'right' }}><span style={{ color: '#2196F3' }}>*</span>{strikerBatsman.runsScored}({strikerBatsman.ballsFaced})</span>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                            return <></>
                                        })()}
                                        {(() => {
                                            if (nonStrikerBatsman) {
                                                return (
                                                    <div className="pad-10">
                                                        <div className="rca-batsman">
                                                            <span className="player">{nonStrikerBatsman.name}</span>
                                                            <span style={{ float: 'right' }}>{nonStrikerBatsman.runsScored}({nonStrikerBatsman.ballsFaced})</span>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                            return <></>
                                        })()}
                                    </>
                                )
                            })()
                        }
                    </div>
                </div>
                <div class="rca-column-6 rca-no-left-padding">
                    <div class="rca-menu-widget rca-left-border rca-right-border">
                        <div className="pad-10 rca-no-bottom-padding">
                            <div className="rca-ball-detail" style={{ marginTop: '2.5px' }}>
                                {
                                    (() => {
                                        if (currentBowler) {
                                            return (
                                                <div className="rca-bowler-info" style={{ display: 'inline', marginRight: '5px' }}>
                                                    <span class="rca-match-title">{currentBowler.name}:</span>
                                                    <span className="rca-bolwing">{currentBowler.runsGiven}-{currentBowler.wicketsTaken} in {currentBowler.totalOvers}</span>
                                                </div>
                                            )
                                        }
                                    })()
                                }
                                <div className="rca-match-schedule" style={{ display: 'inline' }}>
                                    <span class="rca-match-title" style={{ marginRight: '5px' }}>This Over:</span>
                                    <ul className="rca-ball-by" style={{ display: 'inline-block' }}>
                                        {
                                            (() => {
                                                if (currentOver && currentOver.details.length) {
                                                    return currentOver.details.map((ball) => {
                                                        let clsName = '';
                                                        if (ball.includes('6') || ball.includes('4')) {
                                                            clsName = 'b6';
                                                        }

                                                        if (ball.includes('W') && !ball.includes('WD')) {
                                                            clsName = 'w';
                                                        }
                                                        return <li className={clsName}>{ball}</li>
                                                    });
                                                }
                                                return <>-</>
                                            })()
                                        }
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="pad-10">
                            {
                                (() => {
                                    if (fow) {
                                        const lastWicket = fow[fow.length - 1];
                                        return (
                                            <>
                                                <span class="rca-match-title">Last Wicket:</span>
                                                <span class="rca-match-score bold">{lastWicket.score}-{currentInning.totalWickets} ({lastWicket.batsman.name})</span>
                                            </>
                                        )
                                    }
                                })()
                            }
                            {
                                (() => {
                                    if (currentInning.target) {
                                        return <span class="rca-match-score bold"> {currentInning.battingTeam} NEEDS {currentInning.target - currentInning.totalScore} RUNS OFF {(((currentInning.target - currentInning.totalScore) / requiredRunRate) * 6).toFixed(0)} BALLS</span>
                                    } else {
                                        return (
                                            <>
                                                <span class="rca-match-title">Projected Score:</span>
                                                <span class="rca-match-score bold">{(currentRunRate * totalOversPerInning).toFixed(0)}</span>
                                            </>
                                        )
                                    }
                                })()
                            }
                        </div>
                    </div>
                </div>
            </>
        )
    } else if (currentInning.status === YET_TO_START) {
        return (
            <>
                <div class="rca-column-12">
                    <div class="rca-menu-widget rca-left-border">
                        <div class="rca-padding" style={{ textAlign: 'center' }}>
                            <span style={{ fontWeight: 'bold' }}>{currentInning.battingTeam} vs {currentInning.bowlingTeam} </span>
                            <span>{totalOversPerInning} Over Match, </span>
                            {
                                (() => {
                                    if (currentInningIndex === 0) {
                                        return (
                                            <>
                                                <span style={{ fontWeight: 'bold' }} className="rca-center">
                                                    Toss Result - {teams[whoWonToss - 1]} won the toss and elected to {tossDecision} first
                                                </span>
                                            </>
                                        )
                                    } else {
                                        return (
                                            <>
                                                <span style={{ fontWeight: 'bold' }}>{currentInning.battingTeam} Requires {currentInning.target} in {totalOversPerInning} Overs at Rate {requiredRunRate} Runs Per Over</span>
                                            </>
                                        )
                                    }
                                })()
                            }
                        </div>
                    </div>
                </div>
            </>
        )
    } else if (matchResult) {
        return (
            <>
                <div class="rca-column-12">
                    <div class="rca-menu-widget rca-left-border">
                        <div class="rca-padding" style={{ textAlign: 'center' }}>
                            <span style={{ fontWeight: 'bold' }}>1'st Inning {currentInning.bowlingTeam} - {currentInning.target - 1}, </span>
                            <span style={{ fontWeight: 'bold' }}>2'nd Inning {currentInning.battingTeam} - {currentInning.totalScore}/{currentInning.totalWickets}, {matchResult}</span>
                        </div>
                    </div>
                </div>
            </>
        )
    } else if (currentInning.status === COMPLETED) {
        return (
            <>
                <div class="rca-column-12">
                    <div class="rca-menu-widget rca-left-border">
                        <div class="rca-padding" style={{ textAlign: 'center' }}>
                            {
                                (() => {
                                    let suffix = '';
                                    if (currentInningIndex === 0) {
                                        suffix = 'st';
                                    } else if (currentInningIndex === 1) {
                                        suffix = 'nd';
                                    } else if (currentInningIndex === 2) {
                                        suffix = 'rd';
                                    } else if (currentInningIndex === 3) {
                                        suffix = 'th';
                                    }
                                    return (
                                        <>
                                            <span>{currentInningIndex + 1}'{suffix} Inning </span>
                                        </>
                                    )
                                })()
                            }
                            <span style={{ fontWeight: 'bold' }}>{currentInning.battingTeam} - {currentInning.totalScore}/{currentInning.totalWickets}, </span>
                            <span style={{ fontWeight: 'bold' }}>{currentInning.bowlingTeam} Requires {currentInning.totalScore + 1} Runs in {totalOversPerInning} Overs at Rate {Number(((currentInning.totalScore + 1) / totalOversPerInning).toFixed(2))} Runs Per Over</span>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        teams: getTeams(state.match),
        tossResult: state.match.details.tossResult,
        matchResult: state.match.details.result,
        currentInningIndex: state.match.currentInningIndex,
        currentInning: getCurrentInning(state.match),
        totalOvers: getTotalOversCount(state.match),
        currentRunRate: getCurrentRunRate(state.match),
        requiredRunRate: getRequiredRunRate(state.match),
        strikerBatsman: getStrikerBatsman(state.match),
        nonStrikerBatsman: getNonStrikerBatsman(state.match),
        currentOver: getCurrentOver(state.match),
        currentBowler: getCurrentBowler(state.match),
        totalOversPerInning: getTotalOversPerInning(state.match),
        fow: state.match.innings[state.match.currentInningIndex].fow
    }
}

export default connect(mapStateToProps, null)(CurrentScore)
