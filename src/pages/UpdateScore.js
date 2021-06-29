import React, { useState, useEffect } from 'react'
import { Card } from 'primereact/card';
import { connect } from 'react-redux';
import {
    getNotOutBatsmen,
    getYetToBatOrRetdHurtBatsmen,
    getCurrentBowler,
    getNextPossibleBowlers,
    getNonStrikerBatsman,
    getstrikerBatsman,
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
    runsOptions,
    RUN_OUT,
    STUMPED,
    WICKET,
    wicketOptions,
    WIDE
} from '../constants';
import { Button } from 'primereact/button';
import { SelectButton } from 'primereact/selectbutton';
import { InputNumber } from 'primereact/inputnumber';
import { getUpdatedBatsmanStatus, isContinueButtonDisabledForCurrentBall } from '../utils/cricketUtils';
import { cloneDeep } from '../utils/common';

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

    const [_batsmanOnStrike, setBatsmanOnStrike] = useState(strikerBatsman);
    const [_batsmanOnNonStrike, setBatsmanOnNonStrike] = useState(nonStrikerBatsman);
    const [_nextBowler, setCurrentBowler] = useState(null);
    const [_nextBatsman, setNextBatsman] = useState(null);

    const [_runsOptions, setRunsOptions] = useState(runsOptions);
    const [_extrasOptions, setExtraOptions] = useState(extrasOptions);
    const [_wicketOptions, setWicketOptions] = useState(wicketOptions)

    const [runs, setRuns] = useState(0);

    /* if runs are set and greater than 0, disable invalid wicket options */
    useEffect(() => {
        const newWicketOptions = cloneDeep(wicketOptions);
        if (runs && runs > 0) {
            newWicketOptions.map((wicket) => [BOWLED, LBW, CAUGHT_BY, HIT_WICKET, STUMPED].includes(wicket.value) ? wicket.disabled = true : wicket.disabled = false);
            setWicketType(null);
        }
        setWicketOptions([...newWicketOptions]);
    }, [runs]);

    const [extra, setExtra] = useState(null);
    /* if set penalty runs equal to 5 and disable other run options */
    useEffect(() => {
        const newRunsOptions = cloneDeep(runsOptions);
        if (extra && extra === PENALTY_RUNS) {
            newRunsOptions.map((run) => [0, 1, 2, 3, 4, 6].includes(run.value) ? run.disabled = true : run.disabled = false);
            setWicketType(null);
            setRuns(5);
        }
        setRunsOptions([...newRunsOptions]);
    }, [extra]);

    const [wicketType, setWicketType] = useState(null);
    /* if wicket is set and disable other invalid extra option options */
    useEffect(() => {
        const newExtrasOptions = cloneDeep(extrasOptions);
        if (wicketType) {
            if ([BOWLED, LBW, CAUGHT_BY].includes(wicketType)) {
                newExtrasOptions.map((extra) => extra.disabled = true);
                setExtra(null);
            } else if (wicketType === STUMPED) {
                newExtrasOptions.map((extra) => (extra.value !== WIDE) ? extra.disabled = true : extra.disabled = false);
                if ([LEG_BYES, BYES, PENALTY_RUNS, NO_BALL, NO_BALL_OFF_BAT].includes(extra)) {
                    setExtra(null);
                }
            }
        }
        setExtraOptions([...newExtrasOptions]);
    }, [wicketType, extra]);

    const [whoOut, setWhoOut] = useState(null);
    const [runOutBy, setRunOutBy] = useState(null);
    const [caughtBy, setCaughtBy] = useState(null);
    const [stumpedBy, setStumpedBy] = useState(null);

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

    const WicketDetails = () => {
        return (
            <>
                {(() => {
                    if (wicketType === RUN_OUT) {
                        return (
                            <>
                                <div className="textGroup displayInlineTable">
                                    <div className="label">Who Out</div>
                                    <div className="field">
                                        <Dropdown optionLabel="name" value={whoOut} options={_currentBatsmanOptions} onChange={(e) => setWhoOut(e.value)} placeholder="Select" />
                                    </div>
                                </div>
                                <div className="textGroup displayInlineTable">
                                    <div className="label">Run Out By</div>
                                    <div className="field">
                                        <Dropdown optionLabel="name" value={runOutBy} options={_bowlingTeamPlayersOptions} onChange={(e) => setRunOutBy(e.value)} placeholder="Select" />
                                    </div>
                                </div>
                            </>
                        )
                    } else if (wicketType === CAUGHT_BY) {
                        return (
                            <>
                                <div className="textGroup">
                                    <div className="label">Caught By</div>
                                    <div className="field">
                                        <Dropdown optionLabel="name" value={caughtBy} options={_bowlingTeamPlayersOptions} onChange={(e) => setCaughtBy(e.value)} placeholder="Select" />
                                    </div>
                                </div>
                            </>
                        )
                    } else if (wicketType === STUMPED) {
                        return (
                            <>
                                <div className="textGroup">
                                    <div className="label">Stumped By</div>
                                    <div className="field">
                                        <Dropdown optionLabel="name" value={stumpedBy} options={_bowlingTeamPlayersOptions.filter((e) => e.name !== currentBowler)} onChange={(e) => setStumpedBy(e.value)} placeholder="Select" />
                                    </div>
                                </div>
                            </>
                        )
                    } else if (wicketType === FIELD_OBSTRUCT) {
                        return (
                            <>
                                <div className="textGroup displayInlineTable">
                                    <div className="label">Who Out</div>
                                    <div className="field">
                                        <Dropdown optionLabel="name" value={whoOut} options={_currentBatsmanOptions} onChange={(e) => setWhoOut(e.value)} placeholder="Select" />
                                    </div>
                                </div>
                            </>
                        )
                    }
                    return <></>;
                })()}
            </>
        );
    }

    const CurrentBallDetails = () => {
        if (currentBowler && totalWickets !== totalPlayersPerSide && currentOver.status === IN_PROGRESS && !lastBall.includes(WICKET)) {
            return (
                <div className="marg-bottom-10" >
                    <Card subTitle="Next Ball">
                        <div className="textGroups textGroups--table">
                            <div className="textGroup">
                                <div className="label">Runs</div>
                                <div className="field">
                                    <SelectButton className="display-inline-flex" value={runs} onChange={(e) => setRuns(e.value)} options={_runsOptions} />
                                    <InputNumber disabled={extra === PENALTY_RUNS} className="marg-left-10 wdh-1" value={runs} onValueChange={(e) => setRuns(e.value)} mode="decimal" min={0} max={100} />
                                </div>
                            </div>
                            <div className="textGroup">
                                <div className="label">Extras</div>
                                <div className="field">
                                    <SelectButton className="display-inline-flex" value={extra} onChange={(e) => setExtra(e.value)} options={_extrasOptions} />
                                </div>
                            </div>
                            <div className="textGroup">
                                <div className="label">Wicket</div>
                                <div className="field">
                                    <SelectButton className="display-inline-flex" value={wicketType} onChange={(e) => setWicketType(e.value)} options={_wicketOptions} />
                                </div>
                            </div>
                            <WicketDetails></WicketDetails>
                        </div>
                    </Card >
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
                    <Card subTitle="Choose Batsman">
                        {/* Choose New Batsmen */}
                        <div className="marg-10">
                            <span className="marg-10" >On Strike End</span>
                            <Dropdown optionLabel="name" value={_batsmanOnStrike} options={_batsmenYetToBatOrRetdHurtOptions} onChange={(e) => setBatsmanOnStrike(e.value)} placeholder="Select" />
                            <span className="marg-10" >On Non Strike End</span>
                            <Dropdown optionLabel="name" value={_batsmanOnNonStrike} options={_batsmenYetToBatOrRetdHurtOptions} onChange={(e) => setBatsmanOnNonStrike(e.value)} placeholder="Select" />
                        </div>
                    </Card>
                </div>
            )
        } else if (totalWickets < totalPlayersPerSide - 1 && lastBall === WICKET) {
            return (
                <div className="marg-bottom-10" >
                    <Card subTitle="Choose Batsman">
                        {/* Choose Batsman after wicket gone */}
                        <div>
                            <span>Current Batsman</span>
                            <Dropdown optionLabel="name" value={batsmenNotOut[0].name} options={_batsmenNotOutOptions} onChange={(e) => setBatsmanOnStrike(e.value)} placeholder="Select" />
                            <div className="p-field-radiobutton">
                                <RadioButton inputId="striker1" name="striker1" onChange={(e) => setBatsmanOnStrike(batsmenNotOut[0].name)} />
                                <label htmlFor="striker1">Striker</label>
                            </div>
                        </div>
                        <div>
                            <span>Next Batsman</span>
                            <Dropdown optionLabel="name" options={_batsmenYetToBatOrRetdHurtOptions} onChange={(e) => setNextBatsman(e.value)} placeholder="Select" />
                            <div className="p-field-radiobutton">
                                <RadioButton inputId="striker2" name="striker2" onChange={(e) => setBatsmanOnStrike(_nextBatsman)} />
                                <label htmlFor="striker2">Striker</label>
                            </div>
                        </div>
                    </Card>
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
                    <Card subTitle="Choose Bowler">
                        {/* Choose Bowler after over */}
                        <Dropdown optionLabel="name" value={_nextBowler} options={_nextPossibleBowlersOptions} onChange={(e) => setCurrentBowler(e.value)} placeholder="Select" />
                    </Card>
                </div>
            )
        }
        return <></>;
    }

    return (
        <div>
            <div className="p-grid nested-grid">
                <div className="p-col-8">
                    <div className="p-grid">
                        <div className="p-col-12">
                            12
                        </div>
                        <div className="p-col-12">
                            12
                        </div>
                    </div>
                </div>
                <div className="p-col-4">
                    <Card title="Update Score" subTitle="Ball by Ball Scoring">
                        {<ChooseBatsman></ChooseBatsman>}
                        {<ChooseCurrentBowler></ChooseCurrentBowler>}
                        <CurrentBallDetails></CurrentBallDetails>
                        <div className="display-grid">
                            {(() => {
                                if (currentOver && currentOver.status === IN_PROGRESS && !lastBall.includes(WICKET)) {
                                    return <Button type="button" disabled={isContinueButtonDisabledForCurrentBall(runs, extra, wicketType, whoOut, runOutBy, caughtBy, stumpedBy)} label="Save Ball" onClick={() => _continueMatch()} />
                                } else {
                                    return <Button type="button" disabled={!_batsmanOnStrike || !_batsmanOnNonStrike || !_nextBowler} label="Continue" onClick={() => _continueMatch()} />
                                }
                            })()
                            }
                        </div>
                    </Card>
                </div>
            </div>
        </div >
    )
}

const mapStateToProps = (state) => {
    return {
        totalPlayersPerSide: getTotalPlayersPerSide(state.match),
        innings: state.match.innings,
        currentInningIndex: state.match.currentInningIndex,
        batsmenYetToBatOrRetdHurt: getYetToBatOrRetdHurtBatsmen(state.match),
        batsmenNotOut: getNotOutBatsmen(state.match),
        strikerBatsman: getstrikerBatsman(state.match),
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
