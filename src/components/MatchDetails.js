import React, { useState } from 'react'
import { Chips } from 'primereact/chips'
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { insertMatchDetails, updateInnings } from '../redux';
import { connect } from 'react-redux';
import { useHistory } from "react-router-dom";
import { MOCK_TEAM_1, MOCK_TEAM_2, ONE_DAY_MATCH, TEST_MATCH } from '../constants';
import { formInning } from '../utils/cricketUtils';

function MatchDetails({ insertMatchDetails, updateInnings }) {

    const [firstTeamName, setFirstTeamName] = useState(MOCK_TEAM_1.name);
    const [secondTeamName, setSecondTeamName] = useState(MOCK_TEAM_2.name);
    const [matchType, setMatchType] = useState(ONE_DAY_MATCH);
    const [totalOversPerInning, setTotalOvers] = useState(5);
    const [firstTeamPlayers, setFirstTeamPlayers] = useState(MOCK_TEAM_1.players);
    const [secondTeamPlayers, setSecondTeamPlayers] = useState(MOCK_TEAM_2.players);
    const [tossResult, setTossResult] = useState(121);
    const [maxOversPerBowler, setMaxOversPerBowler] = useState(1);

    let history = useHistory();

    let matchTypes = [
        { name: 'One Day Match', value: ONE_DAY_MATCH },
        { name: 'Test Match (Not Supported)', value: TEST_MATCH, disabled: true }
    ];

    let oversOptions = Array.from(Array(50).keys()).map((i) => { return { name: i + 1, value: i + 1 } });

    let tossResultOptions = [
        { name: firstTeamName + ' won the toss and elected to bat first', value: 121 },
        { name: firstTeamName + ' won the toss and elected to bowl first', value: 211 },
        { name: secondTeamName + ' won the toss and elected to bat first', value: 212 },
        { name: secondTeamName + ' won the toss and elected to bowl first', value: 122 }
    ];

    let maxOversPerBowlerOptions = Array.from(Array(Math.ceil(Number(totalOversPerInning / 2))).keys()).map((i) => { return { name: i + 1, value: i + 1 } });

    const setMatchDetails = () => {
        insertMatchDetails({
            teams: { [firstTeamName]: firstTeamPlayers, [secondTeamName]: secondTeamPlayers },
            matchType: matchType,
            totalOversPerInning: totalOversPerInning,
            tossResult: tossResult,
            maxOversPerBowler: maxOversPerBowler,
            totalPlayersPerSide: firstTeamPlayers.length
        });
        let innings = [];
        let battingTeam, battingTeamPlayers, bowlingTeam, bowlingTeamPlayers;
        if (tossResult === 121 || tossResult === 122) {
            battingTeam = firstTeamName;
            battingTeamPlayers = firstTeamPlayers;
            bowlingTeam = secondTeamName;
            bowlingTeamPlayers = secondTeamPlayers;
        } else {
            battingTeam = secondTeamName;
            battingTeamPlayers = secondTeamPlayers;
            bowlingTeam = firstTeamName;
            bowlingTeamPlayers = firstTeamPlayers;
        }
        innings.push(formInning(battingTeam, battingTeamPlayers, bowlingTeam, bowlingTeamPlayers));
        if (matchType === ONE_DAY_MATCH) {
            innings.push(formInning(bowlingTeam, bowlingTeamPlayers, battingTeam, battingTeamPlayers));
        }
        updateInnings(innings);
        history.push('full-scorecard');
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
                    <Dropdown inputId="overs" value={totalOversPerInning} options={oversOptions} onChange={(e) => setTotalOvers(e.value)} placeholder="Select" optionLabel="name" />
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
                <h4>Add {firstTeamName || '1st'} Team Players</h4>
                <Chips value={firstTeamPlayers} max={11} onChange={(e) => setFirstTeamPlayers(e.value)} />
            </div>
            <div className="card p-fluid">
                <h4>Add {secondTeamName || '2nd'} Team Players</h4>
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
