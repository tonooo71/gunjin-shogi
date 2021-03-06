import { random_board, reverse_board } from "../utils/functions_board";

// 敵クラス(というかインターフェース)
export class Opponent {
  // Property
  board: Board = Array(9)
    .fill(0)
    .map(() => Array(6).fill(0));
  returnBoardHandler: BoardHandlerType;
  initializeHandler: BoardHandlerType;

  // Constructor
  constructor(
    returnHandler: BoardHandlerType,
    initializaHandler: BoardHandlerType
  ) {
    this.returnBoardHandler = returnHandler;
    this.initializeHandler = initializaHandler;
  }

  // Method
  // 初期状態のボード情報を受け取る
  loadBoard = (_board: Board) => {
    this.board = _board;
  };
  // プレイヤーからボード情報を受け取る
  // 敵のターン
  getBoard = (_board: Board) => {};
  // プレイヤーにボード情報を返す(予め登録したハンドラを呼び出す)
  returnBoard = () => {
    return this.returnBoardHandler(reverse_board(this.board));
  };
}

// 敵クラスを継承したCPUクラス
//
export class CPU extends Opponent {
  constructor(
    returnHandler: BoardHandlerType,
    initializaHandler: BoardHandlerType
  ) {
    super(returnHandler, initializaHandler);
    // ボード情報の初期化を行う必要がある
    this.board = random_board();
    // ボードに駒を設置したことを通知
    const ret_board = reverse_board(this.board);
    this.initializeHandler(ret_board);
  }

  // LoadBoard = (_board: Board) => {};

  getBoard = (_board: Board) => {
    // ここで渡ってくるボード情報はプレイヤーの駒情報も含んだ完全なものなので、
    // 駒を動かすときのプログラムに渡すときは、プレイヤーの駒情報を隠す必要がある
    // プレイヤーでいうレフェリークラスがない(含む)ので、駒の移動判定も行う必要がある

    // 最後にレフェリークラスにボード情報を返す
    this.board = _board;
    this.returnBoard();
  };

  // returnBoard = () => {};
}

// 敵クラスを継承したWebSocket通信を行うクラス
// WebSocket通信の開始や初期化をここで行うのはおかしい(ボード情報を読み込む前にすべき)ので、
// 要修正かも
export class WSHuman extends Opponent {}
