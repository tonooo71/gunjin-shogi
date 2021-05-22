type OpponentType = "cpu" | "wshuman";
type GameType = OpponentType | "debug" | "none";

type Mode = "READY" | "WAITING" | "PLAY" | "GAMESET" | "DEBUG";

type State = {
  board: Board;
  mode: Mode;
  selected: Position | null;
  myturn: boolean;
  candidates: Position[];
};

type Action =
  | {
      type: "changeMode";
      payload: Mode;
    }
  | {
      type: "selectPiece";
      payload: Position | null;
    }
  | {
      type: "setBoard";
      payload: Board;
    }
  | {
      type: "startGame";
      payload: {
        board: Board;
        myturn: boolean;
      };
    }
  | {
      type: "loadBoard2";
      payload: Board;
    }
  | {
      type: "startDebug";
    }
  | {
      type: "setCandidates";
      payload: Position[];
      payload2: Position;
    }
  | {
      type: "loadBoard";
      payload: Board;
    };

type Board = PieceId[][];
type PieceId = number;
type SquareType = "normal" | "bridge" | "river" | "base" | "--base";
type Position = [number, number];
