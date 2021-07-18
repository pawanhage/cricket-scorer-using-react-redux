import React, { useState, useEffect, useReducer, createContext } from 'react'
import { connect } from 'react-redux';
import {
    getNotOutBatsmen,
    getYetToBatOrRetdHurtBatsmen,
    getCurrentBowler,
    getNextPossibleBowlers,
    getNonStrikerBatsman,
    getStrikerBatsman,
    getTotalPlayersPerSide,
    getTotalWickets,
    updateInnings,
    getLastBall,
    getCurrentOver,
    getBowlingTeamPlayers,
    getTotalOversCount,
    getTotalOversPerInning,
    startNextInning,
    setMatchResult,
} from '../redux';
import { Dropdown } from 'primereact/dropdown';
import {
    BOWLED,
    BYES,
    CAUGHT_BY,
    COMPLETE,
    COMPLETED,
    EXTRAS_OPTIONS,
    FIELD_OBSTRUCT,
    HIT_WICKET,
    IN_PROGRESS,
    LBW,
    LEG_BYES,
    NOT_OUT_ON_NON_STRIKE,
    NOT_OUT_ON_STRIKE,
    NO_BALL,
    NO_BALL_OFF_BAT,
    PENALTY_RUNS,
    RUNS_OPTIONS,
    RUN_OUT,
    STUMPED,
    WICKET,
    WICKET_OPTIONS,
    WIDE,
    YET_TO_START
} from '../constants';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { getTotalOvers, getUpdatedInningStats, isContinueButtonDisabledForCurrentBall } from '../utils/cricketUtils';
import { cloneDeep } from '../utils/common';
import WicketDetails from './WicketDetails';
import { ToggleButton } from 'primereact/togglebutton';

const initialWicketDetailsState = {
    wicketType: null,
    whoOut: null,
    outByPlayer: null
}

const wicketDetailsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_WICKET_TYPE':
            return { ...state, wicketType: action.payload };
        case 'SET_WHO_OUT':
            return { ...state, whoOut: action.payload };
        case 'SET_OUT_BY_PLAYER':
            return { ...state, outByPlayer: action.payload };
        case 'RESET_WICKET_DETAILS_STATE':
            return initialWicketDetailsState
        default:
            return state
    }
}

export const WicketDetailsContext = createContext();

