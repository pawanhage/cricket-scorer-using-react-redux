import { YET_TO_BAT } from "./constants";

export const formInning = (battingTeam, battingTeamPlayers, bowlingTeam, bowlingTeamPlayers) => {
    return {
        totalScore: 0,
        totalWickets: 0,
        extras: 0,
        currentRunRate: 0,
        requiredRunRate: null,
        battingTeam: battingTeam,
        bowlingTeam: bowlingTeam,
        batsmen: battingTeamPlayers.map((player) => {
            return {
                name: player,
                status: YET_TO_BAT,
                runsScored: 0,
                ballsFaced: 0,
                fours: 0,
                sixes: 0,
                strikeRate: 0,
                wicketDetails: null
            }
        }),
        bowlers: bowlingTeamPlayers.map((player) => {
            return {
                name: player,
                totalOvers: 0,
                wicketsTaken: 0,
                runsGiven: 0,
                maiden: 0,
                economy: 0
            }
        }),
        overs: []
    };
}
