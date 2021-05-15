import { full_pieces_set } from "./const";

const copy_board = (board: Board): Board => {
  return board.map((line) => [...line]);
};

export const ready_board = (board: Board): boolean => {
  return (
    [0, 1, 2, 3, 4].every((index) => board[index].every((id) => id === 0)) &&
    [5, 6, 7, 8].every((index) => board[index].every((id) => id !== 0))
  );
};

export const change_piece = (board: Board, pos1: Position, pos2: Position) => {
  const new_board = copy_board(board);
  [new_board[pos1[0]][pos1[1]], new_board[pos2[0]][pos2[1]]] = [
    new_board[pos2[0]][pos2[1]],
    new_board[pos1[0]][pos1[1]],
  ];
  return new_board;
};

export const same_position = (pos1: Position | null, pos2: Position | null) => {
  return (
    pos1 !== null && pos2 !== null && pos1[0] === pos2[0] && pos1[1] === pos2[1]
  );
};

const shuffle = ([...array]) => {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const random_board = (): Board => {
  const shuffled_pieces = shuffle(full_pieces_set);
  const ret_board = [
    Array(6).fill(0),
    Array(6).fill(0),
    Array(6).fill(0),
    Array(6).fill(0),
    Array(6).fill(0),
    shuffled_pieces.slice(0, 6),
    shuffled_pieces.slice(6, 12),
    shuffled_pieces.slice(12, 18),
    [...shuffled_pieces.slice(18, 21), 0, ...shuffled_pieces.slice(21, 23)],
  ];
  return ret_board;
};
