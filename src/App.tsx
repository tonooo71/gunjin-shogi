import React, { useReducer } from "react";
import "./styles.scss";
import Board from "./Board";
import Toolbar from "./Toolbar";

const board_ready_state = [
  [16, 15, 14, 13, 13],
  [12, 12, 11, 10, 9, 8],
  [8, 7, 7, 6, 6, 5],
  [4, 4, 3, 2, 1, 1],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
];

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "changeMode":
      return { ...state, mode: action.payload };
    case "selectPiece":
      return { ...state, selected: action.payload };
    case "setBoard":
      return { ...state, board: action.payload };
    default:
      return state;
  }
};

const readyState: State = {
  board: board_ready_state,
  mode: "READY",
  selected: null,
};

export const GSContext = React.createContext(
  {} as { state: State; dispatch: React.Dispatch<Action> }
);

const App = () => {
  const [state, dispatch] = useReducer(reducer, readyState);
  return (
    <GSContext.Provider value={{ state, dispatch }}>
      <div className="gs-container">
        <Board />
        <Toolbar />
        <div className="gs-debugarea">
          <h4>mode</h4>
          <span>{state.mode}</span>
          <h4>selected</h4>
          <span>{state.selected?.join(", ")}</span>
          <h4>board</h4>
          {state.board.map((v, i) => (
            <span key={i}>{v.join(" ")}</span>
          ))}
        </div>
      </div>
    </GSContext.Provider>
  );
};

export default App;
