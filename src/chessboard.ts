import { ChessBoardJS } from "./chessboard/chessboard";
import $ from "jquery";
import "./css/chessboard.css";
import { ChessBoardConfig } from "./interface";

class ChessBoard {
  constructor(config: ChessBoardConfig) {
    const chessBoard = new ChessBoardJS({
      jquery: $,
      selector: config.selector,
      config: config.config,
    });
    return chessBoard;
  }
}

export { ChessBoard, ChessBoardConfig };
