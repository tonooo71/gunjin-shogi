import React, { useEffect, useReducer } from "react";
import "./styles.scss";
import Board from "./Board";
import Toolbar from "./Toolbar";
import { random_board } from "./functions_board";
import { board_ready_state } from "./const";

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "changeMode":
      return { ...state, mode: action.payload };
    case "selectPiece":
      return { ...state, selected: action.payload };
    case "setBoard":
      return { ...state, board: action.payload, selected: null };
    case "startGame":
      return { ...state, selected: null, mode: "WAITING" };
    case "loadBoard": {
      const board = [
        ...action.payload.slice(0, 4).map((line) => line.map((num) => -num)),
        Array(6).fill(0),
        ...state.board.slice(5, 9),
      ] as Board;
      return { ...state, board, mode: "PLAY", myturn: true };
    }
    default:
      return state;
  }
};

const readyState: State = {
  board: board_ready_state,
  mode: "READY",
  selected: null,
  myturn: true,
};

export const GSContext = React.createContext(
  {} as { state: State; dispatch: React.Dispatch<Action> }
);

const App = () => {
  const [state, dispatch] = useReducer(reducer, readyState);
  useEffect(() => {
    if (state.mode === "WAITING") {
      const board = random_board().reverse();
      setTimeout(() => dispatch({ type: "loadBoard", payload: board }), 500);
    }
  }, [state.mode]);

  return (
    <GSContext.Provider value={{ state, dispatch }}>
      <div className="gs-container">
        <Board />
        <Toolbar />
      </div>
    </GSContext.Provider>
  );
};

export default App;
