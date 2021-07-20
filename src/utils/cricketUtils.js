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
    NO_BALL_OFF_BAT,
    BOWLED,
    LBW,
    HIT_WICKET,
    OUT,
    YET_TO_START
} from "../constants";
import { isN } from "./common";

export const formInning = (battingTeam, battingTeamPlayers, bowlingTeam, bowlingTeamPlayers) => {
    return {
        totalScore: 0,
        totalWickets: 0,
        extras: {
            wides: 0,
            noBalls: 0,
            legByes: 0,
            byes: 0,
            penaltyRuns: 0
        },
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
        overs: [],
        status: YET_TO_START
    };
}

export const getUpdatedBatsmanStatus = (batsman, status) => {
    return {
        ...batsman,
        status: status
    }
}

export const getRunsIndex = (currentBall) => {
    return currentBall.findIndex((ball) => isN(ball));
}

export const getUpdatedBatsmanStats = (batsman, currentBall) => {
    let runs = getRunsFromCurrentBall(currentBall);
    let isBallFacedByBatsman = true;
    let extraIndex = getExtraBallIndex(currentBall);
    let runIndex = getRunsIndex(currentBall);
    if (extraIndex > -1) {
        if (currentBall[extraIndex] === NO_BALL_OFF_BAT) {
            runs = runs - 1;
        } else if ([WIDE, LEG_BYES, BYES, NO_BALL, PENALTY_RUNS].includes(currentBall[extraIndex])) {
            runs = 0;
        }
        isBallFacedByBatsman = [WIDE, NO_BALL, PENALTY_RUNS].includes(currentBall[extraIndex]) ? false : true;
    }
    const runsScored = batsman.runsScored + runs;
    const fours = runs % 4 === 0 ? batsman.fours + (runs / 4) : batsman.fours;
    const sixes = runs % 6 === 0 ? batsman.sixes + (runs / 6) : batsman.sixes;
    const ballsFaced = isBallFacedByBatsman ? batsman.ballsFaced + 1 : batsman.ballsFaced;
    const strikeRate = ballsFaced ? Number(((100 * runsScored) / ballsFaced).toFixed(2)) : 0;
    const status = currentBall[runIndex] && currentBall[extraIndex] !== PENALTY_RUNS ? ((isN(currentBall[runIndex]) && currentBall[0] % 2 === 0) ? NOT_OUT_ON_STRIKE : NOT_OUT_ON_NON_STRIKE) : NOT_OUT_ON_STRIKE;
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
    const getRun = (ball) => {
        if (isNaN(Number(ball))) {
            if (ball === WICKET) {
                return 0;
            } else if ([WIDE, NO_BALL, NO_BALL_OFF_BAT].includes(ball)) {
                return 1;
            } else {
                return 0;
            }
        } else {
            return Number(ball);
        }
    }
    return currentBall.reduce((acc, curr) => acc = acc + getRun(curr), 0);
}

export const isLegalDelivery = (currentBall) => {
    if (Array.isArray(currentBall)) {
        return currentBall.every((ball) => ball !== WIDE && ball !== NO_BALL && ball !== NO_BALL_OFF_BAT && ball !== PENALTY_RUNS);
    } else if (typeof currentBall === 'string') {
        return !new RegExp([WIDE, NO_BALL, NO_BALL_OFF_BAT, PENALTY_RUNS].join('|')).test(currentBall);
    }
}

export const getTotalOverNumber = (totalOvers) => {
    let tOvers = totalOvers + 0.1;
    let overs = String(tOvers).split('.');
    if (overs.length > 1) {
        if (overs[1] === '6') {
            tOvers = Number(overs[0]) + 1;
        }
    }
    return Number(tOvers.toFixed(1));
}

export const isWicketBall = (currentBall) => {
    return currentBall.some((ball) => ball === WICKET);
}

export const isWicketTakenByBowler = (wicketDetails) => {
    if (Object.keys(wicketDetails).some((key) => wicketDetails[key])) {
        return [BOWLED, LBW, CAUGHT_BY, STUMPED, HIT_WICKET].includes(wicketDetails.wicketType);
    }
    return false;
}

export const incrementMaidenOverCount = (bowler) => {
    return {
        ...bowler,
        maiden: bowler.maiden + 1
    }
}

