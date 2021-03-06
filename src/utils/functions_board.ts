import { full_pieces_set } from "./../const";

export const copy_board = (board: Board): Board => {
  return board.map((line) => [...line]);
};

export const ready_board = (board: Board): boolean => {
  return (
    [0, 1, 2, 3, 4].every((index) => board[index].every((id) => id === 0)) &&
    [5, 6, 7].every((index) => board[index].every((id) => id !== 0)) &&
    [0, 1, 2, 4, 5].every((index) => board[8][index] != 0)
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

export const reverse_board = (board: Board): Board => {
  const ret_board: Board = [];
  board.forEach((l) => {
    const nl = l.map((s) => -s);
    ret_board.unshift(nl.reverse());
  });
  if (ret_board[0][3] !== 0)
    [ret_board[0][2], ret_board[0][3]] = [ret_board[0][3], ret_board[0][2]];
  if (ret_board[8][3] !== 0)
    [ret_board[8][2], ret_board[8][3]] = [ret_board[8][3], ret_board[8][2]];
  return ret_board;
};

export const get_board_status = (board: Board): Status => {
  const p_s = [16, 15, 14, 11, 10, 9];
  const o_s = [-16, -15, -14, -11, -10, -9];
  if (p_s.includes(board[0][2])) {
    return "WIN";
  } else if (o_s.includes(board[8][2])) {
    return "LOSE";
  }
  const player_alive = board.flat().some((p) => p_s.includes(p));
  const opponent_alive = board.flat().some((p) => o_s.includes(p));
  if (!player_alive && !opponent_alive) return "DRAW";
  else if (!player_alive) return "LOSE";
  else if (!opponent_alive) return "WIN";
  else return "PLAYING";
};
