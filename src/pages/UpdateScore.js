import React, { useState } from 'react'
import { Card } from 'primereact/card';
import { connect } from 'react-redux';
import {
    getNotOutBatsmen,
    getYetToBatOrRetdHurtBatsmen,
    getCurrentBowlerName,
    getNextPossibleBowlers,
    getNonStrikerBatsmanDetails,
    getStrikerBatsmanDetails,
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
    CAUGHT_BY,
    COMPLETE,
    extrasOptions,
    FIELD_OBSTRUCT,
    IN_PROGRESS,
    NOT_OUT_ON_NON_STRIKE,
    NOT_OUT_ON_STRIKE,
    runsOptions,
    RUN_OUT,
    STUMPED,
    WICKET,
    wicketOptions
} from '../constants';
import { Button } from 'primereact/button';
import { SelectButton } from 'primereact/selectbutton';
import { InputNumber } from 'primereact/inputnumber';
import { getUpdatedBatsmanStatus } from '../utils/cricketUtils';

function UpdateScore({
    totalPlayersPerSide,
    batsmenYetToBatOrRetdHurt,
    strikerBatsmanDetails,
    nonStrikerBatsmanDetails,
    batsmenNotOut,
    nextPossibleBowlers,
    currentBowlerName,
    totalWickets,
    currentInningIndex,
    innings,
    lastBall,
    currentOver,
    bowlingTeamPlayers,
    updateInnings
}) {

    const [_batsmanOnStrike, setBatsmanOnStrike] = useState(strikerBatsmanDetails);
    const [_batsmanOnNonStrike, setBatsmanOnNonStrike] = useState(nonStrikerBatsmanDetails);
    const [_nextBowler, setCurrentBowler] = useState(null);
    const [_nextBatsman, setNextBatsman] = useState(null);

    const [runs, setRuns] = useState(0);
    const [extra, setExtra] = useState(null);

    const [wicketType, setWicketType] = useState(null);
    const [runOutBy, setRunOutBy] = useState(null);
    const [caughtBy, setCaughtBy] = useState(null);
    const [stumpedBy, setStumpedBy] = useState(null);
    const [outPlayer, setOutPlayer] = useState(null);

    const _batsmenYetToBatOrRetdHurtOptions = batsmenYetToBatOrRetdHurt.map((batsman) => {
        return { name: batsman.name, value: batsman }
    });

    const _batsmenNotOutOptions = batsmenNotOut.map((batsman) => {
        return { name: batsman.name, value: batsman }
    });

    const _nextPossibleBowlersOptions = nextPossibleBowlers.map((bowler) => {
        return { name: bowler.name, value: bowler }
    });

    const _bowlingTeamPlayersOptions = bowlingTeamPlayers.map((player) => {
        return { name: player, value: player }
    });

    const _currentBatsmanOptions = [_batsmanOnStrike, _batsmanOnNonStrike].map((player) => {
        return { name: player.name, value: player }
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
                                        <Dropdown optionLabel="name" value={stumpedBy} options={_currentBatsmanOptions} onChange={(e) => setOutPlayer(e.value)} placeholder="Select" />
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
                                        <Dropdown optionLabel="name" value={stumpedBy} options={_bowlingTeamPlayersOptions.filter((e) => e.name !== currentBowlerName)} onChange={(e) => setStumpedBy(e.value)} placeholder="Select" />
                                    </div>
                                </div>
                            </>
                        )
                    } else if (wicketType === FIELD_OBSTRUCT) {
                        return (
                            <>
                                <div className="textGroup">
                                    <div className="label">Who Out</div>
                                    <div className="field">
                                        <Dropdown optionLabel="name" value={outPlayer} options={_currentBatsmanOptions} onChange={(e) => setOutPlayer(e.value)} placeholder="Select" />
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
        if (currentBowlerName && totalWickets !== totalPlayersPerSide && currentOver.status === IN_PROGRESS && !lastBall.includes(WICKET)) {
            return (
                <Card subTitle="Next Ball">
                    <div className="textGroups textGroups--table">
                        <div className="textGroup">
                            <div className="label">Runs</div>
                            <div className="field">
                                <SelectButton className="display-inline-flex" value={runs} onChange={(e) => setRuns(e.value)} options={runsOptions} />
                                <InputNumber className="marg-left-10 wdh-1" value={runs} onValueChange={(e) => setRuns(e.value)} mode="decimal" min={0} max={100} />
                            </div>
                        </div>
                        <div className="textGroup">
                            <div className="label">Extras</div>
                            <div className="field">
                                <SelectButton className="display-inline-flex" value={extra} onChange={(e) => setExtra(e.value)} options={extrasOptions} />
                            </div>
                        </div>
                        <div className="textGroup">
                            <div className="label">Wicket</div>
                            <div className="field">
                                <SelectButton className="display-inline-flex" value={wicketType} onChange={(e) => setWicketType(e.value)} options={wicketOptions} />
                            </div>
                        </div>
                        <WicketDetails></WicketDetails>
                        <div>
                            <div className="textGroup displayInlineTable">
                                <div className="field">
                                    <Button label="Primary" className="p-button-outlined" />
                                </div>
                            </div>
                            <div className="textGroup displayInlineTable">
                                <div className="field">
                                    <Button label="Warning" className="p-button-outlined p-button-warning" />
                                </div>
                            </div>
                            <div className="textGroup displayInlineTable">
                                <div className="field">
                                    <Button label="Primary" className="p-button-outlined" />
                                </div>
                            </div>
                            <div className="textGroup displayInlineTable">
                                <div className="field">
                                    <Button label="Info" className="p-button-outlined p-button-info" />
                                </div>
                            </div>
                            <div className="textGroup displayInlineTable">
                                <div className="field">
                                    <Button label="Success" className="p-button-outlined p-button-success" />
                                </div>
                            </div>
                            <div className="textGroup displayInlineTable">
                                <div className="field">
                                    <Button label="Secondary" className="p-button-outlined p-button-secondary" />
                                </div>
                            </div>
                            <div className="textGroup displayInlineTable">
                                <div className="field displayInlineTable">
                                    <Button label="Danger" className="p-button-outlined p-button-danger" />
                                </div>
                            </div>
                            <div className="textGroup displayInlineTable">
                                <div className="field">
                                    <Button label="Help" className="p-button-outlined p-button-help" />
                                </div>
                            </div>
                        </div>
                    </div>
                </Card >
            )
        }
        return <></>;
    }

    const _continueMatch = () => {
        if (lastBall !== WICKET) {
            let index = innings[currentInningIndex].batsmen.findIndex((batsman) => batsman.name === _batsmanOnStrike.name);
            if (index > -1) {
                innings[currentInningIndex].batsmen[index] = {
                    ...getUpdatedBatsmanStatus(innings[currentInningIndex].batsmen[index], NOT_OUT_ON_STRIKE)
                }
            }

            index = innings[currentInningIndex].batsmen.findIndex((batsman) => batsman.name === _batsmanOnNonStrike.name);
            if (index > -1) {
                innings[currentInningIndex].batsmen[index] = {
                    ...getUpdatedBatsmanStatus(innings[currentInningIndex].batsmen[index], NOT_OUT_ON_NON_STRIKE)
                }
            }
        }

        if (!currentOver) {
            let index = innings[currentInningIndex].bowlers.findIndex((bowler) => bowler.name === _nextBowler.name);
            if (index > -1) {
                innings[currentInningIndex].overs.push({
                    details: [],
                    bowlerName: _nextBowler.name,
                    status: IN_PROGRESS
                });
            }
        }

        updateInnings(innings);
    }

    const ChooseBatsman = () => {
        if (batsmenYetToBatOrRetdHurt.length === totalPlayersPerSide) {
            return (
                <Card subTitle="Choose Batsman">
                    {/* Choose New Batsmen */}
                    <div className="marg-10">
                        <span className="marg-10" >On Strike End</span>
                        <Dropdown optionLabel="name" value={_batsmanOnStrike} options={_batsmenYetToBatOrRetdHurtOptions} onChange={(e) => setBatsmanOnStrike(e.value)} placeholder="Select" />
                        <span className="marg-10" >On Non Strike End</span>
                        <Dropdown optionLabel="name" value={_batsmanOnNonStrike} options={_batsmenYetToBatOrRetdHurtOptions} onChange={(e) => setBatsmanOnNonStrike(e.value)} placeholder="Select" />
                    </div>
                </Card>
            )
        } else if (totalWickets < totalPlayersPerSide - 1 && lastBall === WICKET) {
            return (
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
            )
        } else {
            return <></>
        }
    }

    const ChooseCurrentBowler = () => {
        if (!currentBowlerName || currentOver.status === COMPLETE) {
            return (
                <Card subTitle="Choose Bowler">
                    {/* Choose Bowler after over */}
                    <Dropdown optionLabel="name" value={_nextBowler} options={_nextPossibleBowlersOptions} onChange={(e) => setCurrentBowler(e.value)} placeholder="Select" />
                </Card>
            )
        }
        return <></>;
    }

    return (
        <div>
            <div className="p-grid nested-grid">
                <div className="p-col-6">
                    <div className="p-grid">
                        <div className="p-col-12">
                            12
                        </div>
                        <div className="p-col-12">
                            12
                        </div>
                    </div>
                </div>
                <div className="p-col-6">
                    <Card title="Update Score" subTitle="Ball by Ball Scoring">
                        <div className="marg-left-rigth-bottom-10" >
                            {<ChooseBatsman></ChooseBatsman>}
                        </div>
                        <div className="marg-10" >
                            {<ChooseCurrentBowler></ChooseCurrentBowler>}
                        </div>
                        <div className="marg-10" >
                            <CurrentBallDetails></CurrentBallDetails>
                        </div>
                        <div className="p-fluid">
                            <Button type="button" disabled={!_batsmanOnStrike || !_batsmanOnNonStrike || !_nextBowler} label="Continue" className="p-mt-5" onClick={() => _continueMatch()} />
                        </div>
                    </Card>
                </div>
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
        strikerBatsmanDetails: getStrikerBatsmanDetails(state.match),
        nonStrikerBatsmanDetails: getNonStrikerBatsmanDetails(state.match),
        nextPossibleBowlers: getNextPossibleBowlers(state.match),
        currentBowlerName: getCurrentBowlerName(state.match),
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