export const getUpdatedBowlerStats = (bowler, currentBall) => {
    let runsGiven = getRunsFromCurrentBall(currentBall);
    if (isLegalDelivery(currentBall)) {
        const totalOvers = getTotalOverNumber(bowler.totalOvers);
        if (currentBall.includes(LEG_BYES) || currentBall.includes(BYES)) {
            runsGiven = 0;
        }
        return {
            ...bowler,
            totalOvers: totalOvers,
            runsGiven: bowler.runsGiven + runsGiven
        }
    } else {
        return {
            ...bowler,
            runsGiven: bowler.runsGiven + runsGiven
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
    let count = 0;
    if (over.length) {
        count = Number(over.reduce((totalLegalDeliveries, currentBall) => totalLegalDeliveries + Number(isLegalDelivery(currentBall)), 0));
    }
    return count;
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
    const index = getExtraBallIndex(currentBall);
    const totalRunsFromCurrentBall = getRunsFromCurrentBall(currentBall);

    if (index > -1) {
        if (currentBall[index] === WIDE) {
            extras = {
                ...extras,
                wides: totalRunsFromCurrentBall
            }
        } else if (currentBall[index] === NO_BALL || currentBall[index] === NO_BALL_OFF_BAT) {
            extras = {
                ...extras,
                noBalls: 1
            }
        } else if (currentBall[index] === LEG_BYES) {
            extras = {
                ...extras,
                legByes: totalRunsFromCurrentBall
            }
        } else if (currentBall[index] === BYES) {
            extras = {
                ...extras,
                byes: totalRunsFromCurrentBall
            }
        } else if (currentBall[index] === PENALTY_RUNS) {
            extras = {
                ...extras,
                penaltyRuns: totalRunsFromCurrentBall
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
        totalOvers = totalOvers + Number('0.' + String(countLegalDeliveriesInOver(overs[overs.length - 1].details)));
    }
    return Number(totalOvers);
}

export const calculateCurrentRunRate = (totalScore, currentOvers) => {
    const totalOvers = getTotalOvers(currentOvers);
    const [overs] = String(totalOvers).split('.');
    const balls = String(totalOvers).split('.')[1] ? String(totalOvers).split('.')[1] : 0;
    const totalBalls = (Number(overs) * 6 + Number(balls));
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

export const calculateEconomyRateForBowler = (bowler) => {
    const totalRuns = bowler.runsGiven;
    const [overs, balls] = String(bowler.totalOvers).split('.');
    const totalBalls = overs * 6 + (balls ? balls : 0);
    return Number(((totalRuns / totalBalls) * 6).toFixed(2));
}

export const getUpdatedInningStats = (currentInning, currentBall, striker, nonStriker, bowler, wicketDetails) => {

    const totalRunsFromCurrentBall = getRunsFromCurrentBall(currentBall);
    const extraBallIndex = getExtraBallIndex(currentBall);
    const strikerIndex = currentInning.batsmen.findIndex((batsman) => batsman.name === striker.name);
    const nonStrikerIndex = currentInning.batsmen.findIndex((batsman) => batsman.name === nonStriker.name);
    const whoOutIndex = currentInning.batsmen.findIndex((batsman) => batsman.name === wicketDetails.whoOut);

    // handleOvers
    currentInning.overs[currentInning.overs.length - 1] = {
        ...currentInning.overs[currentInning.overs.length - 1],
        details: [...currentInning.overs[currentInning.overs.length - 1].details, currentBall.join('')],
        totalRunsInThisOver: currentInning.overs[currentInning.overs.length - 1].totalRunsInThisOver + totalRunsFromCurrentBall
    }

    // handleExtras
    if (extraBallIndex > -1) {
        let ext = getExtrasFromCurrentBall(currentBall);
        currentInning = {
            ...currentInning,
            extras: {
                ...currentInning.extras,
                wides: currentInning.extras.wides ? currentInning.extras.wides + ext.wides : ext.wides,
                noBalls: currentInning.extras.noBalls ? currentInning.extras.noBalls + ext.noBalls : ext.noBalls,
                legByes: currentInning.extras.legByes ? currentInning.extras.legByes + ext.legByes : ext.legByes,
                byes: currentInning.extras.byes ? currentInning.extras.byes + ext.byes : ext.byes,
                penaltyRuns: currentInning.extras.penaltyRuns ? currentInning.extras.penaltyRuns + ext.penaltyRuns : ext.penaltyRuns
            }
        }
    }

    // handleTotalScore
    currentInning = {
        ...currentInning,
        totalScore: currentInning.totalScore + totalRunsFromCurrentBall
    }

    // handleStrikerBatsmanDetails 
    if (strikerIndex > -1) {
        currentInning.batsmen[strikerIndex] = {
            ...currentInning.batsmen[strikerIndex],
            ...getUpdatedBatsmanStats(currentInning.batsmen[strikerIndex], currentBall)
        }
    }

    // handleNonStrikerBatsmanDetails 
    let index = getRunsIndex(currentBall);
    if (currentBall[extraBallIndex] !== PENALTY_RUNS && (isN(currentBall[index]) && currentBall[index] > 0 && currentBall[index] % 2 !== 0)) {
        if (nonStrikerIndex > -1) {
            currentInning.batsmen[nonStrikerIndex] = {
                ...currentInning.batsmen[nonStrikerIndex],
                status: NOT_OUT_ON_STRIKE
            };
        };
    }

    // handleWicketDetailsForBatsman 
    if (Object.keys(wicketDetails).some((key) => wicketDetails[key])) {
        if (whoOutIndex > -1) {
            currentInning.batsmen[whoOutIndex] = {
                ...currentInning.batsmen[whoOutIndex],
                status: OUT,
                wicketDetails: {
                    bowler: bowler.name,
                    type: wicketDetails.wicketType,
                    outBy: wicketDetails.outByPlayer
                }
            }
        }
    }

    // handleTotalWickets and fall of wickets
    if (isWicketBall(currentBall)) {
        currentInning = {
            ...currentInning,
            totalWickets: currentInning.totalWickets + 1
        }

        if (whoOutIndex > -1) {
            let totalOvers = getTotalOvers(currentInning.overs);
            currentInning = {
                ...currentInning,
                fow: currentInning.fow ? [...currentInning.fow, { score: currentInning.totalScore, totalOvers: totalOvers, batsman: currentInning.batsmen[whoOutIndex] }] : [{ score: currentInning.totalScore, totalOvers: totalOvers, batsman: currentInning.batsmen[whoOutIndex] }]
            }
        }
    }

    // Check if over is completed and is maiden or not 
    const totalLegalDeliveries = countLegalDeliveriesInOver(currentInning.overs[currentInning.overs.length - 1].details);
    let isOverMaiden = false;
    if (totalLegalDeliveries === 6) {
        currentInning.overs[currentInning.overs.length - 1] = {
            ...currentInning.overs[currentInning.overs.length - 1],
            status: COMPLETE
        }

        if (currentInning.overs[currentInning.overs.length - 1].totalRunsInThisOver === 0) {
            isOverMaiden = true;
        }

        if (strikerIndex > -1) {
            let status;
            if (currentInning.batsmen[strikerIndex].status === NOT_OUT_ON_STRIKE) {
                status = NOT_OUT_ON_NON_STRIKE;
            } else if (currentInning.batsmen[strikerIndex].status === NOT_OUT_ON_NON_STRIKE) {
                status = NOT_OUT_ON_STRIKE;
            }
            currentInning.batsmen[strikerIndex] = {
                ...currentInning.batsmen[strikerIndex],
                status: status
            }
        }

        if (nonStrikerIndex > -1) {
            let status;
            if (currentInning.batsmen[nonStrikerIndex].status === NOT_OUT_ON_STRIKE) {
                status = NOT_OUT_ON_NON_STRIKE;
            } else if (currentInning.batsmen[nonStrikerIndex].status === NOT_OUT_ON_NON_STRIKE) {
                status = NOT_OUT_ON_STRIKE;
            }

            currentInning.batsmen[nonStrikerIndex] = {
                ...currentInning.batsmen[nonStrikerIndex],
                status: status
            };
        };
    }

    // handleBowlerDetails
    index = currentInning.bowlers.findIndex((b) => b.name === bowler.name);
    if (index > -1) {
        currentInning.bowlers[index] = {
            ...currentInning.bowlers[index],
            ...getUpdatedBowlerStats(currentInning.bowlers[index], currentBall),
            wicketsTaken: isWicketTakenByBowler(wicketDetails) ? currentInning.bowlers[index].wicketsTaken + 1 : currentInning.bowlers[index].wicketsTaken
        };

        // handleEconomyRateOfBowler
        currentInning.bowlers[index] = {
            ...currentInning.bowlers[index],
            economy: calculateEconomyRateForBowler(currentInning.bowlers[index]),
            maiden: isOverMaiden ? currentInning.bowlers[index].maiden + 1 : currentInning.bowlers[index].maiden
        };
    }

    // handle partnerships details
    const { runsScored, ballsFaced } = getUpdatedBatsmanStats(currentInning.partnerships[currentInning.partnerships.length - 1][striker.name], currentBall)
    currentInning.partnerships[currentInning.partnerships.length - 1] = {
        ...currentInning.partnerships[currentInning.partnerships.length - 1],
        [striker.name]: {
            runsScored: runsScored,
            ballsFaced: ballsFaced
        }
    }

    return currentInning;
}
