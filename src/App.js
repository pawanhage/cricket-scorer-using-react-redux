import React, { useState } from 'react';
import './App.scss';
import FullScorecard from './components/FullScorecard';
import MatchDetails from './components/MatchDetails';
import UpdateScore from './components/UpdateScore';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';
import { connect } from 'react-redux';
import { getLiveScore } from './redux';
import ScoreBar from './components/ScoreBar';

function Update({ liveScore }) {
    const [visibleRight, setVisibleRight] = useState(false);
    return (
        <>
            <Sidebar visible={visibleRight} position="right" onHide={() => setVisibleRight(false)}>
                <h2>Update Ball By Ball</h2>
                {<UpdateScore></UpdateScore>}
            </Sidebar>
            <div class="rca-logo rca-powered">
                <h2>
                    <Button onClick={() => setVisibleRight(true)}>
                        <img src="https://d2muumq9nnirye.cloudfront.net/cricketapi/images/api_logo.svg" alt="" style={{ width: "50px" }} />
                        <span><>{liveScore}</><br />(To Update Click Here)</span>
                    </Button>
                </h2>
            </div>
        </>
    )
}

function App({ liveScore }) {

    return (
        <div>
            <div className="rca-container">
                <div className="rca-row">
                    <div className="rca-column-12">
                        <div className="rca-logo">
                            <h2>
                                <span><img src="src/images/logo-01.png" style={{ width: "50px" }} alt="" /></span><span>Cricket Scorer</span>
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="rca-row">
                    <div className="rca-column-12">
                        <div className="rca-mini-widget rca-tab-simple">
                            <div id="rtab-1" className="rca-padding rca-tab-content active">
                                <div className="rca-column-12">
                                    <div className="rca-blog-content">
                                        <div className="rca-padding">
                                            <Router>
                                                <div>
                                                    <Switch>
                                                        <Route exact path="/" component={MatchDetails} />
                                                        <Route path="/full-scorecard" component={FullScorecard} />
                                                        <Route component={MatchDetails} />
                                                    </Switch>
                                                </div>
                                            </Router>
                                        </div>
                                    </div>
                                </div>
                                <div className="rca-clear"></div>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    (() => {
                        if (liveScore !== '') {
                            return <Update liveScore={liveScore}></Update>
                        }
                        return <></>;
                    })()
                }
                <ScoreBar></ScoreBar>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        liveScore: getLiveScore(state.match)
    }
}

export default connect(mapStateToProps, null)(App);
