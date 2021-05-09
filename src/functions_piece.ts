// 軍旗はここでは考慮しない、入力値で補正されているものとする
export const match_pieces = (_piece1: PieceId, _piece2: PieceId): boolean[] => {
  const piece1 = Math.abs(_piece1);
  const piece2 = Math.abs(_piece2);
  if (piece1 === piece2) return [false, false];
  // 相打ち
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
  const remove_river = (posArr: Position[]) => posArr.filter((p) => p[0] !== 4);
  const remove_invalid = (posArr: Position[]) =>
    posArr.filter((p) => {
      if (p[0] % 8 === 0) return p[1] >= 0 && p[1] < 5;
      else return p[1] >= 0 && p[1] < 6;
    });
  const remove_exist_piece = (posArr: Position[]) =>
    posArr.filter((p) => board[p[0]][p[1]] <= 0);

  // 飛行機
  if (piece === 13) {
    const positions = [
      ...[0, 1, 2, 3, 5, 6, 7, 8]
        .map((num) => num !== position[0] && [num, position[1]]) // 上下
        .filter((p) => p), // 自身の場所の取り除き
      [position[0], position[1] + 1], // 右
      [position[0], position[1] - 1], // 左
    ] as Position[];
    // 本拠地による座標ずれの修正
    if (positions[0][0] === 0 && positions[0][1] > 2) {
      positions[0][1]--;
    } else if (positions[1][0] === 8 && positions[1][1] > 2) {
      positions[1][1]--;
    }
    if (
      (position[0] === 0 && position[1] === 2) ||
      (position[0] === 8 && position[1] === 2)
    ) {
      positions.concat([1, 2, 3, 5, 6, 7].map((num) => [num, 3]));
    }
    return remove_exist_piece(remove_invalid(remove_river(positions)));
  }
  // タンク, 騎兵
  else if (piece === 12 || piece === 5) {
    const positions = [
      [position[0] + 2, position[1]], // 上2
      [position[0] + 1, position[1]], // 上1
      [position[0] - 1, position[1]], // 下
      [position[0], position[1] + 1], // 右
      [position[0], position[1] - 1], // 左
    ] as Position[];
    // 橋による座標ずれの修正
    if (positions[0][0] === 4 && positions[0][1] === 1) {
      positions[0] = [3, 1];
    } else if (positions[0][0] === 4 && positions[0][1] === 4) {
      positions[0] = [3, 4];
    } else if (positions[1][0] === 4 && positions[1][1] === 1) {
      positions[0] = [2, 1];
      positions[1] = [3, 1];
    } else if (positions[1][0] === 4 && positions[1][1] === 4) {
      positions[0] = [2, 4];
      positions[1] = [3, 4];
    } else if (positions[2][0] === 4 && positions[2][1] === 1) {
      positions[2] = [5, 1];
    } else if (positions[2][0] === 4 && positions[2][1] === 4) {
      positions[2] = [5, 4];
    }
    // 本拠地による座標ずれの修正
    else if (positions[0][0] === 0 && positions[0][1] > 2) {
      positions[0][1]--;
    } else if (positions[1][0] === 0 && positions[1][1] > 2) {
      positions[1][1]--;
    } else if (positions[2][0] === 8 && positions[2][1] > 2) {
      positions[2][1]--;
    }
    if (position[0] === 0 && position[1] === 2) {
      positions.push([1, 3]);
    } else if (position[0] === 8 && position[1] === 2) {
      positions.push([7, 3]);
      if (board[7][3] === 0) positions.push([6, 3]);
    }
    // 2つ前に進めるかどうか
    if (board[positions[1][0]][positions[1][0]] !== 0) positions.splice(0, 1);
    return remove_exist_piece(remove_invalid(remove_river(positions)));
  }
  // 工兵
  else if (piece === 4) {
    const positions = [];
    // 左
    let candidate = [position[0], position[1]];
    while (1) {
      candidate[1]--;
      if (candidate[1] < 0) break;
      if (board[candidate[0]][candidate[1]] === 0) {
        positions.push(candidate);
      } else break;
    }
    // 右
    candidate = [position[0], position[1]];
    while (1) {
      candidate[1]++;
      if (
        (position[1] % 8 === 0 && candidate[1] > 5) ||
        (position[1] % 8 !== 0 && candidate[1] > 6)
      )
        break;
      if (board[candidate[0]][candidate[1]] === 0) {
        positions.push(candidate);
      } else break;
    }
    // 上
    candidate = [position[0], position[1]];
    while (1) {
      // 未実装
    }
    // 下
    candidate = [position[0], position[1]];
    while (1) {
      // 未実装
    }
  }
  // 軍旗, 地雷
  else if (piece === 2 || piece === 1) {
    return [];
  }
  // 他
  else {
    const positions = [
      [position[0] + 1, position[1]], // 上
      [position[0] - 1, position[1]], // 下
      [position[0], position[1] + 1], // 右
      [position[0], position[1] - 1], // 左
    ] as Position[];
    // 橋による座標ずれの修正
    if (positions[0][0] === 4 && positions[0][1] === 1) {
      positions[0] = [3, 1];
    } else if (positions[0][0] === 4 && positions[0][1] === 4) {
      positions[0] = [3, 4];
    } else if (positions[1][0] === 4 && positions[1][1] === 1) {
      positions[1] = [5, 1];
    } else if (positions[1][0] === 4 && positions[1][1] === 4) {
      positions[1] = [5, 4];
    }
    // 本拠地による座標ずれの修正
    else if (positions[0][0] === 0 && positions[0][1] > 2) {
      positions[0][1]--;
    } else if (positions[1][0] === 8 && positions[1][1] > 2) {
      positions[1][1]--;
    }
    if (position[0] === 0 && position[1] === 2) {
      positions.push([1, 3]);
    } else if (position[0] === 8 && position[1] === 2) {
      positions.push([7, 3]);
    }
    return remove_exist_piece(remove_invalid(remove_river(positions)));
  }
  return [];
};