function UpdateScore({
    totalPlayersPerSide,
    batsmenYetToBatOrRetdHurt,
    strikerBatsman,
    nonStrikerBatsman,
    batsmenNotOut,
    nextPossibleBowlers,
    currentBowler,
    totalWickets,
    currentInningIndex,
    innings,
    lastBall,
    currentOver,
    bowlingTeamPlayers,
    totalOvers,
    totalOversPerInning,
    matchResult,
    updateInnings,
    startNextInning,
    setMatchResult
}) {

    const [batsmanOnStrike, setBatsmanOnStrike] = useState(strikerBatsman ? strikerBatsman.name : null);
    const [batsmanOnNonStrike, setBatsmanOnNonStrike] = useState(nonStrikerBatsman ? nonStrikerBatsman.name : null);
    const [wicketDetailsState, dispatchWicketDetails] = useReducer(wicketDetailsReducer, initialWicketDetailsState);

    const [nextBowler, setNextBowler] = useState(currentBowler);

    useEffect(() => {
        if (!currentBowler) {
            setNextBowler(null);
        }
    }, [currentBowler]);

    const [nextBatsman, setNextBatsman] = useState(null);
    const [isCurrentBatsmanOnStrike, setCurrentBatsmanOnStrike] = useState(true);

    useEffect(() => {
        if (lastBall.indexOf(WICKET) > -1 && batsmenNotOut.length && batsmenNotOut.length < 2) {
            if (!isCurrentBatsmanOnStrike) {
                if (nextBatsman) {
                    setBatsmanOnStrike(nextBatsman);
                } else {
                    setBatsmanOnStrike(null);
                }
                if (batsmenNotOut[0].name) {
                    setBatsmanOnNonStrike(batsmenNotOut[0].name)
                }
            } else {
                if (nextBatsman) {
                    setBatsmanOnNonStrike(nextBatsman);
                } else {
                    setBatsmanOnNonStrike(null);
                }
                if (batsmenNotOut[0].name) {
                    setBatsmanOnStrike(batsmenNotOut[0].name)
                }
            }
        }
    }, [isCurrentBatsmanOnStrike, nextBatsman, batsmenNotOut, lastBall]);

    const [runsOptions, setRunsOptions] = useState(RUNS_OPTIONS);
    const [extrasOptions, setExtraOptions] = useState(EXTRAS_OPTIONS);
    const [wicketOptions, setWicketOptions] = useState(WICKET_OPTIONS)

    const [runs, setRuns] = useState(0);

    /* if runs are set and greater than 0, disable invalid wicket options */
    useEffect(() => {
        const newWicketOptions = cloneDeep(WICKET_OPTIONS);
        if (runs && runs > 0) {
            newWicketOptions.map((wicket) => [BOWLED, LBW, CAUGHT_BY, HIT_WICKET, STUMPED].includes(wicket.value) ? wicket.disabled = true : wicket.disabled = false);
            dispatchWicketDetails({ type: 'RESET_WICKET_DETAILS_STATE' });
        };
        setWicketOptions([...newWicketOptions]);
    }, [runs]);

    const [extra, setExtra] = useState(null);
    /* if set penalty runs equal to 5 and disable other run options */
    useEffect(() => {
        const newRunsOptions = cloneDeep(RUNS_OPTIONS);
        if (extra && extra === PENALTY_RUNS) {
            newRunsOptions.map((run) => [0, 1, 2, 3, 4, 6].includes(run.value) ? run.disabled = true : run.disabled = false);
            dispatchWicketDetails({ type: 'RESET_WICKET_DETAILS_STATE' });
            setRuns(5);
        }
        setRunsOptions([...newRunsOptions]);
    }, [extra]);

    /* if wicket is set and disable other invalid extra option options */
    useEffect(() => {
        const newExtrasOptions = cloneDeep(EXTRAS_OPTIONS);
        if (wicketDetailsState.wicketType) {
            if ([BOWLED, LBW, CAUGHT_BY].includes(wicketDetailsState.wicketType)) {
                newExtrasOptions.map((extra) => extra.disabled = true);
                setExtra(null);
            } else if (wicketDetailsState.wicketType === STUMPED) {
                newExtrasOptions.map((extra) => (extra.value !== WIDE) ? extra.disabled = true : extra.disabled = false);
                if ([LEG_BYES, BYES, PENALTY_RUNS, NO_BALL, NO_BALL_OFF_BAT].includes(extra)) {
                    setExtra(null);
                }
            }
        }
        setExtraOptions([...newExtrasOptions]);
    }, [wicketDetailsState.wicketType, extra]);

    useEffect(() => {
        if ([FIELD_OBSTRUCT, RUN_OUT].includes(wicketDetailsState.wicketType)) {
            dispatchWicketDetails({ type: 'SET_WHO_OUT', payload: null });
            dispatchWicketDetails({ type: 'SET_OUT_BY_PLAYER', payload: null });
        }

        if ([BOWLED, LBW, HIT_WICKET, STUMPED, CAUGHT_BY].includes(wicketDetailsState.wicketType)) {
            dispatchWicketDetails({ type: 'SET_WHO_OUT', payload: batsmanOnStrike });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wicketDetailsState.wicketType]);

    const [currentBall, setCurrentBall] = useState('');

    useEffect(() => {
        let ball = [];
        if (runs || runs === 0) {
            ball.push(runs);
        }

        if (extra) {
            ball.push(extra);
        }

        if (wicketDetailsState.wicketType) {
            if (ball.length) {
                if (!(runs === 0 && ball.length === 1)) {
                    ball.push('+');
                }
            }
            ball.push(WICKET);
            if (runs === 0) {
                ball.splice(0, 1);
            }
        }
        setCurrentBall(ball);
    }, [runs, extra, wicketDetailsState.wicketType]);

    const batsmenYetToBatOrRetdHurtOptions = batsmenYetToBatOrRetdHurt.map((batsman) => {
        return { name: batsman.name, value: batsman.name }
    });

    const batsmenNotOutOptions = batsmenNotOut.map((batsman) => {
        return { name: batsman.name, value: batsman.name }
    });

    const nextPossibleBowlersOptions = nextPossibleBowlers.map((bowler) => {
        return { name: bowler.name, value: bowler.name }
    });

    const bowlingTeamPlayersOptions = bowlingTeamPlayers.map((player) => {
        return { name: player, value: player }
    });

    const currentBatsmanOptions = [batsmanOnStrike, batsmanOnNonStrike].map((player) => {
        return { name: player, value: player }
    });

    const resetBall = () => {
        dispatchWicketDetails({ type: 'RESET_WICKET_DETAILS_STATE' });
        setRuns(null);
        setExtra(null);
    }

    const saveBall = () => {
        innings[currentInningIndex] = {
            ...innings[currentInningIndex],
            ...getUpdatedInningStats(innings[currentInningIndex], currentBall, strikerBatsman, nonStrikerBatsman, currentBowler, wicketDetailsState)
        }

        const getMatchResult = () => {
            let matchResult;
            if (innings[currentInningIndex].target) {
                if (innings[currentInningIndex].totalScore >= innings[currentInningIndex].target) {
                    matchResult = `${innings[currentInningIndex].battingTeam} Won By ${innings[currentInningIndex].batsmen.length - 1 - innings[currentInningIndex].totalWickets} Wickets`
                    innings[currentInningIndex].status = COMPLETED;
                } else if (innings[currentInningIndex].status === COMPLETED) {
                    if (innings[currentInningIndex].totalScore === innings[currentInningIndex].target - 1) {
                        matchResult = 'Match Tied';
                    } else {
                        matchResult = `${innings[currentInningIndex].bowlingTeam} Won By ${innings[currentInningIndex].target - innings[currentInningIndex].totalScore - 1} Runs`;
                    }
                }
            }
            return matchResult;
        }

        if ((innings[currentInningIndex].totalWickets === innings[currentInningIndex].batsmen.length - 1) || getTotalOvers(innings[currentInningIndex].overs) === totalOversPerInning) {
            innings[currentInningIndex].status = COMPLETED;
            if (innings[currentInningIndex + 1]) {
                innings[currentInningIndex + 1].target = innings[currentInningIndex].totalScore + 1
            }
        }
        setMatchResult(getMatchResult());
        updateInnings(innings);
        resetBall();
    }

    const CurrentBallDetails = () => {
        if (currentBowler && totalWickets < totalPlayersPerSide - 1 && currentOver.status === IN_PROGRESS && !(batsmenNotOut.length < 2)) {
            return (
                <>
                    <div className="marg-bottom-10" style={{ display: 'inline-flex' }}>
                        <div className="marg-right-10" >
                            <div className="marg-top-right-bottom-10 equal-width">Runs</div>
                            <div className="equal-width">
                                <Dropdown optionLabel="label" value={runs} options={runsOptions} onChange={(e) => setRuns(e.value)} placeholder="Select" />
                                <InputNumber disabled={extra === PENALTY_RUNS} className="marg-left-10" value={runs} onValueChange={(e) => setRuns(e.value)} mode="decimal" min={0} max={100} />
                            </div>
                        </div>
                        <div className="marg-right-10" >
                            <div className="marg-top-right-bottom-10 equal-width">Extras</div>
                            <div className="equal-width">
                                <Dropdown optionLabel="label" value={extra} options={extrasOptions} onChange={(e) => setExtra(e.value)} placeholder="Select" />
                            </div>
                        </div>
                        <div className="marg-right-10" >
                            <div className="marg-top-right-bottom-10 equal-width">Wicket</div>
                            <div className="equal-width">
                                <Dropdown optionLabel="label" value={wicketDetailsState.wicketType} options={wicketOptions} onChange={(e) => dispatchWicketDetails({ type: 'SET_WICKET_TYPE', payload: e.value })} placeholder="Select" />
                            </div>
                        </div>
                        <div className="marg-right-10" style={{ display: 'inherit' }} >
                            <WicketDetailsContext.Provider value={{ wicketDetails: wicketDetailsState, dispatchWicketDetails: dispatchWicketDetails, currentBatsmanOptions: currentBatsmanOptions, bowlingTeamPlayersOptions: bowlingTeamPlayersOptions }}>
                                <WicketDetails></WicketDetails>
                            </WicketDetailsContext.Provider>
                        </div>
                    </div>
                    <div style={{ "textAlignLast": "center" }}>
                        <Button style={{ "marginRight": "10px" }} type="button" label="Reset Ball" onClick={() => resetBall()} />
                        <Button type="button" disabled={isContinueButtonDisabledForCurrentBall(runs, extra, wicketDetailsState.wicketType, wicketDetailsState.whoOut, wicketDetailsState.outByPlayer)} label="Save Ball" onClick={() => saveBall()} />
                    </div>
                </>
            )
        }
        return <></>;
    }

    const continueMatch = () => {
        if (batsmenYetToBatOrRetdHurt.length === totalPlayersPerSide || (lastBall.indexOf(WICKET) > -1)) {
            const strikerIndex = innings[currentInningIndex].batsmen.findIndex((batsman) => batsman.name === batsmanOnStrike);
            if (strikerIndex > -1) {
                innings[currentInningIndex].batsmen[strikerIndex] = {
                    ...innings[currentInningIndex].batsmen[strikerIndex],
                    status: NOT_OUT_ON_STRIKE,
                    order: batsmenYetToBatOrRetdHurt.length === totalPlayersPerSide ? 1 : (innings[currentInningIndex].batsmen[strikerIndex].order ? innings[currentInningIndex].batsmen[strikerIndex].order : totalWickets + 2)
                }
            }

            const nonStrikerIndex = innings[currentInningIndex].batsmen.findIndex((batsman) => batsman.name === batsmanOnNonStrike);
            if (nonStrikerIndex > -1) {
                innings[currentInningIndex].batsmen[nonStrikerIndex] = {
                    ...innings[currentInningIndex].batsmen[nonStrikerIndex],
                    status: NOT_OUT_ON_NON_STRIKE,
                    order: batsmenYetToBatOrRetdHurt.length === totalPlayersPerSide ? 2 : (innings[currentInningIndex].batsmen[nonStrikerIndex].order ? innings[currentInningIndex].batsmen[nonStrikerIndex].order : totalWickets + 2)
                }
            }

            if (innings[currentInningIndex].partnerships) {
                innings[currentInningIndex].partnerships = [
                    ...innings[currentInningIndex].partnerships,
                    {
                        [innings[currentInningIndex].batsmen[strikerIndex].name]: {
                            runsScored: 0,
                            ballsFaced: 0
                        },
                        [innings[currentInningIndex].batsmen[nonStrikerIndex].name]: {
                            runsScored: 0,
                            ballsFaced: 0
                        }
                    }
                ]
            } else {
                innings[currentInningIndex].partnerships = [
                    {
                        [innings[currentInningIndex].batsmen[strikerIndex].name]: {
                            runsScored: 0,
                            ballsFaced: 0,
                        },
                        [innings[currentInningIndex].batsmen[nonStrikerIndex].name]: {
                            runsScored: 0,
                            ballsFaced: 0
                        }
                    }
                ]
            }
        }

        if (!currentOver || currentOver.status === COMPLETE) {
            let index = innings[currentInningIndex].bowlers.findIndex((bowler) => bowler.name === nextBowler);
            if (index > -1) {
                innings[currentInningIndex].overs.push({
                    details: [],
                    bowlerName: nextBowler,
                    status: IN_PROGRESS,
                    totalRunsInThisOver: 0
                });
            }
        }
        innings[currentInningIndex].status = IN_PROGRESS;
        updateInnings(innings);
    }

    const ChooseBatsmanAndBowler = () => {
        let batsmanBowlerJsx = [];
        if (batsmenYetToBatOrRetdHurt.length === totalPlayersPerSide) {
            batsmanBowlerJsx.push(
                <div key={batsmanBowlerJsx.length} className="marg-bottom-10" style={{ display: 'inline-flex' }} >
                    {/* Choose New Batsmen */}
                    <div className="marg-right-10">
                        <div className="marg-top-right-bottom-10 equal-width" >On Strike End</div>
                        <Dropdown className="equal-width" optionLabel="name" value={batsmanOnStrike} options={batsmenYetToBatOrRetdHurtOptions} onChange={(e) => setBatsmanOnStrike(e.value)} placeholder="Select" />
                    </div>
                    <div className="marg-right-10">
                        <div className="marg-top-right-bottom-10 equal-width" >On Non Strike End</div>
                        <Dropdown className="equal-width" optionLabel="name" value={batsmanOnNonStrike} options={batsmenYetToBatOrRetdHurtOptions} onChange={(e) => setBatsmanOnNonStrike(e.value)} placeholder="Select" />
                    </div>
                </div>
            )
        } else if (totalWickets < totalPlayersPerSide - 1 && lastBall.indexOf(WICKET) > -1 && batsmenNotOut.length < 2) {
            batsmanBowlerJsx.push(
                <div key={batsmanBowlerJsx.length} className="marg-bottom-10" style={{ display: 'inline-flex' }}>
                    {/* Choose Batsman after wicket gone */}
                    <div className="marg-right-10" >
                        <div className="marg-top-right-bottom-10 equal-width">Current Batsman</div>
                        <div className="equal-width">
                            <Dropdown optionLabel="name" value={batsmenNotOut[0].name} options={batsmenNotOutOptions} onChange={(e) => setBatsmanOnStrike(e.value)} placeholder="Select" />
                            <ToggleButton style={{ marginLeft: "10px" }} checked={isCurrentBatsmanOnStrike} onChange={(e) => setCurrentBatsmanOnStrike(e.value)} onLabel="On Strike" offLabel="On Non Strike" onIcon="pi pi-check" offIcon="pi pi-times" />
                        </div>
                    </div>
                    <div className="marg-right-10">
                        <div className="marg-top-right-bottom-10">Next Batsman</div>
                        <div className="equal-width">
                            <Dropdown optionLabel="name" value={nextBatsman} options={batsmenYetToBatOrRetdHurtOptions} onChange={(e) => setNextBatsman(e.value)} placeholder="Select" />
                            <ToggleButton style={{ marginLeft: "10px" }} checked={!isCurrentBatsmanOnStrike} onChange={(e) => setCurrentBatsmanOnStrike(!e.value)} onIcon="pi pi-check" onLabel="On Strike" offLabel="On Non Strike" offIcon="pi pi-times" />
                        </div>
                    </div>
                </div>
            );
        }
        if ((!currentBowler || currentOver.status === COMPLETE) && totalOvers < totalOversPerInning) {
            batsmanBowlerJsx.push(
                <div key={batsmanBowlerJsx.length} className="marg-bottom-10" style={{ display: 'inline-flex' }}>
                    <div className="marg-right-10">
                        <div className="marg-top-right-bottom-10 equal-width">Choose Bowler</div>
                        <Dropdown className="equal-width" optionLabel="name" value={nextBowler} options={nextPossibleBowlersOptions} onChange={(e) => setNextBowler(e.value)} placeholder="Select" />
                    </div>
                </div>
            );
        }
        if (batsmanBowlerJsx.length) {
            batsmanBowlerJsx.push(
                <div key={batsmanBowlerJsx.length} style={{ textAlign: 'center' }}>
                    <Button type="button" disabled={(!batsmanOnStrike || !batsmanOnNonStrike || !nextBowler) || (batsmanOnStrike === batsmanOnNonStrike)} label="Continue" onClick={() => continueMatch()} />
                </div>
            );
        }
        return batsmanBowlerJsx;
    }

    return (
        <div>
            <div className="rca-container">
                <div className="rca-column-12">
                    <div className="rca-medium-widget rca-padding min-ht-unset pad-top-10 rca-top-border">
                        {
                            (() => {
                                if (matchResult) {
                                    return (
                                        <div style={{ fontSize: '30px', padding: '10px', textAlign: 'center' }}>
                                            Match Ended
                                        </div>
                                    )
                                } else if (((totalOvers < totalOversPerInning) || innings[currentInningIndex].status === YET_TO_START) && (totalWickets !== totalPlayersPerSide - 1)) {
                                    return (
                                        <>
                                            <ChooseBatsmanAndBowler></ChooseBatsmanAndBowler>
                                            <CurrentBallDetails></CurrentBallDetails>
                                        </>
                                    )
                                } else if (!matchResult) {
                                    return (
                                        <>
                                            <div style={{ textAlign: 'center' }}>
                                                <Button type="button" label="Start Next Inning" onClick={() => startNextInning()} />
                                            </div>
                                        </>
                                    )
                                }
                            })()
                        }
                    </div>
                </div >
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        totalPlayersPerSide: getTotalPlayersPerSide(state.match),
        innings: state.match.innings,
        currentInningIndex: state.match.currentInningIndex,
        batsmenYetToBatOrRetdHurt: getYetToBatOrRetdHurtBatsmen(state.match),
        batsmenNotOut: getNotOutBatsmen(state.match),
        strikerBatsman: getStrikerBatsman(state.match),
        nonStrikerBatsman: getNonStrikerBatsman(state.match),
        nextPossibleBowlers: getNextPossibleBowlers(state.match),
        currentBowler: getCurrentBowler(state.match),
        totalWickets: getTotalWickets(state.match),
        lastBall: getLastBall(state.match),
        currentOver: getCurrentOver(state.match),
        bowlingTeamPlayers: getBowlingTeamPlayers(state.match),
        totalOvers: getTotalOversCount(state.match),
        totalOversPerInning: getTotalOversPerInning(state.match),
        matchResult: state.match.details.result
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateInnings: (innings) => dispatch(updateInnings(innings)),
        startNextInning: () => dispatch(startNextInning()),
        setMatchResult: (matchResult) => dispatch(setMatchResult(matchResult))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(UpdateScore);
