type OpponentType = "cpu" | "wshuman";
type GameType = OpponentType | "debug" | "none";

type Mode = "READY" | "WAITING" | "PLAY" | "GAMESET";
type Status = "PLAYING" | "WIN" | "LOSE" | "DRAW";

type State = {
  board: Board;
  mode: Mode;
  selected: Position | null;
  myturn: boolean;
  candidates: Position[];
  status: Status;
};

type Action =
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
      type: "waitingGame";
    }
  | {
      type: "setCandidates";
      payload: Position[];
      payload2: Position;
    }
  | {
      type: "loadBoard";
      payload: {
        board: Board;
        status: Status;
      };
    };

type Board = PieceId[][];
type PieceId = number;
type SquareType = "normal" | "bridge" | "river" | "base" | "--base";
type Position = [number, number];
