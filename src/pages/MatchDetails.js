import React, { useState } from 'react'
import { Chips } from 'primereact/chips'
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { insertMatchDetails } from '../redux';
import { connect } from 'react-redux';
import { useHistory } from "react-router-dom";

function MatchDetails({ insertMatchDetails }) {

    const [firstTeamName, setFirstTeamName] = useState('');
    const [secondTeamName, setSecondTeamName] = useState('');
    const [matchType, setMatchType] = useState('ODM');
    const [totalOversInOneInning, setTotalOvers] = useState(0);
    const [firstTeamPlayers, setFirstTeamPlayers] = useState([]);
    const [secondTeamPlayers, setSecondTeamPlayers] = useState([]);
    const [tossResult, setTossResult] = useState(null);
    let history = useHistory();

    let matchTypes = [
        { name: 'One Day Match', value: 'ODM' },
        { name: 'Test Match (Not Supported)', value: 'TM' }
    ];

    let oversOptions = Array.from(Array(50).keys()).map((i) => { return { name: i + 1, value: i + 1 } });

    let tossResultOptions = [
        { name: firstTeamName + ' won the toss and elected to bat first', value: 11 },
        { name: firstTeamName + ' won the toss and elected to bowl first', value: 10 },
        { name: secondTeamName + ' won the toss and elected to bat first', value: 21 },
        { name: secondTeamName + ' won the toss and elected to bowl first', value: 20 }
    ];

    const setMatchDetails = () => {
        insertMatchDetails({
            firstTeamName: firstTeamName,
            secondTeamName: secondTeamName,
            matchType: matchType,
            totalOversInOneInning: totalOversInOneInning,
            firstTeamPlayers: firstTeamPlayers,
            secondTeamPlayers: secondTeamPlayers,
            tossResult: tossResult
        });
        history.push('update-score');
    }

    return (
        <div>
            <div className="p-fluid p-formgrid p-grid">
                <div className="p-field p-col-12 p-md-6">
                    <label htmlFor="team1">First Team Name</label>
                    <InputText id="team1" type="text" placeholder="Enter team name" onChange={(e) => setFirstTeamName(e.target.value)} />
                </div>
                <div className="p-field p-col-12 p-md-6">
                    <label htmlFor="team2">Second Team Name</label>
                    <InputText id="team2" type="text" placeholder="Enter team name" onChange={(e) => setSecondTeamName(e.target.value)} />
                </div>
                <div className="p-field p-col-12 p-md-4">
                    <label htmlFor="matchType">Match Type</label>
                    <Dropdown inputId="matchType" value={matchType} options={matchTypes} onChange={(e) => setMatchType(e.value)} placeholder="Select" optionLabel="name" />
                </div>
                <div className="p-field p-col-12 p-md-4">
                    <label htmlFor="overs">No. of Overs</label>
                    <Dropdown inputId="overs" value={totalOversInOneInning} options={oversOptions} onChange={(e) => setTotalOvers(e.value)} placeholder="Select" optionLabel="name" />
                </div>
                <div className="p-field p-col-12 p-md-4">
                    <label htmlFor="tossResult">Toss Result</label>
                    <Dropdown inputId="tossResult" value={tossResult} options={tossResultOptions} onChange={(e) => setTossResult(e.value)} placeholder="Select" optionLabel="name" />
                </div>
            </div>
            <div className="card p-fluid">
                <h4>Add {firstTeamName} Team Players</h4>
                <Chips value={firstTeamPlayers} max={11} onChange={(e) => setFirstTeamPlayers(e.value)} />
            </div>
            <div className="card p-fluid">
                <h4>Add {secondTeamName} Team Players</h4>
                <Chips value={secondTeamPlayers} max={11} onChange={(e) => setSecondTeamPlayers(e.value)} />
            </div>
            <div className="p-fluid">
                <Button type="button" label="Start Match" className="p-mt-5" onClick={() => setMatchDetails()} />
            </div>
        </div>
    )
}

const mapStateToDispatch = (dispatch) => {
    return {
        insertMatchDetails: (details) => dispatch(insertMatchDetails(details))
    }
}

export default connect(null, mapStateToDispatch)(MatchDetails);
