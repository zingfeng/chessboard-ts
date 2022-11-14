"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChessBoard = void 0;
const origin_1 = require("./origin");
const jquery_1 = require("jquery");
require("./css/chessboard.css");
class ChessBoard {
    constructor(config) {
        const chessBoard = new origin_1.ChessBoardJS({
            jquery: jquery_1.default,
            selector: config.selector,
            config: config.config,
        });
        return chessBoard;
    }
}
exports.ChessBoard = ChessBoard;
//# sourceMappingURL=chessboard.js.map