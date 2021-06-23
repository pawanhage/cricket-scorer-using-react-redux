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
    getCurrentOver
} from '../redux';
import { Dropdown } from 'primereact/dropdown';
import { RadioButton } from 'primereact/radiobutton';
import { CAUGHT_BY, COMPLETE, IN_PROGRESS, NOT_OUT_ON_NON_STRIKE, NOT_OUT_ON_STRIKE, RUN_OUT, STUMPED, WICKET } from '../constants';
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
    updateInnings
}) {

    const [_batsmanOnStrike, setBatsmanOnStrike] = useState(strikerBatsmanDetails);
    const [_batsmanOnNonStrike, setBatsmanOnNonStrike] = useState(nonStrikerBatsmanDetails);
    const [_nextBowler, setCurrentBowler] = useState(null);
    const [_nextBatsman, setNextBatsman] = useState(null);

    const [runs, setRuns] = useState(0);
    const [wicketType, setWicketType] = useState(null);
    const [runOutBy, setRunOutBy] = useState(null);
    const [caughtBy, setCaughtBy] = useState(null);
    const [stumpedBy, setStumpedBy] = useState(null);

    const _batsmenYetToBatOrRetdHurtOptions = batsmenYetToBatOrRetdHurt.map((batsman) => {
        return { name: batsman.name, value: batsman }
    });

    const _batsmenNotOutOptions = batsmenNotOut.map((batsman) => {
        return { name: batsman.name, value: batsman }
    });

    const _nextPossibleBowlersOptions = nextPossibleBowlers.map((bowler) => {
        return { name: bowler.name, value: bowler }
    });

    const ballOptions = [
        { label: '0', value: 0 },
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5', value: 5 },
        { label: '6', value: 6 }
    ];

    const wicketBy = () => {
        if (wicketType === RUN_OUT) {
            return (
                <>
                    <span className="marg-10" >Run Out By</span>
                    <Dropdown optionLabel="name" value={runOutBy} options={ } onChange={(e) => setBatsmanOnStrike(e.value)} placeholder="Select" />
                </>
            )
        } else if (wicketType === CAUGHT_BY) {
            return (
                <>
                    <span className="marg-10" >Caught By</span>
                    <Dropdown optionLabel="name" value={_batsmanOnStrike} options={_batsmenYetToBatOrRetdHurtOptions} onChange={(e) => setBatsmanOnStrike(e.value)} placeholder="Select" />
                </>
            )
        } else if (wicketType === STUMPED) {
            return (
                <>
                    <span className="marg-10" >Stumped By</span>
                    <Dropdown optionLabel="name" value={_batsmanOnStrike} options={_batsmenYetToBatOrRetdHurtOptions} onChange={(e) => setBatsmanOnStrike(e.value)} placeholder="Select" />
                </>
            )
        }
    }

    const CurrentBallDetails = () => {
        if (currentBowlerName && totalWickets !== totalPlayersPerSide && currentOver.status === IN_PROGRESS && !lastBall.includes(WICKET)) {
            return (
                <Card subTitle="Next Ball">
                    <div>
                        <SelectButton className="displayInline" value={runs} onChange={(e) => setRuns(e.value)} options={ballOptions} />
                        <InputNumber className="marg-left-10 wdh-1" value={runs} onValueChange={(e) => setRuns(e.value)} mode="decimal" min={0} max={100} />
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
        currentOver: getCurrentOver(state.match)
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateInnings: (innings) => dispatch(updateInnings(innings))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(UpdateScore);
