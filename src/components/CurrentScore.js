import React from 'react'
import { connect } from 'react-redux'
import { COMPLETED, IN_PROGRESS, YET_TO_START } from '../constants';
import { getCurrentBowler, getCurrentInning, getCurrentOver, getCurrentRunRate, getLiveScore, getNonStrikerBatsman, getRequiredRunRate, getStrikerBatsman, getTeams, getTotalOversCount, getTotalOversPerInning, getTotalPlayersPerSide, getYetToBatOrRetdHurtBatsmen } from '../redux'

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
    matchResult
}) {

    if (currentInning.status === IN_PROGRESS) {
        return (
            <>
                <div class="rca-column-3 rca-no-right-padding">
                    <div class="rca-menu-widget rca-left-border">
                        <div class="rca-padding">
                            <span class="rca-match-title">{currentInning.battingTeam}:</span>
                            <span class="rca-match-score">{currentInning.totalScore}/{currentInning.totalWickets} Overs: {totalOvers}</span>
                            <span>CRR: {currentRunRate} </span>
                            {
                                (() => {
                                    if (currentInning.target) {
                                        return <span>RRR: {requiredRunRate}</span>;
                                    }
                                })()
                            }
                        </div>
                    </div>
                </div>
                <div class="rca-column-3  rca-no-right-padding rca-no-left-padding">
                    <div class="rca-menu-widget rca-left-border">
                        <div class="rca-padding">
                            {
                                (() => {
                                    return (
                                        <div style={{ textAlignLast: 'justify' }}>
                                            <>
                                                {(() => {
                                                    if (strikerBatsman) {
                                                        return (
                                                            <div className="rca-batsman" style={{ display: 'inline', marginRight: '5px' }}>
                                                                <span className="player">{strikerBatsman.name}</span>
                                                                <span><span style={{ color: '#2196F3' }}>*</span>{strikerBatsman.runsScored}({strikerBatsman.ballsFaced})</span>
                                                            </div>
                                                        )
                                                    }
                                                    return <></>
                                                })()}
                                            </>
                                            <>
                                                {(() => {
                                                    if (nonStrikerBatsman) {
                                                        return (
                                                            <div className="rca-batsman" style={{ display: 'inline' }}>
                                                                <span className="player">{nonStrikerBatsman.name}</span>
                                                                <span>{nonStrikerBatsman.runsScored}({nonStrikerBatsman.ballsFaced})</span>
                                                            </div>
                                                        )
                                                    }
                                                    return <></>
                                                })()}
                                            </>
                                        </div>
                                    )
                                })()
                            }
                        </div>
                    </div>
                </div>
                <div class="rca-column-6 rca-no-left-padding">
                    <div class="rca-menu-widget rca-left-border rca-right-border">
                        <div class="rca-padding">
                            <div className="rca-ball-detail" style={{ marginTop: '2.5px' }}>
                                {
                                    (() => {
                                        if (currentBowler) {
                                            return (
                                                <div className="rca-bowler-info" style={{ display: 'inline', marginRight: '5px' }}>
                                                    <span>{currentBowler.name}: </span><span className="rca-bolwing">{currentBowler.runsGiven}-{currentBowler.wicketsTaken} in {currentBowler.totalOvers}</span>
                                                </div>
                                            )
                                        }
                                    })()
                                }
                                <div className="rca-match-schedule" style={{ display: 'inline' }}>
                                    <span style={{ marginRight: '5px' }}>This Over</span>
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
                    </div>
                </div>
            </>
        )
    } else if (currentInning.status === YET_TO_START) {
        return (
            <>
                <div class="rca-column-12">
                    <div class="rca-menu-widget rca-left-border">
                        <div class="rca-padding">
                            <span style={{ fontWeight: 'bold' }}>{currentInning.battingTeam} vs {currentInning.bowlingTeam} </span>
                            <span>{totalOversPerInning} Over Match, </span>
                            {
                                (() => {
                                    if (currentInningIndex === 0) {
                                        const whoWon = Number(String(tossResult).split('')[2]);
                                        const decision = Number(String(tossResult).split('')[0]) === whoWon ? "bat" : "bowl";
                                        return (
                                            <>
                                                <span style={{ fontWeight: 'bold' }} className="rca-center">
                                                    Toss Result - {teams[whoWon - 1]} won the toss and elected to {decision} first
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
                        <div class="rca-padding">
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
                        <div class="rca-padding">
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
        innings: state.match.innings,
        currentInningIndex: state.match.currentInningIndex,
        currentInning: getCurrentInning(state.match),
        totalOvers: getTotalOversCount(state.match),
        currentRunRate: getCurrentRunRate(state.match),
        requiredRunRate: getRequiredRunRate(state.match),
        strikerBatsman: getStrikerBatsman(state.match),
        nonStrikerBatsman: getNonStrikerBatsman(state.match),
        currentOver: getCurrentOver(state.match),
        currentBowler: getCurrentBowler(state.match),
        batsmenYetToBatOrRetdHurt: getYetToBatOrRetdHurtBatsmen(state.match),
        totalPlayersPerSide: getTotalPlayersPerSide(state.match),
        totalOversPerInning: getTotalOversPerInning(state.match),
        liveScore: getLiveScore(state.match)
    }
}

export default connect(mapStateToProps, null)(CurrentScore)
