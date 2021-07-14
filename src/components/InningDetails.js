import React from 'react'
import { BOWLED, CAUGHT_BY, FIELD_OBSTRUCT, HIT_WICKET, LBW, NOT_OUT_ON_NON_STRIKE, NOT_OUT_ON_STRIKE, RUN_OUT, STUMPED, YET_TO_BAT, YET_TO_START } from '../constants'
import { getTotalOvers } from '../utils/cricketUtils'
import { TabView, TabPanel } from 'primereact/tabview';

function InningDetails({ inning }) {
    if (inning.status !== YET_TO_START) {
        return (
            <>
                <TabView style={{ fontFamily: "Lato, Verdana, Helvetica, sans-serif" }}>
                    <TabPanel header="ScoreCard">
                        <div style={{ maxHeight: '300px', overflowY: 'scroll' }} class="rca-tab-content rca-padding rca-no-top-padding rca-no-bottom-padding active">
                            <div class="rca-batting-score rca-padding ">
                                <h3>{inning.battingTeam} Batting: <strong> {inning.totalScore}/{inning.totalWickets} in {getTotalOvers(inning.overs)} Overs</strong></h3>
                                <div class="rca-row">
                                    <div class="rca-header rca-table">
                                        <div class="rca-col rca-player">
                                            Batsmen
                                        </div>
                                        <div class="rca-col">
                                        </div>
                                        <div class="rca-col">
                                            R
                                        </div>
                                        <div class="rca-col">
                                            4s
                                        </div>
                                        <div class="rca-col">
                                            6s
                                        </div>
                                        <div class="rca-col">
                                            SR
                                        </div>
                                    </div>
                                </div>
                                {(() => {
                                    let batsmenJsx = inning.batsmen.filter((batsman) => batsman.status !== YET_TO_BAT).sort((a, b) => a.order - b.order).map((batsman, index) => {
                                        let wicketDetails;
                                        let status;
                                        if (batsman.wicketDetails) {
                                            if (batsman.wicketDetails.type === BOWLED || batsman.wicketDetails.type === LBW) {
                                                wicketDetails = `${batsman.wicketDetails.type} ${batsman.wicketDetails.bowler}`
                                            }
                                            if (batsman.wicketDetails.type === RUN_OUT || batsman.wicketDetails.type === CAUGHT_BY || batsman.wicketDetails.type === STUMPED) {
                                                wicketDetails = `${batsman.wicketDetails.type} ${batsman.wicketDetails.outBy}`
                                            }
                                            if (batsman.wicketDetails.type === HIT_WICKET || batsman.wicketDetails.type === FIELD_OBSTRUCT) {
                                                wicketDetails = `${batsman.wicketDetails.type}`
                                            }
                                        } else {
                                            if (batsman.status === NOT_OUT_ON_STRIKE || batsman.status === NOT_OUT_ON_NON_STRIKE) {
                                                status = 'Not Out';
                                            }
                                        }
                                        return (
                                            <div key={index} class="rca-row">
                                                <div class="rca-table">
                                                    <div class="rca-col rca-player">
                                                        {batsman.name}
                                                    </div>
                                                    <div class="rca-col">
                                                        {wicketDetails ? wicketDetails : <span style={{ color: '#2196F3' }}>{status}</span>}
                                                    </div>
                                                    <div class="rca-col">
                                                        {batsman.runsScored} ({batsman.ballsFaced})
                                                    </div>
                                                    <div class="rca-col">
                                                        {batsman.fours}
                                                    </div>
                                                    <div class="rca-col">
                                                        {batsman.sixes}
                                                    </div>
                                                    <div class="rca-col">
                                                        {batsman.strikeRate}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    });
                                    return batsmenJsx
                                })()}
                                <div class="rca-clear"></div>
                                <div class="rca-padding">
                                    <span>Fours: <strong>{(() => inning.batsmen.reduce(((fours, batsman) => fours + batsman.fours), 0))()}</strong></span>,
                                    <span> Sixes: <strong>{(() => inning.batsmen.reduce(((fours, batsman) => fours + batsman.sixes), 0))()}</strong></span>,
                                    <span> Extras: <strong>{(() => Object.keys(inning.extras).reduce(((extra, key) => extra + inning.extras[key]), 0))()} (WD: {inning.extras.wides}, NB: {inning.extras.noBalls}, LB: {inning.extras.legByes}, B: {inning.extras.byes}, P: {inning.extras.penaltyRuns})</strong></span>
                                </div>
                            </div>
                            <div class="rca-bowling-score rca-padding">
                                <h3> {inning.bowlingTeam} Bowling:</h3>
                                <div class="rca-row">
                                    <div class="rca-header rca-table">
                                        <div class="rca-col rca-player">
                                            Bowlers
                                        </div>
                                        <div class="rca-col">
                                            Overs
                                        </div>
                                        <div class="rca-col">
                                            Maiden
                                        </div>
                                        <div class="rca-col">
                                            Runs
                                        </div>
                                        <div class="rca-col">
                                            Wickets
                                        </div>
                                        <div class="rca-col">
                                            Economy
                                        </div>
                                    </div>
                                </div>
                                {
                                    (() => {
                                        let bowlerJsx = inning.bowlers.filter((bowler) => bowler.totalOvers > 0).map((bowler, index) => {
                                            return (
                                                <div key={bowler.index} class="rca-row">
                                                    <div class="rca-table">
                                                        <div class="rca-col rca-player">
                                                            {bowler.name}
                                                        </div>
                                                        <div class="rca-col">
                                                            {bowler.totalOvers}
                                                        </div>
                                                        <div class="rca-col">
                                                            {bowler.maiden}
                                                        </div>
                                                        <div class="rca-col">
                                                            {bowler.runsGiven}
                                                        </div>
                                                        <div class="rca-col">
                                                            {bowler.wicketsTaken}
                                                        </div>
                                                        <div class="rca-col">
                                                            {bowler.economy}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        });
                                        return bowlerJsx;
                                    })()
                                }
                                <div class="rca-clear"></div>
                            </div>
                        </div>
                    </TabPanel>
                </TabView>
            </>
        )
    } else {
        return <div style={{ fontSize: '40px', padding: '85px', textAlign: 'center' }}>Inning Yet To Start</div>
    }
}

export default InningDetails
