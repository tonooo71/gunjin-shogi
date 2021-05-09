type Mode = "READY" | "WAITING" | "PLAY" | "GAMESET";

type State = {
  board: Board;
  mode: Mode;
  selected: Position | null;
  myturn: boolean;
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
    }
  | {
      type: "loadBoard";
      payload: Board;
    };

type Board = PieceId[][];
type PieceId = number;
type SquareType = "normal" | "bridge" | "river" | "base";
type Position = [number, number];
