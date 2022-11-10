import { ChessBoardJS } from "./chessboard/chessboard";
import $ from "jquery";
import "./css/chessboard.css";

interface ChessBoardConfig {
  selector: string;
  config: {
    position?: string;
    draggable?: boolean;
    dropOffBoard?: "snapback" | "trash";
    sparePieces?: boolean;
  };
}
class ChessBoard {
  constructor(config: ChessBoardConfig) {
    const chessBoard = new ChessBoardJS({
      jquery: $,
      selector: "#chessboard",
      config: {
        position: "start",
        draggable: true,
        dropOffBoard: "snapback", // this is the default
      },
    });
    return chessBoard;
  }
}

export { ChessBoard, ChessBoardConfig };
