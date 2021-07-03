import './App.scss';
import FullScorecard from './components/FullScorecard';
import MatchDetails from './components/MatchDetails';
import UpdateScore from './components/UpdateScore';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

function App() {
    return (
        <div>
            <div className="rca-container">
                <div className="rca-row">
                    <div className="rca-column-12">
                        <div className="rca-logo">
                            <h2>
                                <span><img src="src/images/logo-01.png" style={{ width: "50px" }} alt="Logo" /></span><span>Cricket Scorer</span>
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
                                                        <Route path="/update-score" component={UpdateScore} />
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

                <div className="rca-row">
                    <div className="rca-column-8">
                        <ul className="rca-footer">
                            <li>About Us</li>
                            <li>Privacy Policy</li>
                            <li>Feedback</li>
                            <li>Site map</li>
                        </ul>
                    </div>
                    <div className="rca-column-4">
                        <ul className="rca-footer rca-right">
                            <li>© 2016 Yoursite.com, All rights reserved </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default App;
