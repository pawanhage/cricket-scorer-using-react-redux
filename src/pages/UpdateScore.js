import React, { useState } from 'react'
import { Card } from 'primereact/card';
import { connect } from 'react-redux';
import { batsmenNotOut, batsmenYetToBatOrRetdHurt, currentBowlerName, nextPossibleBowlers, nonStrikerBatsmanDetails, strikerBatsmanDetails, totalPlayersInEachTeam, totalWickets, updateInnings } from '../redux';
import { Dropdown } from 'primereact/dropdown';
import { RadioButton } from 'primereact/radiobutton';
import { NOT_OUT_ON_NON_STRIKE, NOT_OUT_ON_STRIKE } from '../constants';
import { Button } from 'primereact/button';

function UpdateScore({
    totalPlayersInEachTeam,
    batsmenYetToBatOrRetdHurt,
    strikerBatsmanDetails,
    nonStrikerBatsmanDetails,
    batsmenNotOut,
    nextPossibleBowlers,
    currentBowlerName,
    totalWickets,
    currentInning,
    innings,
    updateInnings
}) {

    const [batsmanOnStrike, setBatsmanOnStrike] = useState(strikerBatsmanDetails);

    const [batsmanOnNonStrike, setBatsmanOnNonStrike] = useState(nonStrikerBatsmanDetails);
    const [currentBowler, setCurrentBowler] = useState(currentBowlerName);
    const [nextBatsman, setNextBatsman] = useState(null);

    let batsmenYetToBatOrRetdHurtOptions = batsmenYetToBatOrRetdHurt.map((batsman) => {
        return { name: batsman.name, value: batsman }
    });

    let batsmenNotOutOptions = batsmenNotOut.map((batsman) => {
        return { name: batsman.name, value: batsman }
    });

    let nextPossibleBowlersOptions = nextPossibleBowlers.map((bowler) => {
        return { name: bowler.name, value: bowler }
    });

    const startMatch = () => {
        let index = innings[currentInning].batsmen.findIndex((batsman) => batsman.name === batsmanOnStrike.name);
        if (index > -1) {
            innings[currentInning].batsmen[index] = {
                ...innings[currentInning].batsmen[index],
                status: NOT_OUT_ON_STRIKE
            }
        }

        index = innings[currentInning].batsmen.findIndex((batsman) => batsman.name === batsmanOnNonStrike.name);
        if (index > -1) {
            innings[currentInning].batsmen[index] = {
                ...innings[currentInning].batsmen[index],
                status: NOT_OUT_ON_NON_STRIKE
            }
        }

        index = innings[currentInning].bowlers.findIndex((bowler) => bowler.name === currentBowler.name);
        if (index > -1) {
            innings[currentInning].overs.push({
                details: [],
                bowlerName: currentBowler.name
            });
        }

        updateInnings(innings);
    }

    const ChooseBatsman = () => {
        if (batsmenYetToBatOrRetdHurt.length === totalPlayersInEachTeam) {
            return (
                <Card subTitle="Choose Batsman">
                    {/* Choose New Batsmen */}
                    <div>
                        <span className="marg-10" >On Strike End</span>
                        <Dropdown optionLabel="name" value={batsmanOnStrike} options={batsmenYetToBatOrRetdHurtOptions} onChange={(e) => setBatsmanOnStrike(e.value)} placeholder="Select" />
                    </div>
                    <div>
                        <span className="marg-10" >On Non Strike End</span>
                        <Dropdown optionLabel="name" value={batsmanOnNonStrike} options={batsmenYetToBatOrRetdHurtOptions} onChange={(e) => setBatsmanOnNonStrike(e.value)} placeholder="Select" />
                    </div>
                </Card>
            )
        } else if (totalWickets < totalPlayersInEachTeam - 1) {
            return (
                <Card subTitle="Choose Batsman">
                    {/* Choose Batsman after wicket gone */}
                    <div>
                        <span>Current Batsman</span>
                        <Dropdown optionLabel="name" value={batsmenNotOut[0].name} options={batsmenNotOutOptions} onChange={(e) => setBatsmanOnStrike(e.value)} placeholder="Select" />
                        <div className="p-field-radiobutton">
                            <RadioButton inputId="striker1" name="striker1" onChange={(e) => setBatsmanOnStrike(batsmenNotOut[0].name)} />
                            <label htmlFor="striker1">Striker</label>
                        </div>
                    </div>
                    <div>
                        <span>Next Batsman</span>
                        <Dropdown optionLabel="name" options={batsmenYetToBatOrRetdHurtOptions} onChange={(e) => setNextBatsman(e.value)} placeholder="Select" />
                        <div className="p-field-radiobutton">
                            <RadioButton inputId="striker2" name="striker2" onChange={(e) => setBatsmanOnStrike(nextBatsman)} />
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
        return (
            <Card subTitle="Choose Bowler">
                {/* Choose Bowler after over */}
                <Dropdown optionLabel="name" value={currentBowler} options={nextPossibleBowlersOptions} onChange={(e) => setCurrentBowler(e.value)} placeholder="Select" />
            </Card>
        )
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
                            <Button type="button" label="Start Match" className="p-mt-5" onClick={() => startMatch()} />
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        totalPlayersInEachTeam: totalPlayersInEachTeam(state.match),
        innings: state.match.innings,
        currentInning: state.match.currentInning,
        batsmenYetToBatOrRetdHurt: batsmenYetToBatOrRetdHurt(state.match),
        batsmenNotOut: batsmenNotOut(state.match),
        strikerBatsmanDetails: strikerBatsmanDetails(state.match),
        nonStrikerBatsmanDetails: nonStrikerBatsmanDetails(state.match),
        nextPossibleBowlers: nextPossibleBowlers(state.match),
        currentBowlerName: currentBowlerName(state.match),
        totalWickets: totalWickets(state.match),
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateInnings: (innings) => dispatch(updateInnings(innings))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(UpdateScore);
