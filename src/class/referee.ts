import { copy_board, reverse_board } from "../functions_board";
import { match_pieces, same_position } from "../functions_piece";
import { CPU, Opponent, WSHuman } from "./opponent";

// enum
const RefereeStatus = {
  NO_SET: 0,
  PLAYER_SET: 1,
  OPPONENT_SET: 2,
  BOTH_SET: 3,
} as const;
type RefereeStatus = typeof RefereeStatus[keyof typeof RefereeStatus];

// レフェリークラス
// プレイヤーが駒を動かすと判定を行い、プレイヤーと敵クラスにボード情報を通知する
// 敵クラスからは敵が駒を動かした結果のボード情報を受け取るので、それをプレイヤーに渡す
export class Referee {
  // Property
  board: Board = Array(9)
    .fill(0)
    .map(() => Array(6).fill(0));
  opponent: Opponent;
  state: RefereeStatus = RefereeStatus.NO_SET;
  dispatch: React.Dispatch<Action>;

  // Constructor
  constructor(_type: OpponentType, _dispatch: React.Dispatch<Action>) {
    if (_type === "wshuman") {
      this.opponent = new WSHuman(
        this.returnBoard,
        this.initializationComplete
      );
    } else {
      this.opponent = new CPU(this.returnBoard, this.initializationComplete);
    }
    this.dispatch = _dispatch;
  }

  // プレイヤーが駒を動かしたときに、判定とプレイヤー及び敵へのボード情報の通知を行う
  movePiece = (from_position: Position, to_position: Position): Board => {
    const selected_piece = this.board[from_position[0]][from_position[1]];
    const _opponent_piece = this.board[to_position[0]][to_position[1]];

    // 空きスペースに移動
    if (_opponent_piece === 0) {
      this.board[from_position[0]][from_position[1]] = 0;
      this.board[to_position[0]][to_position[1]] = selected_piece;
    }
    // 戦闘発生
    else if (_opponent_piece < 0) {
      let opponent_piece = 0;
      // 軍旗
      if (_opponent_piece === -2) {
        const behind_square: Position = same_position(to_position, [1, 3])
          ? [0, 2]
          : [to_position[0] - 1, to_position[1]];
        // 最後列にいる
        if (behind_square[0] < 0) {
          opponent_piece = 2;
        }
        // 後ろに味方がいる
        else if (this.board[behind_square[0]][behind_square[1]] < 0) {
          opponent_piece = this.board[behind_square[0]][behind_square[1]];
        }
        // 後ろに敵がいる OR 誰もいない
        else {
          opponent_piece = 2;
        }
      } else {
        opponent_piece = _opponent_piece;
      }
      const match_result = match_pieces(selected_piece, opponent_piece); // [boolean, boolean]
      // プレイヤーが勝つ
      if (match_result[0] && !match_result[1]) {
        this.board[from_position[0]][from_position[1]] = 0;
        this.board[to_position[0]][to_position[1]] = selected_piece;
      }
      // 敵が勝つ
      else if (!match_result[0] && match_result[1]) {
        this.board[from_position[0]][from_position[1]] = 0;
      }
      // 相打ちになる
      else if (!match_result[0] || !match_result[1]) {
        this.board[from_position[0]][from_position[1]] = 0;
        this.board[to_position[0]][to_position[1]] = 0;
      } else {
        // error!
      }
    } else {
      // error!
    }

    // Opponentに反転させたBoard情報を返す
    this.opponent.getBoard(reverse_board(this.board));
    // PlayerにBoard情報を返す
    return this.board;
  };

  // 敵側の駒の初期配置が終わった後に呼び出される
  initializationComplete: BoardHandlerType = (_board: Board) => {
    this.state += RefereeStatus.OPPONENT_SET;
    if (this.state === RefereeStatus.BOTH_SET) {
      this.board = [..._board.slice(0, 4), ...this.board.slice(5)]; // deep copy necessary?
      const board = copy_board(this.board);
      const myturn = true; // プレイヤー側でスタート
      // 敵にボード情報を通知する
      // WebSocketの場合、片側のみがこれを行わないとおかしくなる
      this.opponent.loadBoard(board);
      this.dispatch({ type: "startGame", payload: { board, myturn } });
    } else {
      this.board = _board;
    }
  };

  // プレイヤー側の駒の初期配置が終わったときに呼び出される
  initialize: BoardHandlerType = (_board: Board) => {
    this.state += RefereeStatus.PLAYER_SET;
    if (this.state === RefereeStatus.BOTH_SET) {
      this.board = [...this.board.slice(0, 4), ..._board.slice(5)]; // deep copy necessary?
      const board = copy_board(this.board);
      const myturn = true; // プレイヤー側でスタート
      // 敵にボード情報を通知する
      // WebSocketの場合、片側のみがこれを行わないとおかしくなる
      this.opponent.loadBoard(board);
      this.dispatch({ type: "startGame", payload: { board, myturn } });
    } else {
      this.board = _board;
    }
  };

  // 敵が行動を終了した際に呼び出されるハンドラ
  // プレイヤーのボード情報設置関数を呼び出す
  returnBoard: BoardHandlerType = (board: Board) => {
    this.board = board;
    this.dispatch({ type: "loadBoard", payload: copy_board(board) });
  };
}
