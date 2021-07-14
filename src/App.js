import React, { useState } from 'react'
import './App.scss';
import FullScorecard from './components/FullScorecard';
import MatchDetails from './components/MatchDetails';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { getLiveScore } from './redux';
import CurrentScore from './components/CurrentScore';
import UpdateScore from './components/UpdateScore';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';

function App({ liveScore }) {
    const [visibleBottom, setVisibleBottom] = useState(false);

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
                            return (
                                <>
                                    <CurrentScore></CurrentScore>
                                    <div style={{ position: 'fixed', top: '90.7%', right: '2%' }}>
                                        <Button icon="pi pi-pencil" title="Update Inning" onClick={() => setVisibleBottom(true)} className="p-mr-2"></Button>
                                    </div>
                                    <Sidebar visible={visibleBottom} position="bottom" onHide={() => setVisibleBottom(false)}>
                                        <UpdateScore></UpdateScore>
                                    </Sidebar>
                                </>
                            )
                        }
                        return <></>;
                    })()
                }

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
