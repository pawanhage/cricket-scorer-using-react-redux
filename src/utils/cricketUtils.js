import {
    CAUGHT_BY,
    COMPLETE,
    IN_PROGRESS,
    NOT_OUT_ON_NON_STRIKE,
    NOT_OUT_ON_STRIKE,
    NO_BALL,
    RUN_OUT,
    STUMPED,
    WICKET,
    WIDE,
    YET_TO_BAT,
    LEG_BYES,
    BYES,
    PENALTY_RUNS,
    NO_BALL_OFF_BAT
} from "../constants";

export const formInning = (battingTeam, battingTeamPlayers, bowlingTeam, bowlingTeamPlayers) => {
    return {
        totalScore: 0,
        totalWickets: 0,
        extras: 0,
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

export const getUpdatedBatsmanOrder = (batsman, order) => {
    return {
        ...batsman,
        order: order
    }
}

export const getUpdatedBatsmanStatus = (batsman, status) => {
    return {
        ...batsman,
        status: status
    }
}

export const getUpdatedBatsmanStats = (batsman, currentBall) => {
    const ball = currentBall.split('');
    let runs = 0;
    let isBallFacedByBatsman = false;
    let index = getExtraBallIndex(ball);
    if (index === 1) {
        runs = ball[index] === NO_BALL ? getRunsFromCurrentBall(currentBall) - 1 : 0;
        isBallFacedByBatsman = ball[index] !== WIDE ? true : false;
    }
    const runsScored = batsman.runsScored + runs;
    const fours = runs % 4 === 0 ? batsman.fours + (runs / 4) : batsman.fours;
    const sixes = runs % 6 === 0 ? batsman.sixes + (runs / 6) : batsman.sixes;
    const ballsFaced = isBallFacedByBatsman ? batsman.ballsFaced + 1 : batsman.ballFaced;
    const strikeRate = (100 * runsScored) / ballsFaced;
    const status = runs % 2 ? NOT_OUT_ON_NON_STRIKE : NOT_OUT_ON_STRIKE
    return {
        ...batsman,
        runsScored: runsScored,
        ballsFaced: ballsFaced,
        fours: fours,
        sixes: sixes,
        strikeRate: strikeRate,
        status: status
    }
}

export const getBatsmanWicketDetails = (batsman, wicketType, bowler, outBy) => {
    let newBatsmanStats = {
        ...batsman,
        wicketDetails: {
            type: wicketType,
            bowler: bowler
        }
    }
    if (wicketType === RUN_OUT || wicketType === CAUGHT_BY || wicketType === STUMPED) {
        newBatsmanStats = {
            ...newBatsmanStats,
            wicketDetails: {
                ...newBatsmanStats.wicketDetails,
                outBy: outBy
            }
        }
        return newBatsmanStats;
    }
}

export const getRunsFromCurrentBall = (currentBall) => {
    currentBall = currentBall.split('');

    const getRun = (ball) => {
        if (isNaN(Number(ball))) {
            if (ball === WICKET) {
                return 0;
            } else if ([WIDE, NO_BALL].includes(ball)) {
                return 1;
            }
        } else {
            return Number(ball);
        }
    }

    if (currentBall.length === 2) {
        return getRun(currentBall[0]) + getRun(currentBall[1]);
    } else if (currentBall.length === 1) {
        return getRun(currentBall[0]);
    } else {
        console.log('Error in getRunsFromCurrentBall, check it now');
    }
}

export const isLegalDelivery = (currentBall) => {
    return currentBall.split('').filter((ball) => ball === WIDE || ball === NO_BALL).length ? true : false;
}

export const getTotalOverNumber = (totalOvers) => {
    let tOvers = totalOvers + 0.1;
    let overs = String(tOvers).split('.');
    if (overs.length > 1) {
        if (overs[1] === '6') {
            tOvers = totalOvers + 1;
        }
    }
    return tOvers;
}

export const isWicketBall = (currentBall) => {
    return currentBall.some((ball) => ball === WICKET);
}

export const incrementMaidenOverCount = (bowler) => {
    return {
        ...bowler,
        maiden: bowler.maiden + 1
    }
}

export const getUpdatedBowlerStats = (bowler, currentBall) => {
    const runsGiven = getRunsFromCurrentBall(currentBall);
    if (isLegalDelivery(currentBall)) {
        const totalOvers = getTotalOverNumber(bowler.totalOvers);
        const wicketsTaken = isWicketBall(currentBall) ? bowler.wicketsTaken + 1 : bowler.wicketsTaken;
        return {
            ...bowler,
            totalOvers: totalOvers,
            runsGiven: runsGiven,
            wicketsTaken: wicketsTaken
        }
    } else {
        return {
            ...bowler,
            runsGiven: runsGiven
        }
    }
}

export const getTotalRunsFromOver = (over) => {
    over.reduce((totalRuns, currentBall) => {
        totalRuns = getRunsFromCurrentBall(currentBall);
        return totalRuns;
    }, 0);
}

export const countLegalDeliveriesInOver = (over) => {
    if (over.length) {
        return over.reduce((totalLegalDeliveries, currentBall) => totalLegalDeliveries = totalLegalDeliveries + Number(isLegalDelivery(currentBall)));
    }
    return 0;
}

export const getInningsCurrentOverStats = (currentOver, currentBall) => {
    const overDetails = currentOver.details.push(currentBall);
    const totalRunsThisOver = getTotalRunsFromOver(overDetails);
    const legalDeliveriesInOver = countLegalDeliveriesInOver(overDetails);
    return {
        ...currentOver,
        details: overDetails,
        totalRunsThisOver: totalRunsThisOver,
        status: legalDeliveriesInOver === 6 ? COMPLETE : IN_PROGRESS
    }
}

export const getExtraBallIndex = (currentBall) => {
    let index;
    index = currentBall.findIndex((ball) => [WIDE, NO_BALL, LEG_BYES, BYES, PENALTY_RUNS, NO_BALL_OFF_BAT].includes(ball));
    return index;
}

export const getExtrasFromCurrentBall = (currentBall) => {
    let extras = {
        wides: 0,
        noBalls: 0,
        legByes: 0,
        byes: 0,
        penaltyRuns: 0
    };
    const ball = currentBall.split('');
    const index = getExtraBallIndex(ball);
    if (index > -1) {
        if (ball[index] === WIDE) {
            extras = {
                ...extras,
                wides: getRunsFromCurrentBall(currentBall)
            }
        } else if (ball[index] === NO_BALL) {
            extras = {
                ...extras,
                noBalls: 1
            }
        } else if (ball[index] === LEG_BYES) {
            extras = {
                ...extras,
                legByes: getRunsFromCurrentBall(currentBall)
            }
        } else if (ball[index] === BYES) {
            extras = {
                ...extras,
                byes: getRunsFromCurrentBall(currentBall)
            }
        } else if (ball[index] === PENALTY_RUNS) {
            extras = {
                ...extras,
                penaltyRuns: getRunsFromCurrentBall(currentBall)
            }
        }
    }
    return extras;
}

// Count Total Overs in inning so far, returns "overs.balls"
export const getTotalOvers = (overs) => {
    const completedOversCount = overs.filter((over) => over.status === COMPLETE).length;
    const inProgressOverCount = overs.length - completedOversCount;
    let totalOvers = completedOversCount;
    if (inProgressOverCount > 0) {
        totalOvers = totalOvers + Number('0.' + String(countLegalDeliveriesInOver(overs[overs.length - 1])));
    }
    return totalOvers;
}

export const calculateCurrentRunRate = (totalScore, currentOvers) => {
    const totalOvers = getTotalOvers(currentOvers);
    const [overs] = String(totalOvers).split('.');
    const balls = String(totalOvers).split('.')[1] ? String(totalOvers).split('.')[1] : 0;
    const totalBalls = (Number(overs) * 6 + balls);
    if (totalBalls === 0) {
        return 0
    }
    return Number((totalScore / ((totalBalls / 6))).toFixed(2));
}

export const calculateRequiredRunRate = (totalScore, target, currentOvers, oversPerSide) => {
    const totalOvers = getTotalOvers(currentOvers);
    const [overs, balls] = String(totalOvers).split('.');
    const totalBallsRemained = oversPerSide * 6 - (Number(overs) * 6 + (Number(balls) ? Number(balls) : 0));
    return Number((((target - totalScore) / totalBallsRemained) * 6).toFixed(2));
}

export const isContinueButtonDisabledForCurrentBall = (runs, extra, wicketType, whoOut, outByPlayer) => {
    let disabled = runs === null && !isNaN(runs) && !extra;
    if (wicketType) {
        if (wicketType === RUN_OUT) {
            if (!whoOut || !outByPlayer) {
                disabled = true;
            } else {
                disabled = false;
            }
        } else if (wicketType === CAUGHT_BY) {
            if (!outByPlayer) {
                disabled = true;
            } else {
                disabled = false;
            }
        } else if (wicketType === STUMPED) {
            if (!outByPlayer) {
                disabled = true
            } else {
                disabled = false;
            }
        } else {
            disabled = false;
        }
    }
    return disabled;
}

export const getUpdatedInningStats = (currentInning, currentBall, striker, nonStriker, bowler, wicketDetails) => {
    if (isWicketBall(currentBall)) {
        currentInning = {
            ...currentInning,
            totalWickets: currentInning.totalWickets + 1
        }
    }

    const index = getExtraBallIndex(currentBall);
    if (index > -1) {
        let ext = getExtrasFromCurrentBall(currentBall);
        currentInning = {
            ...currentInning,
            extras: {
                ...currentInning.extras,
                wides: currentInning.extras.wides + ext.wides,
                noBalls: currentInning.extras.noBalls + ext.noBalls,
                legByes: currentInning.extras.legByes + ext.legByes,
                byes: currentInning.extras.byes + ext.byes,
                penaltyRuns: currentInning.extras.penaltyRuns + ext.penaltyRuns
            }
        }
    }

    currentInning = {
        ...currentInning,
        totalScore: currentInning.totalScore + getRunsFromCurrentBall(currentBall)
    }

    return currentInning;
}
