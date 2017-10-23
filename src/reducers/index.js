import { combineReducers } from "redux";

const controls = (state = { playing: false, bpm: 220 }, action) => {
  switch (action.type) {
    case "TOGGLE_PLAY":
      return Object.assign({}, state, {
        playing: !state.playing
      });
    case "CHANGE_BPM": {
      return Object.assign({}, state, {
        bpm: action.bpm
      });
    }
    default:
      return state;
  }
};

const main = (
  state = {
    pos: 0,
    pads: [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ]
  },
  action
) => {
  switch (action.type) {
    case "TOGGLE_PAD":
      let pads = [...state.pads];
      let padState = pads[action.row][action.col];
      if (padState === 1) {
        pads[action.row][action.col] = 0;
      } else {
        pads[action.row][action.col] = 1;
      }
      return Object.assign({}, state, { pads });
    default:
      return state;
  }
};

const reducer = combineReducers({
  controls,
  main
});

export default reducer;
