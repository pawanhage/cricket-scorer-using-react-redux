import React from 'react'
import { connect } from 'react-redux'
import { getCurrentBowler, getCurrentInning, getCurrentOver, getCurrentRunRate, getNonStrikerBatsman, getStrikerBatsman, getTotalOversCount, getTotalOversPerInning, getTotalPlayersPerSide, getYetToBatOrRetdHurtBatsmen } from '../redux'

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
    totalOversPerInning
}) {

    if (batsmenYetToBatOrRetdHurt.length !== totalPlayersPerSide) {
        return (
            <>
                <div className="rca-live-label rca-right">{currentInning.battingTeam} vs {currentInning.bowlingTeam}</div>
                <div className="rca-clear"></div>
                <div className="rca-padding">
                    <h3 className="rca-match-title">
                        {currentInning.battingTeam} {currentInning.totalScore}/{currentInning.totalWickets} in {totalOvers} Overs
                    </h3>
                    <p className="rca-match-info">
                        <span>CRR:{currentRunRate}</span>
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
                            if (strikerBatsman || nonStrikerBatsman) {
                                return (
                                    <div className="rca-top-padding">
                                        <div className="rca-batsman striker">
                                            <span className="player">{strikerBatsman.name}</span>
                                            <span>{strikerBatsman.runsScored}({strikerBatsman.ballsFaced})</span>
                                        </div>
                                        <div className="rca-batsman">
                                            <span className="player">{nonStrikerBatsman.name}</span>
                                            <span>{nonStrikerBatsman.runsScored}({nonStrikerBatsman.ballsFaced})</span>
                                        </div>
                                    </div>
                                )
                            }
                            return <></>
                        })()
                    }
                    <div className="rca-ball-detail">
                        <div className="rca-match-schedule">
                            Over: {totalOvers}
                        </div>
                        <ul className="rca-ball-by">
                            {
                                (() => {
                                    if (currentOver) {
                                        currentOver.details.map((ball) => {
                                            let clsName = '';
                                            if (ball.includes('6') || ball.includes('4')) {
                                                clsName = 'b6';
                                            }

                                            if (ball.includes('W') && !ball.includes('WD')) {
                                                clsName = 'w';
                                            }
                                            return <li className={clsName}>ball</li>
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
                <div class="rca-right rca-basic-text">12th Feb 2016</div>
                <div class="rca-clear"></div>
                <div class="rca-padding">
                    <h3 class="rca-match-title rca-theme-text">
                        {currentInning.battingTeam} vs {currentInning.bowlingTeam}
                    </h3>
                    <p class="rca-match-info">
                        <span>{totalOversPerInning} Over Match</span>
                    </p>
                    <div class="rca-top-padding">
                        <div class="rca-teams rca-table">
                            <div class="team rca-cell">{currentInning.battingTeam}</div>
                            <div class="rca-vs rca-cell"></div>
                            <div class="team rca-cell">{currentInning.bowlingTeam}</div>
                        </div>
                    </div>
                    <div class="rca-match-start">
                        <h3>Starts in</h3>
                        <div class="rca-padding">
                            <h2>Few Minutes</h2>
                            <p class="rca-center">
                                {Date()}
                            </p>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        currentInning: getCurrentInning(state.match),
        totalOvers: getTotalOversCount(state.match),
        currentRunRate: getCurrentRunRate(state.match),
        strikerBatsman: getStrikerBatsman(state.match),
        nonStrikerBatsman: getNonStrikerBatsman(state.match),
        currentOver: getCurrentOver(state.match),
        currentBowler: getCurrentBowler(state.match),
        batsmenYetToBatOrRetdHurt: getYetToBatOrRetdHurtBatsmen(state.match),
        totalPlayersPerSide: getTotalPlayersPerSide(state.match),
        totalOversPerInning: getTotalOversPerInning(state.match)
    }
}

export default connect(mapStateToProps, null)(CurrentScore)
