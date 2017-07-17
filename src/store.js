import { createStore } from 'redux';
import sequencer from './reducers';

let store = createStore(reducer, { playing: false });

export default store;