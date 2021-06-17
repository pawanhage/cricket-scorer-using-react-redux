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
import { IN_PROGRESS, NOT_OUT_ON_NON_STRIKE, NOT_OUT_ON_STRIKE, WICKET } from '../constants';
import { Button } from 'primereact/button';

function UpdateScore({
    totalPlayersPerSide,
    batsmenYetToBatOrRetdHurt,
    strikerBatsmanDetails,
    nonStrikerBatsmanDetails,
    batsmenNotOut,
    nextPossibleBowlers,
    currentBowlerName,
    totalWickets,
    currentInning,
    innings,
    lastBall,
    currentOver,
    updateInnings
}) {

    const [_batsmanOnStrike, setBatsmanOnStrike] = useState(strikerBatsmanDetails);
    const [_batsmanOnNonStrike, setBatsmanOnNonStrike] = useState(nonStrikerBatsmanDetails);
    const [_nextBowler, setCurrentBowler] = useState(null);
    const [_nextBatsman, setNextBatsman] = useState(null);

    let _batsmenYetToBatOrRetdHurtOptions = batsmenYetToBatOrRetdHurt.map((batsman) => {
        return { name: batsman.name, value: batsman }
    });

    let _batsmenNotOutOptions = batsmenNotOut.map((batsman) => {
        return { name: batsman.name, value: batsman }
    });

    let _nextPossibleBowlersOptions = nextPossibleBowlers.map((bowler) => {
        return { name: bowler.name, value: bowler }
    });

    const _startMatch = () => {
        if (lastBall !== WICKET) {
            let index = innings[currentInning].batsmen.findIndex((batsman) => batsman.name === _batsmanOnStrike.name);
            if (index > -1) {
                innings[currentInning].batsmen[index] = {
                    ...innings[currentInning].batsmen[index],
                    status: NOT_OUT_ON_STRIKE
                }
            }

            index = innings[currentInning].batsmen.findIndex((batsman) => batsman.name === _batsmanOnNonStrike.name);
            if (index > -1) {
                innings[currentInning].batsmen[index] = {
                    ...innings[currentInning].batsmen[index],
                    status: NOT_OUT_ON_NON_STRIKE
                }
            }
        }

        if (!currentOver) {
            let index = innings[currentInning].bowlers.findIndex((bowler) => bowler.name === _nextBowler.name);
            if (index > -1) {
                innings[currentInning].overs.push({
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
                    <div>
                        <span className="marg-10" >On Strike End</span>
                        <Dropdown optionLabel="name" value={_batsmanOnStrike} options={_batsmenYetToBatOrRetdHurtOptions} onChange={(e) => setBatsmanOnStrike(e.value)} placeholder="Select" />
                    </div>
                    <div>
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
        if (!currentBowlerName) {
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
                        <div className="p-fluid">
                            <Button type="button" label="Start Match" className="p-mt-5" onClick={() => _startMatch()} />
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
        currentInning: state.match.currentInning,
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
