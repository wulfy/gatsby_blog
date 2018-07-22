import { createStore as reduxCreateStore, combineReducers } from "redux"

import * as reducers from '../reducers';

const initialState = { }

const createStore = () => reduxCreateStore(combineReducers(reducers), initialState)
export default createStore