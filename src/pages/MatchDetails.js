import React, { useState } from 'react'
import { Chips } from 'primereact/chips'
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { insertMatchDetails, updateInnings } from '../redux';
import { connect } from 'react-redux';
import { useHistory } from "react-router-dom";
import { ONE_DAY_MATCH, TEST_MATCH } from '../constants';
import { formInning } from '../utils/cricketUtils';

function MatchDetails({ insertMatchDetails, updateInnings }) {

    const [firstTeamName, setFirstTeamName] = useState('MI');
    const [secondTeamName, setSecondTeamName] = useState('CSK');
    const [matchType, setMatchType] = useState(ONE_DAY_MATCH);
    const [totalOversInOneInning, setTotalOvers] = useState(5);
    const [firstTeamPlayers, setFirstTeamPlayers] = useState(['Rohit', 'Pandya', 'Pollard', 'SKY', 'Boult']);
    const [secondTeamPlayers, setSecondTeamPlayers] = useState(['MSD', 'Faf', 'Jadeja', 'Raina', 'Sam']);
    const [tossResult, setTossResult] = useState(12);
    const [maxOversPerBowler, setMaxOversPerBowler] = useState(1);

    let history = useHistory();

    let matchTypes = [
        { name: 'One Day Match', value: ONE_DAY_MATCH },
        { name: 'Test Match (Not Supported)', value: TEST_MATCH }
    ];

    let oversOptions = Array.from(Array(50).keys()).map((i) => { return { name: i + 1, value: i + 1 } });

    let tossResultOptions = [
        { name: firstTeamName + ' won the toss and elected to bat first', value: 12 },
        { name: firstTeamName + ' won the toss and elected to bowl first', value: 21 },
        { name: secondTeamName + ' won the toss and elected to bat first', value: 21 },
        { name: secondTeamName + ' won the toss and elected to bowl first', value: 12 }
    ];

    let maxOversPerBowlerOptions = Array.from(Array(Math.ceil(Number(totalOversInOneInning / 2))).keys()).map((i) => { return { name: i + 1, value: i + 1 } });

    const setMatchDetails = () => {
        insertMatchDetails({
            teams: { [firstTeamName]: firstTeamPlayers, [secondTeamName]: secondTeamPlayers },
            matchType: matchType,
            totalOversInOneInning: totalOversInOneInning,
            tossResult: tossResult,
            maxOversPerBowler: maxOversPerBowler,
            totalPlayersPerSide: firstTeamPlayers.length
        });
        let innings = [];
        let battingTeam = tossResult === 12 ? firstTeamName : secondTeamName;
        let battingTeamPlayers = tossResult === 12 ? firstTeamPlayers : secondTeamPlayers;
        let bowlingTeam = tossResult === 12 ? secondTeamName : firstTeamName;
        let bowlingTeamPlayers = tossResult === 12 ? secondTeamPlayers : firstTeamPlayers;

        innings.push(formInning(battingTeam, battingTeamPlayers, bowlingTeam, bowlingTeamPlayers));
        if (matchType === ONE_DAY_MATCH) {
            innings.push(formInning(bowlingTeam, bowlingTeamPlayers, battingTeam, battingTeamPlayers));
        }
        updateInnings(innings);
        history.push('update-score');
    }

    return (
        <div>
            <div className="p-fluid p-formgrid p-grid">
                <div className="p-field p-col-12 p-md-6">
                    <label htmlFor="team1">First Team Name</label>
                    <InputText id="team1" type="text" placeholder="Enter team name" value={firstTeamName} onChange={(e) => setFirstTeamName(e.target.value)} />
                </div>
                <div className="p-field p-col-12 p-md-6">
                    <label htmlFor="team2">Second Team Name</label>
                    <InputText id="team2" type="text" placeholder="Enter team name" value={secondTeamName} onChange={(e) => setSecondTeamName(e.target.value)} />
                </div>
                <div className="p-field p-col-12 p-md-3">
                    <label htmlFor="matchType">Match Type</label>
                    <Dropdown inputId="matchType" value={matchType} options={matchTypes} onChange={(e) => setMatchType(e.value)} placeholder="Select" optionLabel="name" />
                </div>
                <div className="p-field p-col-12 p-md-3">
                    <label htmlFor="overs">No. of Overs</label>
                    <Dropdown inputId="overs" value={totalOversInOneInning} options={oversOptions} onChange={(e) => setTotalOvers(e.value)} placeholder="Select" optionLabel="name" />
                </div>
                <div className="p-field p-col-12 p-md-3">
                    <label htmlFor="overs">Max. Overs Per Bowler</label>
                    <Dropdown inputId="maxOversPerBowler" value={maxOversPerBowler} options={maxOversPerBowlerOptions} onChange={(e) => setMaxOversPerBowler(e.value)} placeholder="Select" optionLabel="name" />
                </div>
                <div className="p-field p-col-12 p-md-3">
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
        insertMatchDetails: (details) => dispatch(insertMatchDetails(details)),
        updateInnings: (innings) => dispatch(updateInnings(innings))
    }
}

export default connect(null, mapStateToDispatch)(MatchDetails);
