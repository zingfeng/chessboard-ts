import ChessBoardJS from "./origin.js";
import { chessPiecesImage } from "./pieces";
import { ChessBoardConfig } from "./interface";
import * as $ from "jquery";
import "./style.css";

class ChessBoard {
  constructor(config: ChessBoardConfig) {
    const getPieceTheme = (piece: string) => {
      const color = piece.charAt(0) === "w" ? "white" : "black";
      const type = piece.charAt(1);
      const pieceNames = {
        B: "bishop",
        K: "king",
        N: "knight",
        P: "pawn",
        Q: "queen",
        R: "rook",
      };
      return chessPiecesImage[pieceNames[type]][color];
    };

    const chessBoard = new ChessBoardJS({
      jquery: $,
      selector: config.selector,
      config: {
        ...config.config,
        pieceTheme: getPieceTheme,
      },
    });
    return chessBoard;
  }
}

export default ChessBoard;
