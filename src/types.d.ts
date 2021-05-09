type Mode = "READY" | "PLAY" | "GAMESET";

type State = {
  board: Board;
  mode: Mode;
  selected: Position | null;
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
    };

type Board = number[][];
type PieceId = number;
type SquareType = "normal" | "bridge" | "river" | "base";
type Position = [number, number];
