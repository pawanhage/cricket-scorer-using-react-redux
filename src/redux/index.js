import { NOT_OUT, RETD_HURT, YET_TO_BAT } from "../constants";

export const INSERT_MATCH_DETALS = 'INSERT_MATCH_DETAILS';
export const FORCE_END_OVER = 'FORCE_END_OVER';
export const END_BALL = 'END_BALL';
export const END_INNING = 'END_INNING';
export const RESET_LAST_BALL = 'RESET_LAST_BALL';

// innings: [
//     {
//         score: 100,
//         wickets: 4,
//         extras: 21,
//         batsmen: [
//             {
//                 playerName:
//                 status:
//                 runsScored:
//                 ballsFaced:
//                 strikeRate:
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
//             playerName:
//             overs:
//             wicketsTaken:
//             runsGiven:
//             maiden:
//             economy:
//             overNumbers: [1]
//         }
//         ],
//         overs: [['1', '1Wd', '0', '0', '1', '0', '0']]
//     }
// ]


export const batsmenYetToBatOrRetdHurt = (inning) => {
    return inning.batsmen.filter((batsman) => batsman.status === YET_TO_BAT || batsman.status === RETD_HURT);
}

export const batsmenYetToBatOrRetdHurtOrNotOut = (inning) => {
    return inning.batsmen.filter((batsman) => batsman.status === YET_TO_BAT || batsman.status === RETD_HURT || batsman.status === NOT_OUT);
}

export const batsmenNotOut = (inning) => {
    return inning.batsmen.filter((batsman) => batsman.status === NOT_OUT);
}

export const strikerBatsmanDetails = (inning) => {
    return inning.batsmen.filter((batsman) => batsman.status === NOT_OUT && batsman.striker === true);
}

export const nonStrikerBatsmanDetails = (inning) => {
    return inning.batsmen.filter((batsman) => batsman.status === NOT_OUT && batsman.striker === false);
}

export const nextPossibleBowlers = (inning) => {
    return inning.bowlers.filter((bowler) => {
        if (inning.overs.length === 0) {
            return true
        } else if (bowler.overNumbers.includes(inning.overs.length)) {
            return false;
        } else if (bowler.overs !== ballingQuota) {
            return true;
        }
    });
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
    }
}

export const matchReducer = (state = initialState, action) => {
    switch (action.type) {
        case INSERT_MATCH_DETALS:
            return { ...state, details: action.payload };
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
