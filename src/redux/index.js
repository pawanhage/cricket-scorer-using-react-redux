import { NOT_OUT_ON_NON_STRIKE, NOT_OUT_ON_STRIKE, RETD_HURT, YET_TO_BAT } from "../constants";

export const INSERT_MATCH_DETALS = 'INSERT_MATCH_DETAILS';
export const UPDATE_INNINGS = 'UPDATE_INNINGS';
export const FORCE_END_OVER = 'FORCE_END_OVER';
export const END_BALL = 'END_BALL';
export const END_INNING = 'END_INNING';
export const RESET_LAST_BALL = 'RESET_LAST_BALL';

// innings: [
//     {
//         score: 100,
//         wickets: 4,
//         extras: 21,
//         battingTeam: 
//         bowlingTeam:
//         batsmen: [
//             {
//                 name:
//                 status:
//                 runsScored: [1, 0, 3, 4, 0]
//                 wicketDetails: {
//                     type:
//                     runOutBy ?:
//                     bowler:
//                     caughtBy?:
//                     stumpedBy ?:
//                 }
//             }
//         ],
//         bowlers: [
//         {
//             name:
//             totalOvers:
//             wicketsTaken:
//             runsGiven:
//             maiden:
//         }
//         ],
//         overs: [{details: ['1', '1WD', '0', '0', '1', '0', '0'], bowlerName: ''},{ }... ...]
// ]

export const batsmenYetToBatOrRetdHurt = (match) => {
    return match.innings[match.currentInning].batsmen.filter((batsman) => batsman.status === YET_TO_BAT || batsman.status === RETD_HURT);
}

export const batsmenNotOut = (match) => {
    return match.innings[match.currentInning].batsmen.filter((batsman) => batsman.status === NOT_OUT_ON_NON_STRIKE || batsman.status === NOT_OUT_ON_STRIKE);
}

export const strikerBatsmanDetails = (match) => {
    return match.innings[match.currentInning].batsmen.filter((batsman) => batsman.status === NOT_OUT_ON_STRIKE);
}

export const nonStrikerBatsmanDetails = (match) => {
    return match.innings[match.currentInning].batsmen.filter((batsman) => batsman.status === NOT_OUT_ON_NON_STRIKE);
}

export const nextPossibleBowlers = (match) => {
    return match.innings[match.currentInning].bowlers.filter((bowler) => {
        if (match.innings[match.currentInning].overs.length === 0) {
            return true
        } else if (match.innings[match.currentInning].overs[match.innings[match.currentInning].overs.length - 1].bowlerName === bowler.name) {
            return false;
        } else if (bowler.totalOvers !== match.details.maxOversPerBowler) {
            return true;
        }
        return true;
    });
}

export const currentBowlerName = (match) => {
    return match.innings[match.currentInning].overs[match.innings[match.currentInning].overs.length - 1] ? match.innings[match.currentInning].overs[match.innings[match.currentInning].overs.length - 1].bowlerName : '';
}

export const totalWickets = (inning) => {
    return inning.wickets;
}

export const totalPlayersInEachTeam = (match) => {
    return match.details.totalPlayersInEachTeam;
}

export const getCurrentInning = (match) => {
    return match.innings[match.currentInning];
}

const initialState = {
    details: null,
    innings: [],
    currentInning: 0,
}

export const insertMatchDetails = (matchDetails) => {
    return {
        type: INSERT_MATCH_DETALS,
        payload: matchDetails
    };
}

export const updateInnings = (innings) => {
    return {
        type: UPDATE_INNINGS,
        payload: innings
    };
}

export const matchReducer = (state = initialState, action) => {
    switch (action.type) {
        case INSERT_MATCH_DETALS:
            return { ...state, details: action.payload };
        case UPDATE_INNINGS:
            return { ...state, innings: action.payload };
        case FORCE_END_OVER:
            return { ...state, innings: action.payload };
        case END_BALL:
            return { ...state, innings: action.payload };
        case END_INNING:
            return { ...state, innings: action.payload };
        case RESET_LAST_BALL:
            return { ...state, innings: action.payload };
        default:
            return state
    }
}

export default matchReducer;
