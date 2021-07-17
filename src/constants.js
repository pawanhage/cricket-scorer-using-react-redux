export const WICKET = 'WKT';
export const RUN_OUT = 'R';
export const CAUGHT_BY = 'C';
export const LBW = 'LBW';
export const BOWLED = 'B';
export const STUMPED = 'ST';
export const HIT_WICKET = "Hit Wicket";
export const FIELD_OBSTRUCT = "Field Obstruct";

export const WIDE = 'WD';
export const NO_BALL = 'NB';
export const LEG_BYES = 'LB';
export const BYES = 'B';
export const PENALTY_RUNS = 'PEN';
export const NO_BALL_OFF_BAT = "nb"

export const YET_TO_BAT = 'YTB';
export const OUT = 'O';
export const RETD_HURT = 'RETD_HURT';
export const NOT_OUT_ON_STRIKE = 'OS';
export const NOT_OUT_ON_NON_STRIKE = 'ONS';
export const DID_NOT_BAT = 'DNB';

export const ONE_DAY_MATCH = 'ODM';
export const TEST_MATCH = 'TM';

export const IN_PROGRESS = 'IN_PROGRESS';
export const COMPLETE = 'COMPLETE';

export const RUNS_OPTIONS = [
    { label: '0', value: 0, disabled: false },
    { label: '1', value: 1, disabled: false },
    { label: '2', value: 2, disabled: false },
    { label: '3', value: 3, disabled: false },
    { label: '4', value: 4, disabled: false },
    { label: '5', value: 5, disabled: false },
    { label: '6', value: 6, disabled: false }
];

export const EXTRAS_OPTIONS = [
    { label: 'Wide', value: WIDE, disabled: false },
    { label: 'No Ball', value: NO_BALL, disabled: false },
    { label: 'No Ball (Hit by batsman)', value: NO_BALL_OFF_BAT, disabled: false },
    { label: 'Leg Bye', value: LEG_BYES, disabled: false },
    { label: 'Bye', value: BYES, disabled: false },
    { label: 'Penalty', value: PENALTY_RUNS, disabled: false }
];

export const WICKET_OPTIONS = [
    { label: "Bowled", value: BOWLED, disabled: false },
    { label: "LBW", value: LBW, disabled: false },
    { label: "Catch Out", value: CAUGHT_BY, disabled: false },
    { label: "Run Out", value: RUN_OUT, disabled: false },
    { label: "Stump Out", value: STUMPED, disabled: false },
    { label: "Hit Wicket", value: HIT_WICKET, disabled: false },
    { label: "Field Obstruct", value: FIELD_OBSTRUCT, disabled: false }
];

export const YET_TO_START = 'YTS';
export const COMPLETED = 'COMPLETED';

export const MOCK_TEAM_1 = {
    name: 'MI',
    players: [
        'Quinton de Kock',
        'Rohit Sharma',
        'Suryakumar Yadav',
        'Ishan Kishan',
        'Kieron Pollard',
        'Hardik Pandya',
        'Krunal Pandya',
        'Jayant Yadav',
        'Rahul Chahar',
        'Jasprit Bumrah',
        'Trent Boult'
    ]
}

export const MOCK_TEAM_2 = {
    name: 'CSK',
    players: [
        'Ruturaj Gaikwad',
        'Faf du Plessis',
        'Suresh Raina',
        'Moeen Ali',
        'Ambati Rayudu',
        'Ravindra Jadeja',
        'MS Dhoni',
        'Sam Curran',
        'Lungi Ngidi',
        'Deepak Chahar',
        'Shardul Thakur'
    ]
}
