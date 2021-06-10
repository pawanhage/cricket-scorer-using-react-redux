import './App.css';
import FullScorecard from './pages/FullScorecard';
import MatchDetails from './pages/MatchDetails';
import UpdateScore from './pages/UpdateScore';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

function App() {
    return (
        <div>
            <div>
                <h1 className="text-align-center">Cricket Scorer</h1>
            </div>
            <div className='App'>
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
    );
}

export default App;
