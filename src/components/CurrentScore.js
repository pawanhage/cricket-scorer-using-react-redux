import React, { useState } from 'react'
import { connect } from 'react-redux'
import { getCurrentBowler, getCurrentInning, getCurrentOver, getCurrentRunRate, getLiveScore, getNonStrikerBatsman, getStrikerBatsman, getTeams, getTotalOversCount, getTotalOversPerInning, getTotalPlayersPerSide, getYetToBatOrRetdHurtBatsmen } from '../redux'
import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';
import UpdateScore from './UpdateScore';

function Update({ liveScore }) {
    const [visibleRight, setVisibleRight] = useState(false);
    return (
        <>
            {/* <Sidebar visible={visibleRight} position="right" onHide={() => setVisibleRight(false)}>
                <h2>Update Ball By Ball</h2>
                {<UpdateScore></UpdateScore>}
            </Sidebar>
            <Button style={{ display: 'inline' }} icon="pi pi-user" className="p-button-rounded p-button-info" onClick={() => setVisibleRight(true)} /> */}
        </>
    )
}

function CurrentScore({
    currentInning,
    totalOvers,
    currentRunRate,
    strikerBatsman,
    nonStrikerBatsman,
    currentOver,
    currentBowler,
    batsmenYetToBatOrRetdHurt,
    totalPlayersPerSide,
    totalOversPerInning,
    currentInningIndex,
    tossResult,
    teams,
    liveScore
}) {

    if (batsmenYetToBatOrRetdHurt.length !== totalPlayersPerSide) {
        return (
            <>
                <div class="rca-column-3 rca-no-right-padding">
                    <div class="rca-menu-widget rca-left-border">
                        <div class="rca-padding">
                            <span class="rca-match-title">{currentInning.battingTeam}</span>
                            <span class="rca-match-score">{currentInning.totalScore}/{currentInning.totalWickets} Overs {totalOvers}</span>
                            <span>CRR: {currentRunRate}</span>
                            {
                                (() => {
                                    if (currentInning.targetScore) {
                                        return <span>RRR:10.1</span>;
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
                                                                <span>*{strikerBatsman.runsScored}({strikerBatsman.ballsFaced})</span>
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
                                                    <span>{currentBowler.name}: </span><span className="rca-bolwing">{currentBowler.runsGiven}/{currentBowler.wicketsTaken} in {currentBowler.totalOvers}</span>
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
                    <Update liveScore={liveScore}></Update>
                </div>


                {/* <div className="rca-live-label rca-right">{currentInning.battingTeam} vs {currentInning.bowlingTeam}</div>
                <div className="rca-clear"></div>
                <div className="rca-padding">
                    <h3 className="rca-match-title">
                        {currentInning.battingTeam} {currentInning.totalScore}/{currentInning.totalWickets} in {totalOvers} Overs
                    </h3>
                    <p className="rca-match-info">
                        <span>CRR: {currentRunRate}</span>
                        {
                            (() => {
                                if (currentInning.targetScore) {
                                    return <span>RRR:10.1</span>;
                                }
                            })()
                        }
                    </p>
                    {
                        (() => {
                            return (
                                <div className="rca-top-padding">
                                    <>
                                        {(() => {
                                            if (strikerBatsman) {
                                                return (
                                                    <div className="rca-batsman striker">                                                        <span className="player">{strikerBatsman.name}</span>
                                                        <span>{strikerBatsman.runsScored}({strikerBatsman.ballsFaced})</span>
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
                                                    <div className="rca-batsman">                                                        <span className="player">{nonStrikerBatsman.name}</span>
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
                    <div className="rca-ball-detail">
                        <div className="rca-match-schedule">
                            Over: {totalOvers}
                        </div>
                        <ul className="rca-ball-by">
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
                        {
                            (() => {
                                if (currentBowler) {
                                    return (
                                        <div className="rca-bowler-info">
                                            <span>{currentBowler.name}: </span><span className="rca-bolwing">{currentBowler.runsGiven}/{currentBowler.wicketsTaken} in {currentBowler.totalOvers}</span>
                                        </div>
                                    )
                                }
                            })()
                        }
                    </div>
                </div>
                {/* TODO Add Commentary */}
                {/* <div className="rca-top-padding rca-score-status">
                    <div className="rca-status-scroll">
                        FOUR!!! from Dhoni
                    </div>
                </div> */}
            </>
        )
    } else {
        return (
            <>
                <Update liveScore={liveScore}></Update>

                {/* <div className="rca-right rca-basic-text">12th Feb 2016</div>
                <div className="rca-clear"></div>
                <div className="rca-padding">
                    <h3 className="rca-match-title rca-theme-text">
                        {currentInning.battingTeam} vs {currentInning.bowlingTeam}
                    </h3>
                    <p className="rca-match-info">
                        <span>{totalOversPerInning} Over Match</span>
                    </p>
                    <div className="rca-top-padding">
                        <div className="rca-teams rca-table">
                            <div className="team rca-cell">{currentInning.battingTeam}</div>
                            <div className="rca-vs rca-cell"></div>
                            <div className="team rca-cell">{currentInning.bowlingTeam}</div>
                        </div>
                    </div>
                    <div className="rca-match-start">
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
                                        <h3>{currentInningIndex + 1}'{suffix} Inning</h3>
                                    </>
                                )
                            })()
                        }
                        {
                            (() => {
                                if (currentInningIndex === 0) {
                                    const whoWon = Number(String(tossResult).split('')[2]);
                                    const decision = Number(String(tossResult).split('')[0]) === 1 ? "bat" : "bowl";
                                    return (
                                        <>
                                            <h2>{currentInning.battingTeam} {currentInning.totalScore}/{currentInning.totalWickets} in {totalOvers} Overs
                                            </h2>
                                            <p className="rca-center">
                                                {teams[whoWon - 1]} won the toss and elected to {decision} first
                                            </p>
                                        </>
                                    )
                                } else {
                                    return <></>;
                                }
                            })()
                        }
                    </div>
                </div> */}
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        teams: getTeams(state.match),
        tossResult: state.match.details.tossResult,
        currentInningIndex: state.match.currentInningIndex,
        currentInning: getCurrentInning(state.match),
        totalOvers: getTotalOversCount(state.match),
        currentRunRate: getCurrentRunRate(state.match),
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
