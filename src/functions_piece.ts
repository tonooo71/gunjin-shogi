export const same_position = (pos1: Position, pos2: Position) => {
  return pos1[0] === pos2[0] && pos1[1] === pos2[1];
};

export const valid_position = (pos: Position): boolean =>
  pos[0] >= 0 &&
  pos[0] <= 8 &&
  pos[1] >= 0 &&
  pos[1] <= 5 &&
  !same_position(pos, [0, 3]) &&
  !same_position(pos, [8, 3]);

export const possible_move = (board: Board, pos: Position): boolean =>
  pos[0] !== 4 && board[pos[0]][pos[1]] === 0;

// 軍旗はここでは考慮しない、入力値で補正されているものとする
export const match_pieces = (_piece1: PieceId, _piece2: PieceId): boolean[] => {
  const piece1 = Math.abs(_piece1);
  const piece2 = Math.abs(_piece2);
  // 相打ち
  if (piece1 === piece2) return [false, false];
  else if (piece1 > piece2) {
    let ret = [true, false];
    // スパイは大将に勝つ
    if (piece1 === 16 && piece2 === 3) ret = [false, true];
    // 地雷
    else if (piece1 !== 4 && piece1 !== 13 && piece2 === 1)
      ret = [false, false];
    return ret;
  } else {
    let ret = [false, true];
    // スパイは大将に勝つ
    if (piece1 === 3 && piece2 === 16) ret = [true, false];
    // 地雷
    else if (piece2 !== 4 && piece2 !== 13 && piece1 === 1)
      ret = [false, false];
    return ret;
  }
};

