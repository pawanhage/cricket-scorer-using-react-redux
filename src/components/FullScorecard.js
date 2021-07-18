import React from 'react'
import { TabView, TabPanel } from 'primereact/tabview';
import InningDetails from './InningDetails';
import { connect } from 'react-redux';
import TotalScoreVsOversLineChart from './TotalScoreVsOversLineChart';
import { YET_TO_START } from '../constants';

function FullScorecard({ innings, currentInningIndex }) {
    return (
        <>
            <TabView activeIndex={currentInningIndex} style={{ fontFamily: "Lato, Verdana, Helvetica, sans-serif" }}>
                {
                    (() => {
                        let inningsJsx = innings.map((inning, index) => {
                            return (
                                <TabPanel key={index} header={"Inning " + (index + 1)}>
                                    <div style={{ maxHeight: '400px' }}>
                                        <InningDetails inning={inning}></InningDetails>
                                    </div>
                                </TabPanel>
                            )
                        });
                        return inningsJsx;
                    })()
                }
                <TabPanel disabled={innings[0].status === YET_TO_START} header="Comparison">
                    <div style={{ maxHeight: '350px', overflowY: 'scroll' }} class="rca-tab-content rca-padding rca-no-top-padding rca-no-bottom-padding active">
                        <TotalScoreVsOversLineChart innings={innings}></TotalScoreVsOversLineChart>
                    </div>
                </TabPanel>
            </TabView>
        </>
    )
}

const mapStateToProps = (state) => {
    return {
        innings: state.match.innings,
        currentInningIndex: state.match.currentInningIndex
    }
}

export default connect(mapStateToProps, null)(FullScorecard)
