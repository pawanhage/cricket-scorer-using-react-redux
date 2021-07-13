import React from 'react'
import { TabView, TabPanel } from 'primereact/tabview';
import InningDetails from './InningDetails';
import { connect } from 'react-redux';

function FullScorecard({ innings, currentInningIndex }) {
    return (
        <>
            <TabView activeIndex={currentInningIndex} style={{ fontFamily: "Lato, Verdana, Helvetica, sans-serif" }}>
                {
                    (() => {
                        let inningsJsx = innings.map((inning, index) => {
                            return (
                                <TabPanel key={index} header={"Inning " + (index + 1)}>
                                    <InningDetails inning={inning}></InningDetails>
                                </TabPanel>
                            )
                        });
                        return inningsJsx;
                    })()
                }
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
