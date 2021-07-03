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
    getBowlingTeamPlayers
} from '../redux';
import { Dropdown } from 'primereact/dropdown';
import { RadioButton } from 'primereact/radiobutton';
import {
    BOWLED,
    BYES,
    CAUGHT_BY,
    COMPLETE,
    extrasOptions,
    HIT_WICKET,
    IN_PROGRESS,
    LBW,
    LEG_BYES,
    NOT_OUT_ON_NON_STRIKE,
    NOT_OUT_ON_STRIKE,
    NO_BALL,
    NO_BALL_OFF_BAT,
    PENALTY_RUNS,
    runsOptions,
    STUMPED,
    WICKET,
    wicketOptions,
    WIDE
} from '../constants';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { getUpdatedBatsmanStatus, isContinueButtonDisabledForCurrentBall } from '../utils/cricketUtils';
import { cloneDeep } from '../utils/common';
import CurrentScore from './CurrentScore';
import WicketDetails from './WicketDetails';

const initialWicketDetailsState = {
    _wicketType: null,
    _whoOut: null,
    _outByPlayer: null
}

const wicketDetailsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_WICKET_TYPE':
            return { ...state, _wicketType: action.payload };
        case 'SET_WHO_OUT':
            return { ...state, _whoOut: action.payload };
        case 'SET_OUT_BY_PLAYER':
            return { ...state, _outByPlayer: action.payload };
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
    updateInnings
}) {

    const [_batsmanOnStrike, setBatsmanOnStrike] = useState(strikerBatsman ? strikerBatsman.name : '');
    const [_batsmanOnNonStrike, setBatsmanOnNonStrike] = useState(nonStrikerBatsman ? nonStrikerBatsman.name : '');
    const [_nextBowler, setCurrentBowler] = useState(null);
    const [_nextBatsman, setNextBatsman] = useState(null);

    const [_runsOptions, setRunsOptions] = useState(runsOptions);
    const [_extrasOptions, setExtraOptions] = useState(extrasOptions);
    const [_wicketOptions, setWicketOptions] = useState(wicketOptions)

    const [_runs, setRuns] = useState(0);

    /* if runs are set and greater than 0, disable invalid wicket options */
    useEffect(() => {
        const newWicketOptions = cloneDeep(wicketOptions);
        if (_runs && _runs > 0) {
            newWicketOptions.map((wicket) => [BOWLED, LBW, CAUGHT_BY, HIT_WICKET, STUMPED].includes(wicket.value) ? wicket.disabled = true : wicket.disabled = false);
            _dispatchWicketDetails({ type: 'RESET_WICKET_DETAILS_STATE' });
        };
        setWicketOptions([...newWicketOptions]);
    }, [_runs]);

    const [extra, setExtra] = useState(null);
    /* if set penalty runs equal to 5 and disable other run options */
    useEffect(() => {
        const newRunsOptions = cloneDeep(runsOptions);
        if (extra && extra === PENALTY_RUNS) {
            newRunsOptions.map((run) => [0, 1, 2, 3, 4, 6].includes(run.value) ? run.disabled = true : run.disabled = false);
            _dispatchWicketDetails({ type: 'RESET_WICKET_DETAILS_STATE' });
            setRuns(5);
        }
        setRunsOptions([...newRunsOptions]);
    }, [extra]);

    const [_wicketDetailsState, _dispatchWicketDetails] = useReducer(wicketDetailsReducer, initialWicketDetailsState);

    /* if wicket is set and disable other invalid extra option options */
    useEffect(() => {
        const newExtrasOptions = cloneDeep(extrasOptions);
        if (_wicketDetailsState._wicketType) {
            if ([BOWLED, LBW, CAUGHT_BY].includes(_wicketDetailsState._wicketType)) {
                newExtrasOptions.map((extra) => extra.disabled = true);
                setExtra(null);
            } else if (_wicketDetailsState._wicketType === STUMPED) {
                newExtrasOptions.map((extra) => (extra.value !== WIDE) ? extra.disabled = true : extra.disabled = false);
                if ([LEG_BYES, BYES, PENALTY_RUNS, NO_BALL, NO_BALL_OFF_BAT].includes(extra)) {
                    setExtra(null);
                }
            }
        }
        setExtraOptions([...newExtrasOptions]);
    }, [_wicketDetailsState._wicketType, extra]);

    const _batsmenYetToBatOrRetdHurtOptions = batsmenYetToBatOrRetdHurt.map((batsman) => {
        return { name: batsman.name, value: batsman.name }
    });

    const _batsmenNotOutOptions = batsmenNotOut.map((batsman) => {
        return { name: batsman.name, value: batsman.name }
    });

    const _nextPossibleBowlersOptions = nextPossibleBowlers.map((bowler) => {
        return { name: bowler.name, value: bowler.name }
    });

    const _bowlingTeamPlayersOptions = bowlingTeamPlayers.map((player) => {
        return { name: player, value: player }
    });

    const _currentBatsmanOptions = [_batsmanOnStrike, _batsmanOnNonStrike].map((player) => {
        return { name: player, value: player }
    });

    const CurrentBallDetails = () => {
        if (currentBowler && totalWickets !== totalPlayersPerSide && currentOver.status === IN_PROGRESS && !lastBall.includes(WICKET)) {
            return (
                <div className="marg-bottom-10" >
                    <div>
                        <div className="marg-top-right-bottom-10">Runs</div>
                        <div>
                            <Dropdown style={{ width: "75%" }} optionLabel="label" value={_runs} options={_runsOptions} onChange={(e) => setRuns(e.value)} placeholder="Select" />
                            <InputNumber disabled={extra === PENALTY_RUNS} className="marg-left-10" value={_runs} onValueChange={(e) => setRuns(e.value)} mode="decimal" min={0} max={100} />
                        </div>
                        <div className="marg-top-right-bottom-10">Extras</div>
                        <div >
                            <Dropdown style={{ width: "100%" }} optionLabel="label" value={extra} options={_extrasOptions} onChange={(e) => setExtra(e.value)} placeholder="Select" />
                        </div>
                        <div className="marg-top-right-bottom-10">Wicket</div>
                        <div>
                            <Dropdown style={{ width: "100%" }} optionLabel="label" value={_wicketDetailsState._wicketType} options={_wicketOptions} onChange={(e) => _dispatchWicketDetails({ type: 'SET_WICKET_TYPE', payload: e.value })} placeholder="Select" />
                        </div>
                        <WicketDetailsContext.Provider value={{ wicketDetails: _wicketDetailsState, dispatchWicketDetails: _dispatchWicketDetails, currentBatsmanOptions: _currentBatsmanOptions, bowlingTeamPlayersOptions: _bowlingTeamPlayersOptions }}>
                            <WicketDetails></WicketDetails>
                        </WicketDetailsContext.Provider>
                    </div>
                </div>
            )
        }
        return <></>;
    }

    const _continueMatch = () => {
        if (lastBall !== WICKET) {
            let index = innings[currentInningIndex].batsmen.findIndex((batsman) => batsman.name === _batsmanOnStrike);
            if (index > -1) {
                innings[currentInningIndex].batsmen[index] = {
                    ...getUpdatedBatsmanStatus(innings[currentInningIndex].batsmen[index], NOT_OUT_ON_STRIKE)
                }
            }

            index = innings[currentInningIndex].batsmen.findIndex((batsman) => batsman.name === _batsmanOnNonStrike);
            if (index > -1) {
                innings[currentInningIndex].batsmen[index] = {
                    ...getUpdatedBatsmanStatus(innings[currentInningIndex].batsmen[index], NOT_OUT_ON_NON_STRIKE)
                }
            }
        }

        if (!currentOver) {
            let index = innings[currentInningIndex].bowlers.findIndex((bowler) => bowler.name === _nextBowler);
            if (index > -1) {
                innings[currentInningIndex].overs.push({
                    details: [],
                    bowlerName: _nextBowler,
                    status: IN_PROGRESS
                });
            }
        }

        updateInnings(innings);
    }

    const ChooseBatsman = () => {
        if (batsmenYetToBatOrRetdHurt.length === totalPlayersPerSide) {
            return (
                <div className="marg-bottom-10" >
                    {/* Choose New Batsmen */}
                    <div className="marg-top-right-bottom-10" >On Strike End</div>
                    <Dropdown style={{ width: "100%" }} optionLabel="name" value={_batsmanOnStrike} options={_batsmenYetToBatOrRetdHurtOptions} onChange={(e) => setBatsmanOnStrike(e.value)} placeholder="Select" />
                    <div className="marg-top-right-bottom-10" >On Non Strike End</div>
                    <Dropdown style={{ width: "100%" }} optionLabel="name" value={_batsmanOnNonStrike} options={_batsmenYetToBatOrRetdHurtOptions} onChange={(e) => setBatsmanOnNonStrike(e.value)} placeholder="Select" />
                </div>
            )
        } else if (totalWickets < totalPlayersPerSide - 1 && lastBall === WICKET) {
            return (
                <div className="marg-bottom-10" >
                    {/* Choose Batsman after wicket gone */}
                    <div className="marg-top-right-bottom-10">Current Batsman</div>
                    <Dropdown style={{ width: "100%" }} optionLabel="name" value={batsmenNotOut[0].name} options={_batsmenNotOutOptions} onChange={(e) => setBatsmanOnStrike(e.value)} placeholder="Select" />
                    <div className="p-field-radiobutton">
                        <RadioButton inputId="striker1" name="striker1" onChange={(e) => setBatsmanOnStrike(batsmenNotOut[0].name)} />
                        <label htmlFor="striker1">Striker</label>
                    </div>
                    <div className="marg-top-right-bottom-10">Next Batsman</div>
                    <Dropdown style={{ width: "100%" }} optionLabel="name" options={_batsmenYetToBatOrRetdHurtOptions} onChange={(e) => setNextBatsman(e.value)} placeholder="Select" />
                    <div className="p-field-radiobutton">
                        <RadioButton inputId="striker2" name="striker2" onChange={(e) => setBatsmanOnStrike(_nextBatsman)} />
                        <label htmlFor="striker2">Striker</label>
                    </div>
                </div>
            )
        } else {
            return <></>
        }
    }

    const ChooseCurrentBowler = () => {
        if (!currentBowler || currentOver.status === COMPLETE) {
            return (
                <div className="marg-bottom-10" >
                    <div className="marg-top-right-bottom-10">Choose Bowler</div>
                    <Dropdown style={{ width: "100%" }} optionLabel="name" value={_nextBowler} options={_nextPossibleBowlersOptions} onChange={(e) => setCurrentBowler(e.value)} placeholder="Select" />
                </div>
            )
        }
        return <></>;
    }

    return (
        <div>
            <div className="rca-container">
                <div className="rca-row">
                    <div className="rca-column-6">
                        <div className="rca-medium-widget rca-padding rca-top-border">
                            <CurrentScore></CurrentScore>
                        </div>
                    </div>
                </div>
                <div className="rca-column-6">
                    <div className="rca-medium-widget rca-padding rca-top-border">
                        <ChooseBatsman></ChooseBatsman>
                        <ChooseCurrentBowler></ChooseCurrentBowler>
                        <CurrentBallDetails></CurrentBallDetails>
                        {(() => {
                            if (currentOver && currentOver.status === IN_PROGRESS && !lastBall.includes(WICKET)) {
                                return (
                                    <div style={{ "textAlignLast": "center" }}>
                                        <Button style={{ "marginRight": "10px" }} type="button" label="Reset Ball" onClick={() => _continueMatch()} />
                                        <Button type="button" disabled={isContinueButtonDisabledForCurrentBall(_runs, extra, _wicketDetailsState._wicketType, _wicketDetailsState._whoOut, _wicketDetailsState._outByPlayer)} label="Save Ball" onClick={() => _continueMatch()} />
                                    </div>
                                )
                            } else {
                                return (
                                    <div className="display-grid ">
                                        <Button type="button" disabled={!_batsmanOnStrike || !_batsmanOnNonStrike || !_nextBowler} label="Continue" onClick={() => _continueMatch()} />
                                    </div>
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
        bowlingTeamPlayers: getBowlingTeamPlayers(state.match)
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateInnings: (innings) => dispatch(updateInnings(innings))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(UpdateScore);
