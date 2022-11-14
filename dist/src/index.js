import { ChessBoardJS } from "./chessboard/chessboard";
import $ from "jquery";
import "./css/chessboard.css";
var ChessBoardConfig = /** @class */ (function () {
    function ChessBoardConfig() {
    }
    return ChessBoardConfig;
}());
var ChessBoard = /** @class */ (function () {
    function ChessBoard(config) {
        var chessBoard = new ChessBoardJS({
            jquery: $,
            selector: config.selector,
            config: config.config,
        });
        return chessBoard;
    }
    return ChessBoard;
}());
export { ChessBoard, ChessBoardConfig };