export const possible_square = (
  piece: PieceId,
  board: Board,
  position: Position
): Position[] => {
  const base_replace = (posArr: Position[]): Position[] =>
    posArr.map((p) => {
      if (same_position(p, [0, 3])) return [0, 2];
      else if (same_position(p, [8, 3])) return [8, 2];
      return p;
    });
  const remove_river = (posArr: Position[]) => posArr.filter((p) => p[0] !== 4);
  const remove_invalid = (posArr: Position[]) =>
    posArr.filter((p) => valid_position(p));
  const remove_exist_piece = (posArr: Position[]) =>
    posArr.filter((p) => board[p[0]][p[1]] <= 0);

  // 飛行機
  if (piece === 13) {
    let positions: Position[] = [];
    if (same_position(position, [0, 2]) || same_position(position, [8, 2])) {
      positions = [
        [0, 1],
        [0, 4],
        ...[1, 2, 3, 5, 6, 7].map((num) => [num, 2] as Position),
        ...[1, 2, 3, 5, 6, 7].map((num) => [num, 3] as Position),
        [8, 1],
        [8, 4],
      ];
    } else {
      positions = [
        [position[0], position[1] - 1], // 左
        [position[0], position[1] + 1], // 右
        ...[0, 1, 2, 3, 5, 6, 7, 8].map((num): Position => [num, position[1]]),
      ];
    }
    return remove_exist_piece(
      remove_invalid(remove_river(base_replace(positions)))
    );
  }
  // タンク, 騎兵
  else if (piece === 12 || piece === 5) {
    const positions = [
      [position[0] - 1, position[1]], // 上1
      [position[0] + 1, position[1]], // 下
      [position[0], position[1] - 1], // 左
      [position[0], position[1] + 1], // 右
    ] as Position[];
    if (same_position(position, [8, 2])) {
      if (possible_move(board, [7, 3])) {
        positions.push([7, 3]);
        if (possible_move(board, [6, 3])) positions.push([6, 3]);
      }
    }
    if (same_position(position, [0, 2])) positions.push([1, 3]);
    if (
      same_position(positions[2], [0, 3]) ||
      same_position(positions[2], [8, 3])
    )
      positions[2][1]--;
    if (
      same_position(positions[3], [0, 3]) ||
      same_position(positions[3], [8, 3])
    )
      positions[3][1]++;
    if (
      same_position(positions[0], [3, 1]) ||
      same_position(positions[0], [3, 4])
    ) {
      positions[0][0]--;
    }
    const ahead: Position = [...positions[0]];
    if (valid_position(ahead) && possible_move(board, ahead)) {
      ahead[0]--;
      if (same_position(ahead, [3, 1]) || same_position(ahead, [3, 4]))
        ahead[0]--;
      positions.push(ahead); // 上2
    }
    return remove_exist_piece(
      remove_invalid(remove_river(base_replace(positions)))
    );
  }
  // 工兵
  else if (piece === 4) {
    const positions: Position[] = [];
    // 上
    let candidate: Position = [position[0], position[1]];
    while (1) {
      candidate[0]--;
      if (candidate[0] < 0) break;
      if (candidate[1] !== 1 && candidate[1] !== 4 && candidate[0] === 4) break;
      if (candidate[1] % 3 === 1 && candidate[0] === 4) continue;
      if (possible_move(board, candidate)) {
        positions.push(candidate.slice() as Position);
      } else break;
    }
    if (same_position(position, [8, 2])) {
      candidate = [8, 3];
      while (1) {
        candidate[0]--;
        if (candidate[0] < 5) break;
        if (possible_move(board, candidate)) {
          positions.push(candidate.slice() as Position);
        } else break;
      }
    }
    // 下
    candidate = [position[0], position[1]];
    while (1) {
      candidate[0]++;
      if (candidate[0] > 8) break;
      if (candidate[1] !== 1 && candidate[1] !== 4 && candidate[0] === 4) break;
      if (candidate[1] % 3 === 1 && candidate[0] === 4) continue;
      if (possible_move(board, candidate)) {
        positions.push(candidate.slice() as Position);
      } else break;
    }
    if (same_position(position, [0, 2])) {
      candidate = [0, 3];
      while (1) {
        candidate[0]--;
        if (candidate[0] > 3) break;
        if (possible_move(board, candidate)) {
          positions.push(candidate.slice() as Position);
        } else break;
      }
    }
    // 左
    candidate = [position[0], position[1]];
    while (1) {
      candidate[1]--;
      if (candidate[1] < 0) break;
      if (same_position(candidate, [0, 3]) || same_position(candidate, [8, 3]))
        continue;
      if (possible_move(board, candidate)) {
        positions.push(candidate.slice() as Position);
      } else break;
    }
    // 右
    candidate = [position[0], position[1]];
    while (1) {
      candidate[1]++;
      if (candidate[1] > 6) break;
      if (same_position(candidate, [0, 3]) || same_position(candidate, [8, 3]))
        continue;
      if (possible_move(board, candidate)) {
        positions.push(candidate.slice() as Position);
      } else break;
    }
    //
    return remove_exist_piece(
      remove_invalid(remove_river(base_replace(positions)))
    );
  }
  // 軍旗, 地雷
  else if (piece === 2 || piece === 1) {
    return [];
  }
  // 他
  else {
    const positions = [
      [position[0] - 1, position[1]], // 上
      [position[0] + 1, position[1]], // 下
      [position[0], position[1] - 1], // 左
      [position[0], position[1] + 1], // 右
    ] as Position[];
    if (positions[0][1] % 3 === 1 && positions[0][0] === 4) positions[0][0]--;
    if (positions[1][1] % 3 === 1 && positions[1][0] === 4) positions[1][0]++;
    if (
      same_position(positions[2], [0, 3]) ||
      same_position(positions[2], [8, 3])
    )
      positions[2][1]--;
    if (
      same_position(positions[3], [0, 3]) ||
      same_position(positions[3], [8, 3])
    )
      positions[3][1]++;
    if (same_position(position, [0, 2])) positions.push([1, 3]);
    if (same_position(position, [8, 2])) positions.push([7, 3]);
    return remove_exist_piece(
      remove_invalid(remove_river(base_replace(positions)))
    );
  }
};

export const include_piece = (
  position: Position,
  candidates: Position[]
): boolean => {
  for (let p of candidates) {
    if (position[0] === p[0] && position[1] === p[1]) return true;
  }
  return false;
};
