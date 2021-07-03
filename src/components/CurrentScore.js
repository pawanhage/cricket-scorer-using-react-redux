import React from 'react'
import { connect } from 'react-redux'
import { getCurrentBowler, getCurrentInning, getCurrentOver, getCurrentRunRate, getNonStrikerBatsman, getStrikerBatsman, getTotalOversCount } from '../redux'

function CurrentScore({
    currentInning,
    totalOvers,
    currentRunRate,
    strikerBatsman,
    nonStrikerBatsman,
    currentOver,
    currentBowler }) {

    return (
        <>
            <div className="rca-live-label rca-right">{currentInning.battingTeam} vs {currentInning.bowlingTeam}</div>
            <div className="rca-clear"></div>
            <div className="rca-padding">
                <h3 className="rca-match-title">
                    <a href="/main.html">
                        {currentInning.battingTeam}: {currentInning.totalScore}/{currentInning.totalWickets} in {totalOvers}
                    </a>
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
                                        if (ball.contains('6') || ball.contains('4')) {
                                            clsName = 'b6';
                                        }

                                        if (ball.contains('W') && !ball.contains('WD')) {
                                            clsName = 'w';
                                        }
                                        return <li className={clsName}>ball</li>
                                    });
                                }
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
            <div className="rca-top-padding rca-score-status">
                <div className="rca-status-scroll">
                    FOUR!!! from Dhoni
                </div>
            </div>
        </>
    )
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
    }
}

export default connect(mapStateToProps, null)(CurrentScore)
