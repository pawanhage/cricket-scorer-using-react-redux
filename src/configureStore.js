import { combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import matchReducer from './redux';

export const store = createStore(combineReducers({
    match: matchReducer
}), composeWithDevTools())
