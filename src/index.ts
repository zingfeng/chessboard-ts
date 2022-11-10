import { ChessBoard } from "./chessboard/chessboard";
import $ from "jquery";
import "./css/chessboard.css";

console.log("Hello World");

const chessBoard = new ChessBoard({
  jquery: $,
  selector: "#chessboard",
  config: {
    position: "start",
  },
});
