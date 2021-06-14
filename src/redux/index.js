import { NOT_OUT, RETD_HURT, YET_TO_BAT } from "../constants";

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
//         batsmen: [
//             {
//                 name:
//                 status:
//                 runsScored:
//                 ballsFaced:
//                 fours:
//                 six:
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
//             overs:
//             wicketsTaken:
//             runsGiven:
//             maiden:
//             economy:
//             overNumbers: [1]
//         }
//         ],
//         overs: [
//                  {
//                   overDetail: ['1', '1Wd', '0', '0', '1', '0', '0'],
//                   bowlerName: 
//                   }
//               ]
//       }
// ]


export const batsmenYetToBatOrRetdHurt = (match) => {
    return match.innings[match.currentInning].batsmen.filter((batsman) => batsman.status === YET_TO_BAT || batsman.status === RETD_HURT);
}

export const batsmenYetToBatOrRetdHurtOrNotOut = (match) => {
    return match.innings[match.currentInning].batsmen.filter((batsman) => batsman.status === YET_TO_BAT || batsman.status === RETD_HURT || batsman.status === NOT_OUT);
}

export const batsmenNotOut = (match) => {
    return match.innings[match.currentInning].batsmen.filter((batsman) => batsman.status === NOT_OUT);
}

export const strikerBatsmanDetails = (match) => {
    return match.innings[match.currentInning].batsmen.filter((batsman) => batsman.status === NOT_OUT && batsman.striker === true);
}

export const nonStrikerBatsmanDetails = (match) => {
    return match.innings[match.currentInning].batsmen.filter((batsman) => batsman.status === NOT_OUT && batsman.striker === false);
}

export const nextPossibleBowlers = (match) => {
    return match.innings[match.currentInning].bowlers.filter((bowler) => {
        if (match.innings[match.currentInning].overs.length === 0) {
            return true
        } else if (bowler.overNumbers.includes(match.innings[match.currentInning].overs.length)) {
            return false;
        } else if (bowler.overs !== match.details.maxOversPerBowler) {
            return true;
        }
        return true;
    });
}

export const currentBowlerName = (inning) => {
    return inning.overs[inning.overs.length - 1].bowlerName || '';
}

export const wicketsGone = (inning) => {
    return inning.wickets;
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
    console.log(innings);
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
