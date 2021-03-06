import { IN_PROGRESS, NOT_OUT_ON_NON_STRIKE, NOT_OUT_ON_STRIKE, RETD_HURT, YET_TO_BAT } from "../constants";
import { calculateCurrentRunRate, calculateRequiredRunRate, getTotalOvers } from "../utils/cricketUtils";

export const INSERT_MATCH_DETALS = 'INSERT_MATCH_DETAILS';
export const UPDATE_INNINGS = 'UPDATE_INNINGS';
export const FORCE_END_OVER = 'FORCE_END_OVER';
export const END_BALL = 'END_BALL';
export const END_INNING = 'END_INNING';
export const RESET_LAST_BALL = 'RESET_LAST_BALL';
export const START_NEXT_INNING = 'START_NEXT_INNING';
export const SET_MATCH_RESULT = 'SET_MATCH_RESULT';

export const getYetToBatOrRetdHurtBatsmen = (match) => {
    return match.innings[match.currentInningIndex].batsmen.filter((batsman) => batsman.status === YET_TO_BAT || batsman.status === RETD_HURT);
}

export const getNotOutBatsmen = (match) => {
    return match.innings[match.currentInningIndex].batsmen.filter((batsman) => batsman.status === NOT_OUT_ON_NON_STRIKE || batsman.status === NOT_OUT_ON_STRIKE);
}

export const getStrikerBatsman = (match) => {
    const batsman = match.innings[match.currentInningIndex].batsmen.filter((batsman) => batsman.status === NOT_OUT_ON_STRIKE)[0];
    return batsman ? batsman : null;
}

export const getNonStrikerBatsman = (match) => {
    const batsman = match.innings[match.currentInningIndex].batsmen.filter((batsman) => batsman.status === NOT_OUT_ON_NON_STRIKE)[0];
    return batsman ? batsman : null;
}

export const getNextPossibleBowlers = (match) => {
    let overs = match.innings[match.currentInningIndex].overs;
    return match.innings[match.currentInningIndex].bowlers.filter((bowler) => {
        if (overs.length === 0) {
            return true;
        } else {
            if (overs[overs.length - 1].bowlerName !== bowler.name) {
                if (Number(bowler.totalOvers) < match.details.maxOversPerBowler) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
    });
}

export const getCurrentBowler = (match) => {
    let overs = match.innings[match.currentInningIndex].overs;
    let lastOver = overs.length && overs[overs.length - 1];
    const bowlerName = lastOver && lastOver.status === IN_PROGRESS ? lastOver.bowlerName : null;
    if (bowlerName) {
        return match.innings[match.currentInningIndex].bowlers.filter((bowler) => bowler.name === bowlerName)[0];
    }
    return null;
}

export const getCurrentOver = (match) => {
    let overs = match.innings[match.currentInningIndex].overs;
    let lastOver = overs.length && overs[overs.length - 1];
    return lastOver ? lastOver : null;
}

export const getTotalWickets = (match) => {
    return match.innings[match.currentInningIndex].totalWickets;
}

export const getTotalPlayersPerSide = (match) => {
    return match.details.totalPlayersPerSide;
}

export const getCurrentInning = (match) => {
    return match.innings[match.currentInningIndex];
}

export const getLastBall = (match) => {
    let overs = match.innings[match.currentInningIndex].overs;
    let lastOver = overs.length > 0 && overs[overs.length - 1];
    let lastBall = lastOver && lastOver.details.length > 0 && lastOver.details[lastOver.details.length - 1];
    return lastBall ? lastBall : '';
}

export const getBattingTeamPlayers = (match) => {
    return match.details.teams[match.innings[match.currentInningIndex].battingTeam];
}

export const getBowlingTeamPlayers = (match) => {
    return match.details.teams[match.innings[match.currentInningIndex].bowlingTeam];
}

export const getTotalOversCount = (match) => {
    return getTotalOvers(match.innings[match.currentInningIndex].overs)
}

export const getCurrentRunRate = (match) => {
    return calculateCurrentRunRate(match.innings[match.currentInningIndex].totalScore, match.innings[match.currentInningIndex].overs);
}

export const getRequiredRunRate = (match) => {
    return calculateRequiredRunRate(match.innings[match.currentInningIndex].totalScore, match.innings[match.currentInningIndex].target, match.innings[match.currentInningIndex].overs, match.details.totalOversPerInning);
}

export const getTotalOversPerInning = (match) => {
    return match.details.totalOversPerInning;
}

export const getTeams = (match) => {
    return Object.keys(match.details.teams);
}

export const getLiveScore = (match) => {
    if (match.innings[match.currentInningIndex]) {
        return `Live ${match.innings[match.currentInningIndex].battingTeam}: ${match.innings[match.currentInningIndex].totalScore}/${match.innings[match.currentInningIndex].totalWickets} in ${getTotalOversCount(match)} Overs`;
    }
    return '';
}

const initialState = {
    details: null,
    innings: [],
    currentInningIndex: 0,
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

export const startNextInning = () => {
    return {
        type: START_NEXT_INNING
    }
}

export const setMatchResult = (matchResult) => {
    return {
        type: SET_MATCH_RESULT,
        payload: matchResult
    }
}

export const matchReducer = (state = initialState, action) => {
    switch (action.type) {
        case INSERT_MATCH_DETALS:
            return { ...state, details: action.payload };
        case UPDATE_INNINGS:
            return { ...state, innings: action.payload };
        case START_NEXT_INNING:
            return { ...state, currentInningIndex: state.currentInningIndex + 1 };
        case SET_MATCH_RESULT:
            return { ...state, details: { ...state.details, result: action.payload } };
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
