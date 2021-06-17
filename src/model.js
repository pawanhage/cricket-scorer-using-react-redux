import { BOWLED, CAUGHT_BY, COMPLETE, IN_PROGRESS, LBW, NOT_OUT_ON_NON_STRIKE, NOT_OUT_ON_STRIKE, OUT, RETD_HURT, RUN_OUT, YET_TO_BAT } from "./constants"

export const innings = [
    {
        totalScore: Number,
        totalWickets: Number,
        currentRunRate: Number,
        requiredRunRate: Number,
        extras: Number,
        battingTeam: String,
        bowlingTeam: String,
        batsmen:
        {
            name: String,
            status: OUT | NOT_OUT_ON_NON_STRIKE | NOT_OUT_ON_STRIKE | RETD_HURT | YET_TO_BAT,
            runsScored: Number,
            ballsFaced: Number,
            fours: Number,
            sixes: Number,
            strikeRate: Number,
            wicketDetails: {
                type: RUN_OUT | CAUGHT_BY | BOWLED | LBW,
                runOutBy: String,
                bowler: String,
                caughtBy: String,
                stumpedBy: String
            }
        },
        bowlers: [
            {
                name: String,
                totalOvers: Number,
                wicketsTaken: Number,
                runsGiven: Number,
                maiden: Number
            }
        ],
        overs: [
            {
                details: [String],
                bowlerName: String,
                status: IN_PROGRESS | COMPLETE
            }
        ]
    }
];
