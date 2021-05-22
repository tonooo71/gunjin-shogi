import React, {
  MutableRefObject,
  RefObject,
  useEffect,
  useReducer,
  useRef,
} from "react";
import "./styles.scss";
import Board from "./Board";
import Toolbar from "./Toolbar";
import { random_board } from "./functions_board";
import { board_ready_state } from "./const";
import { Referee } from "./class/referee";

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "changeMode":
      return { ...state, mode: action.payload };
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
      return { ...state, selected: null, mode: "WAITING" };
    case "loadBoard2": {
      const board = [
        ...action.payload.slice(0, 4).map((line) => line.map((num) => -num)),
        Array(6).fill(0),
        ...state.board.slice(5, 9),
      ] as Board;
      return { ...state, board, mode: "PLAY", myturn: true };
    }
    case "startDebug": {
      return { ...state, selected: null, mode: "DEBUG" };
    }
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
        board: action.payload,
        selected: null,
        myturn: true,
        candidates: [],
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

  useEffect(() => {
    if (state.mode === "WAITING") {
      const board = random_board().reverse();
      setTimeout(() => dispatch({ type: "loadBoard2", payload: board }), 500);
    }
  }, [state.mode]);

  return (
    <GSContext.Provider value={{ state, dispatch, referee }}>
      <div className="gs-container">
        <Board />
        <Toolbar />

        <span>{`${state.selected}`}</span>
        <span>{`${JSON.stringify(state.candidates)}`}</span>
      </div>
    </GSContext.Provider>
  );
};

export default Game;
