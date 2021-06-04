import React, { MutableRefObject, useEffect, useReducer, useRef } from "react";
import Board from "./Board";
import Toolbar from "./Toolbar";
import { board_ready_state } from "./const";
import { Referee } from "./class/referee";

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "selectPiece":
      return { ...state, selected: action.payload, candidates: [] };
    case "setBoard":
      return {
        ...state,
        board: action.payload,
        selected: null,
        candidates: [],
      };
    case "startGame":
      return {
        ...state,
        board: action.payload.board,
        mode: "PLAY",
        myturn: action.payload.myturn,
      };
    case "waitingGame":
      return { ...state, selected: null, mode: "WAITING" };
    case "setCandidates": {
      return {
        ...state,
        selected: action.payload2,
        candidates: action.payload,
      };
    }
    case "loadBoard": {
      return {
        ...state,
        board: action.payload.board,
        selected: null,
        myturn: true,
        candidates: [],
        status: action.payload.status,
      };
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
  candidates: [],
  status: "PLAYING",
};

export const GSContext = React.createContext(
  {} as {
    state: State;
    dispatch: React.Dispatch<Action>;
    referee: MutableRefObject<Referee | undefined>;
  }
);

type Props = {
  mode: GameType;
};

const Game: React.FC<Props> = ({ mode }) => {
  const [state, dispatch] = useReducer(reducer, readyState);
  const referee = useRef<Referee>();

  // 初期化
  // レフェリーClassの初期化を行う
  useEffect(() => {
    if (mode === "cpu" || mode === "wshuman") {
      referee.current = new Referee(mode, dispatch);
    }
  }, []);

  return (
    <GSContext.Provider value={{ state, dispatch, referee }}>
      <div className="gs-container">
        <Board />
        <Toolbar />
      </div>
    </GSContext.Provider>
  );
};

export default Game;
