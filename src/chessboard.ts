import { ChessBoardJS } from "./origin";
import { ChessBoardConfig } from "./interface";
import $ from "jquery";
import "./style.css";

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
