import React, { useState } from 'react'
import { Card } from 'primereact/card';
import { connect } from 'react-redux';
import { batsmenYetToBatOrRetdHurt } from '../redux';
import { Dropdown } from 'primereact/dropdown';
import { RadioButton } from 'primereact/radiobutton';

function UpdateScore({
            firstTeamPlayers,
            secondTeamPlayers,
            innings,
            batsmenYetToBatOrRetdHurt,
            strikerBatsmanDetails,
            nonStrikerBatsmanDetails,
            batsmenYetToBatOrRetdHurtOrNotOut,
            batsmenNotOut,
            nextPossibleBowlers,
            currentBowlerName,
            wicketsGone
        }) {

    const [batsmanOnStrike, setBatsmanOnStrike] = useState(strikerBatsmanDetails);
    const [batsmanOnNonStrike, setBatsmanOnNonStrike] = useState(nonStrikerBatsmanDetails);
    const [currentBowler, setCurrentBowler] = useState(currentBowlerName);
    const [nextBatsman, setNextBatsman] = useState(null);

    let batsmenYetToBatOrRetdHurtOptions = [
        batsmenYetToBatOrRetdHurt.map(batsman => {
            return { label: batsman.name, value: batsman }
        })
    ];

    let batsmenNotOutOptions = [
        batsmenNotOut.map(batsman => {
            return { label: batsman.name, value: batsman }
        })
    ];

    let nextPossibleBowlersOptions = [
        nextPossibleBowlers.map(bowler => {
            return { label: bowler.name, value: bowler }
        })
    ];

    const ChooseBatsman = () => {
        if (batsmenYetToBatOrRetdHurt.length === firstTeamPlayers.length) {
            return (
                <Card subTitle="Choose Batsman">
                    {/* Choose New Batsmen */}
                    <div>
                        <span>Choose Batsman On Strike End</span>
                        <Dropdown optionLabel="name" value={batsmanOnStrike} options={batsmenYetToBatOrRetdHurtOptions} onChange={(e) => setBatsmanOnStrike(e.value)} placeholder="Select" />
                    </div>
                    <div>
                        <span>Choose Batsman On Non Strike End</span>
                        <Dropdown optionLabel="name" value={batsmanOnNonStrike} options={batsmenYetToBatOrRetdHurtOptions} onChange={(e) => setBatsmanOnNonStrike(e.value)} placeholder="Select" />
                    </div>
                </Card>
            )
        } else if (wicketsGone !== firstTeamPlayers.length - 1) {
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
                <Dropdown optionLabel="name" value={currentBowler} options={nextPossibleBowlersOptions} onChange={(e) => setCurrentBowler(e.value)} placeholder="Select a City" />
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
                        {ChooseBatsman}
                        {ChooseCurrentBowler}
                    </Card>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        firstTeamPlayers: state.match.details.firstTeamPlayers,
        secondTeamPlayers: state.match.details.secondTeamPlayers,
        innings: state.match.details.innnings,
        batsmenYetToBatOrRetdHurt: batsmenYetToBatOrRetdHurt(state.match),

    }
}

const mapDispatchToProps = (dispatch) => {
    return {

    }
}
export default connect(mapStateToProps, mapDispatchToProps)(UpdateScore);
