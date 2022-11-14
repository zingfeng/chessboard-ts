"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChessBoardJS = exports.initial = void 0;
function initial(jquery) {
    var $ = jquery;
    var COLUMNS = "abcdefgh".split("");
    var DEFAULT_DRAG_THROTTLE_RATE = 20;
    var ELLIPSIS = "…";
    var MINIMUM_JQUERY_VERSION = "1.8.3";
    var RUN_ASSERTS = true;
    var START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
    var START_POSITION = fenToObj(START_FEN);
    var DEFAULT_APPEAR_SPEED = 200;
    var DEFAULT_MOVE_SPEED = 200;
    var DEFAULT_SNAPBACK_SPEED = 60;
    var DEFAULT_SNAP_SPEED = 30;
    var DEFAULT_TRASH_SPEED = 100;
    var CSS = {};
    CSS["alpha"] = "alpha-d2270";
    CSS["black"] = "black-3c85d";
    CSS["board"] = "board-b72b1";
    CSS["chessboard"] = "chessboard-63f37";
    CSS["clearfix"] = "clearfix-7da63";
    CSS["highlight1"] = "highlight1-32417";
    CSS["highlight2"] = "highlight2-9c5d2";
    CSS["notation"] = "notation-322f9";
    CSS["numeric"] = "numeric-fc462";
    CSS["piece"] = "piece-417db";
    CSS["row"] = "row-5277c";
    CSS["sparePieces"] = "spare-pieces-7492f";
    CSS["sparePiecesBottom"] = "spare-pieces-bottom-ae20f";
    CSS["sparePiecesTop"] = "spare-pieces-top-4028b";
    CSS["square"] = "square-55d63";
    CSS["white"] = "white-1e1d7";
    function throttle(f, interval, scope) {
        var timeout = 0;
        var shouldFire = false;
        var args = [];
        var handleTimeout = function () {
            timeout = 0;
            if (shouldFire) {
                shouldFire = false;
                fire();
            }
        };
        var fire = function () {
            timeout = window.setTimeout(handleTimeout, interval);
            f.apply(scope, args);
        };
        return function (_args) {
            args = arguments;
            if (!timeout) {
                fire();
            }
            else {
                shouldFire = true;
            }
        };
    }
    function uuid() {
        return "xxxx-xxxx-xxxx-xxxx-xxxx-xxxx-xxxx-xxxx".replace(/x/g, function (c) {
            var r = (Math.random() * 16) | 0;
            return r.toString(16);
        });
    }
    function deepCopy(thing) {
        return JSON.parse(JSON.stringify(thing));
    }
    function parseSemVer(version) {
        var tmp = version.split(".");
        return {
            major: parseInt(tmp[0], 10),
            minor: parseInt(tmp[1], 10),
            patch: parseInt(tmp[2], 10),
        };
    }
    function validSemanticVersion(version, minimum) {
        version = parseSemVer(version);
        minimum = parseSemVer(minimum);
        var versionNum = version.major * 100000 * 100000 + version.minor * 100000 + version.patch;
        var minimumNum = minimum.major * 100000 * 100000 + minimum.minor * 100000 + minimum.patch;
        return versionNum >= minimumNum;
    }
    function interpolateTemplate(str, obj) {
        for (var key in obj) {
            if (!obj.hasOwnProperty(key))
                continue;
            var keyTemplateStr = "{" + key + "}";
            var value = obj[key];
            while (str.indexOf(keyTemplateStr) !== -1) {
                str = str.replace(keyTemplateStr, value);
            }
        }
        return str;
    }
    if (RUN_ASSERTS) {
        console.assert(interpolateTemplate("abc", { a: "x" }) === "abc");
        console.assert(interpolateTemplate("{a}bc", {}) === "{a}bc");
        console.assert(interpolateTemplate("{a}bc", { p: "q" }) === "{a}bc");
        console.assert(interpolateTemplate("{a}bc", { a: "x" }) === "xbc");
        console.assert(interpolateTemplate("{a}bc{a}bc", { a: "x" }) === "xbcxbc");
        console.assert(interpolateTemplate("{a}{a}{b}", { a: "x", b: "y" }) === "xxy");
    }
    function isString(s) {
        return typeof s === "string";
    }
    function isFunction(f) {
        return typeof f === "function";
    }
    function isInteger(n) {
        return typeof n === "number" && isFinite(n) && Math.floor(n) === n;
    }
    function validAnimationSpeed(speed) {
        if (speed === "fast" || speed === "slow")
            return true;
        if (!isInteger(speed))
            return false;
        return speed >= 0;
    }
    function validThrottleRate(rate) {
        return isInteger(rate) && rate >= 1;
    }
    function validMove(move) {
        if (!isString(move))
            return false;
        var squares = move.split("-");
        if (squares.length !== 2)
            return false;
        return validSquare(squares[0]) && validSquare(squares[1]);
    }
    function validSquare(square) {
        return isString(square) && square.search(/^[a-h][1-8]$/) !== -1;
    }
    if (RUN_ASSERTS) {
        console.assert(validSquare("a1"));
        console.assert(validSquare("e2"));
        console.assert(!validSquare("D2"));
        console.assert(!validSquare("g9"));
        console.assert(!validSquare("a"));
        console.assert(!validSquare(true));
        console.assert(!validSquare(null));
        console.assert(!validSquare({}));
    }
    function validPieceCode(code) {
        return isString(code) && code.search(/^[bw][KQRNBP]$/) !== -1;
    }
    if (RUN_ASSERTS) {
        console.assert(validPieceCode("bP"));
        console.assert(validPieceCode("bK"));
        console.assert(validPieceCode("wK"));
        console.assert(validPieceCode("wR"));
        console.assert(!validPieceCode("WR"));
        console.assert(!validPieceCode("Wr"));
        console.assert(!validPieceCode("a"));
        console.assert(!validPieceCode(true));
        console.assert(!validPieceCode(null));
        console.assert(!validPieceCode({}));
    }
    function validFen(fen) {
        if (!isString(fen))
            return false;
        fen = fen.replace(/ .+$/, "");
        fen = expandFenEmptySquares(fen);
        var chunks = fen.split("/");
        if (chunks.length !== 8)
            return false;
        for (var i = 0; i < 8; i++) {
            if (chunks[i].length !== 8 ||
                chunks[i].search(/[^kqrnbpKQRNBP1]/) !== -1) {
                return false;
            }
        }
        return true;
    }
    if (RUN_ASSERTS) {
        console.assert(validFen(START_FEN));
        console.assert(validFen("8/8/8/8/8/8/8/8"));
        console.assert(validFen("r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R"));
        console.assert(validFen("3r3r/1p4pp/2nb1k2/pP3p2/8/PB2PN2/p4PPP/R4RK1 b - - 0 1"));
        console.assert(!validFen("3r3z/1p4pp/2nb1k2/pP3p2/8/PB2PN2/p4PPP/R4RK1 b - - 0 1"));
        console.assert(!validFen("anbqkbnr/8/8/8/8/8/PPPPPPPP/8"));
        console.assert(!validFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/"));
        console.assert(!validFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBN"));
        console.assert(!validFen("888888/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"));
        console.assert(!validFen("888888/pppppppp/74/8/8/8/PPPPPPPP/RNBQKBNR"));
        console.assert(!validFen({}));
    }
    function validPositionObject(pos) {
        if (!$.isPlainObject(pos))
            return false;
        for (var i in pos) {
            if (!pos.hasOwnProperty(i))
                continue;
            if (!validSquare(i) || !validPieceCode(pos[i])) {
                return false;
            }
        }
        return true;
    }
    if (RUN_ASSERTS) {
        console.assert(validPositionObject(START_POSITION));
        console.assert(validPositionObject({}));
        console.assert(validPositionObject({ e2: "wP" }));
        console.assert(validPositionObject({ e2: "wP", d2: "wP" }));
        console.assert(!validPositionObject({ e2: "BP" }));
        console.assert(!validPositionObject({ y2: "wP" }));
        console.assert(!validPositionObject(null));
        console.assert(!validPositionObject("start"));
        console.assert(!validPositionObject(START_FEN));
    }
    function isTouchDevice() {
        return "ontouchstart" in document.documentElement;
    }
    function validJQueryVersion() {
        return (typeof window.$ &&
            $.fn &&
            $.fn.jquery &&
            validSemanticVersion($.fn.jquery, MINIMUM_JQUERY_VERSION));
    }
    function fenToPieceCode(piece) {
        if (piece.toLowerCase() === piece) {
            return "b" + piece.toUpperCase();
        }
        return "w" + piece.toUpperCase();
    }
    function pieceCodeToFen(piece) {
        var pieceCodeLetters = piece.split("");
        if (pieceCodeLetters[0] === "w") {
            return pieceCodeLetters[1].toUpperCase();
        }
        return pieceCodeLetters[1].toLowerCase();
    }
    function fenToObj(fen) {
        if (!validFen(fen))
            return false;
        fen = fen.replace(/ .+$/, "");
        var rows = fen.split("/");
        var position = {};
        var currentRow = 8;
        for (var i = 0; i < 8; i++) {
            var row = rows[i].split("");
            var colIdx = 0;
            for (var j = 0; j < row.length; j++) {
                if (row[j].search(/[1-8]/) !== -1) {
                    var numEmptySquares = parseInt(row[j], 10);
                    colIdx = colIdx + numEmptySquares;
                }
                else {
                    var square = COLUMNS[colIdx] + currentRow;
                    position[square] = fenToPieceCode(row[j]);
                    colIdx = colIdx + 1;
                }
            }
            currentRow = currentRow - 1;
        }
        return position;
    }
    function objToFen(obj) {
        if (!validPositionObject(obj))
            return false;
        var fen = "";
        var currentRow = 8;
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                var square = COLUMNS[j] + currentRow;
                if (obj.hasOwnProperty(square)) {
                    fen = fen + pieceCodeToFen(obj[square]);
                }
                else {
                    fen = fen + "1";
                }
            }
            if (i !== 7) {
                fen = fen + "/";
            }
            currentRow = currentRow - 1;
        }
        fen = squeezeFenEmptySquares(fen);
        return fen;
    }
    if (RUN_ASSERTS) {
        console.assert(objToFen(START_POSITION) === START_FEN);
        console.assert(objToFen({}) === "8/8/8/8/8/8/8/8");
        console.assert(objToFen({ a2: "wP", b2: "bP" }) === "8/8/8/8/8/8/Pp6/8");
    }
    function squeezeFenEmptySquares(fen) {
        return fen
            .replace(/11111111/g, "8")
            .replace(/1111111/g, "7")
            .replace(/111111/g, "6")
            .replace(/11111/g, "5")
            .replace(/1111/g, "4")
            .replace(/111/g, "3")
            .replace(/11/g, "2");
    }
    function expandFenEmptySquares(fen) {
        return fen
            .replace(/8/g, "11111111")
            .replace(/7/g, "1111111")
            .replace(/6/g, "111111")
            .replace(/5/g, "11111")
            .replace(/4/g, "1111")
            .replace(/3/g, "111")
            .replace(/2/g, "11");
    }
    function squareDistance(squareA, squareB) {
        var squareAArray = squareA.split("");
        var squareAx = COLUMNS.indexOf(squareAArray[0]) + 1;
        var squareAy = parseInt(squareAArray[1], 10);
        var squareBArray = squareB.split("");
        var squareBx = COLUMNS.indexOf(squareBArray[0]) + 1;
        var squareBy = parseInt(squareBArray[1], 10);
        var xDelta = Math.abs(squareAx - squareBx);
        var yDelta = Math.abs(squareAy - squareBy);
        if (xDelta >= yDelta)
            return xDelta;
        return yDelta;
    }
    function findClosestPiece(position, piece, square) {
        var closestSquares = createRadius(square);
        for (var i = 0; i < closestSquares.length; i++) {
            var s = closestSquares[i];
            if (position.hasOwnProperty(s) && position[s] === piece) {
                return s;
            }
        }
        return false;
    }
    function createRadius(square) {
        var squares = [];
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                var s = COLUMNS[i] + (j + 1);
                if (square === s)
                    continue;
                squares.push({
                    square: s,
                    distance: squareDistance(square, s),
                });
            }
        }
        squares.sort(function (a, b) {
            return a.distance - b.distance;
        });
        var surroundingSquares = [];
        for (i = 0; i < squares.length; i++) {
            surroundingSquares.push(squares[i].square);
        }
        return surroundingSquares;
    }
    function calculatePositionFromMoves(position, moves) {
        var newPosition = deepCopy(position);
        for (var i in moves) {
            if (!moves.hasOwnProperty(i))
                continue;
            if (!newPosition.hasOwnProperty(i))
                continue;
            var piece = newPosition[i];
            delete newPosition[i];
            newPosition[moves[i]] = piece;
        }
        return newPosition;
    }
    function buildContainerHTML(hasSparePieces) {
        var html = '<div class="{chessboard}">';
        if (hasSparePieces) {
            html += '<div class="{sparePieces} {sparePiecesTop}"></div>';
        }
        html += '<div class="{board}"></div>';
        if (hasSparePieces) {
            html += '<div class="{sparePieces} {sparePiecesBottom}"></div>';
        }
        html += "</div>";
        return interpolateTemplate(html, CSS);
    }
    function expandConfigArgumentShorthand(config) {
        if (config === "start") {
            config = { position: deepCopy(START_POSITION) };
        }
        else if (validFen(config)) {
            config = { position: fenToObj(config) };
        }
        else if (validPositionObject(config)) {
            config = { position: deepCopy(config) };
        }
        if (!$.isPlainObject(config))
            config = {};
        return config;
    }
    function expandConfig(config) {
        if (config.orientation !== "black")
            config.orientation = "white";
        if (config.showNotation !== false)
            config.showNotation = true;
        if (config.draggable !== true)
            config.draggable = false;
        if (config.dropOffBoard !== "trash")
            config.dropOffBoard = "snapback";
        if (config.sparePieces !== true)
            config.sparePieces = false;
        if (config.sparePieces)
            config.draggable = true;
        if (!config.hasOwnProperty("pieceTheme") ||
            (!isString(config.pieceTheme) && !isFunction(config.pieceTheme))) {
            config.pieceTheme = "img/chesspieces/wikipedia/{piece}.png";
        }
        if (!validAnimationSpeed(config.appearSpeed))
            config.appearSpeed = DEFAULT_APPEAR_SPEED;
        if (!validAnimationSpeed(config.moveSpeed))
            config.moveSpeed = DEFAULT_MOVE_SPEED;
        if (!validAnimationSpeed(config.snapbackSpeed))
            config.snapbackSpeed = DEFAULT_SNAPBACK_SPEED;
        if (!validAnimationSpeed(config.snapSpeed))
            config.snapSpeed = DEFAULT_SNAP_SPEED;
        if (!validAnimationSpeed(config.trashSpeed))
            config.trashSpeed = DEFAULT_TRASH_SPEED;
        if (!validThrottleRate(config.dragThrottleRate))
            config.dragThrottleRate = DEFAULT_DRAG_THROTTLE_RATE;
        return config;
    }
    function checkJQuery() {
        if (!validJQueryVersion()) {
            var errorMsg = "Chessboard Error 1005: Unable to find a valid version of jQuery. " +
                "Please include jQuery " +
                MINIMUM_JQUERY_VERSION +
                " or higher on the page" +
                "\n\n" +
                "Exiting" +
                ELLIPSIS;
            window.alert(errorMsg);
            return false;
        }
        return true;
    }
    function checkContainerArg(containerElOrString) {
        if (containerElOrString === "") {
            var errorMsg1 = "Chessboard Error 1001: " +
                "The first argument to Chessboard() cannot be an empty string." +
                "\n\n" +
                "Exiting" +
                ELLIPSIS;
            window.alert(errorMsg1);
            return false;
        }
        if (isString(containerElOrString) &&
            containerElOrString.charAt(0) !== "#") {
            containerElOrString = "#" + containerElOrString;
        }
        var $container = $(containerElOrString);
        if ($container.length !== 1) {
            var errorMsg2 = "Chessboard Error 1003: " +
                "The first argument to Chessboard() must be the ID of a DOM node, " +
                "an ID query selector, or a single DOM node." +
                "\n\n" +
                "Exiting" +
                ELLIPSIS;
            window.alert(errorMsg2);
            return false;
        }
        return $container;
    }
    function constructor(containerElOrString, config) {
        console.log("constructor", containerElOrString, config);
        if (!checkJQuery())
            return null;
        var $container = checkContainerArg(containerElOrString);
        if (!$container)
            return null;
        config = expandConfigArgumentShorthand(config);
        config = expandConfig(config);
        var $board = null;
        var $draggedPiece = null;
        var $sparePiecesTop = null;
        var $sparePiecesBottom = null;
        var widget = {};
        var boardBorderSize = 2;
        var currentOrientation = "white";
        var currentPosition = {};
        var draggedPiece = null;
        var draggedPieceLocation = null;
        var draggedPieceSource = null;
        var isDragging = false;
        var sparePiecesElsIds = {};
        var squareElsIds = {};
        var squareElsOffsets = {};
        var squareSize = 16;
        function error(code, msg, obj) {
            if (config.hasOwnProperty("showErrors") !== true ||
                config.showErrors === false) {
                return;
            }
            var errorText = "Chessboard Error " + code + ": " + msg;
            if (config.showErrors === "console" &&
                typeof console === "object" &&
                typeof console.log === "function") {
                console.log(errorText);
                if (arguments.length >= 2) {
                    console.log(obj);
                }
                return;
            }
            if (config.showErrors === "alert") {
                if (obj) {
                    errorText += "\n\n" + JSON.stringify(obj);
                }
                window.alert(errorText);
                return;
            }
            if (isFunction(config.showErrors)) {
                config.showErrors(code, msg, obj);
            }
        }
        function setInitialState() {
            currentOrientation = config.orientation;
            if (config.hasOwnProperty("position")) {
                if (config.position === "start") {
                    currentPosition = deepCopy(START_POSITION);
                }
                else if (validFen(config.position)) {
                    currentPosition = fenToObj(config.position);
                }
                else if (validPositionObject(config.position)) {
                    currentPosition = deepCopy(config.position);
                }
                else {
                    error(7263, "Invalid value passed to config.position.", config.position);
                }
            }
        }
        function calculateSquareSize() {
            var containerWidth = parseInt($container.width(), 10);
            if (!containerWidth || containerWidth <= 0) {
                return 0;
            }
            var boardWidth = containerWidth - 1;
            while (boardWidth % 8 !== 0 && boardWidth > 0) {
                boardWidth = boardWidth - 1;
            }
            return boardWidth / 8;
        }
        function createElIds() {
            for (var i = 0; i < COLUMNS.length; i++) {
                for (var j = 1; j <= 8; j++) {
                    var square = COLUMNS[i] + j;
                    squareElsIds[square] = square + "-" + uuid();
                }
            }
            var pieces = "KQRNBP".split("");
            for (i = 0; i < pieces.length; i++) {
                var whitePiece = "w" + pieces[i];
                var blackPiece = "b" + pieces[i];
                sparePiecesElsIds[whitePiece] = whitePiece + "-" + uuid();
                sparePiecesElsIds[blackPiece] = blackPiece + "-" + uuid();
            }
        }
        function buildBoardHTML(orientation) {
            if (orientation !== "black") {
                orientation = "white";
            }
            var html = "";
            var alpha = deepCopy(COLUMNS);
            var row = 8;
            if (orientation === "black") {
                alpha.reverse();
                row = 1;
            }
            var squareColor = "white";
            for (var i = 0; i < 8; i++) {
                html += '<div class="{row}">';
                for (var j = 0; j < 8; j++) {
                    var square = alpha[j] + row;
                    html +=
                        '<div class="{square} ' +
                            CSS[squareColor] +
                            " " +
                            "square-" +
                            square +
                            '" ' +
                            'style="width:' +
                            squareSize +
                            "px;height:" +
                            squareSize +
                            'px;" ' +
                            'id="' +
                            squareElsIds[square] +
                            '" ' +
                            'data-square="' +
                            square +
                            '">';
                    if (config.showNotation) {
                        if ((orientation === "white" && row === 1) ||
                            (orientation === "black" && row === 8)) {
                            html += '<div class="{notation} {alpha}">' + alpha[j] + "</div>";
                        }
                        if (j === 0) {
                            html += '<div class="{notation} {numeric}">' + row + "</div>";
                        }
                    }
                    html += "</div>";
                    squareColor = squareColor === "white" ? "black" : "white";
                }
                html += '<div class="{clearfix}"></div></div>';
                squareColor = squareColor === "white" ? "black" : "white";
                if (orientation === "white") {
                    row = row - 1;
                }
                else {
                    row = row + 1;
                }
            }
            return interpolateTemplate(html, CSS);
        }
        function buildPieceImgSrc(piece) {
            if (isFunction(config.pieceTheme)) {
                return config.pieceTheme(piece);
            }
            if (isString(config.pieceTheme)) {
                return interpolateTemplate(config.pieceTheme, { piece: piece });
            }
            error(8272, "Unable to build image source for config.pieceTheme.");
            return "";
        }
        function buildPieceHTML(piece, hidden, id) {
            var html = '<img src="' + buildPieceImgSrc(piece) + '" ';
            if (isString(id) && id !== "") {
                html += 'id="' + id + '" ';
            }
            html +=
                'alt="" ' +
                    'class="{piece}" ' +
                    'data-piece="' +
                    piece +
                    '" ' +
                    'style="width:' +
                    squareSize +
                    "px;" +
                    "height:" +
                    squareSize +
                    "px;";
            if (hidden) {
                html += "display:none;";
            }
            html += '" />';
            return interpolateTemplate(html, CSS);
        }
        function buildSparePiecesHTML(color) {
            var pieces = ["wK", "wQ", "wR", "wB", "wN", "wP"];
            if (color === "black") {
                pieces = ["bK", "bQ", "bR", "bB", "bN", "bP"];
            }
            var html = "";
            for (var i = 0; i < pieces.length; i++) {
                html += buildPieceHTML(pieces[i], false, sparePiecesElsIds[pieces[i]]);
            }
            return html;
        }
        function animateSquareToSquare(src, dest, piece, completeFn) {
            var $srcSquare = $("#" + squareElsIds[src]);
            var srcSquarePosition = $srcSquare.offset();
            var $destSquare = $("#" + squareElsIds[dest]);
            var destSquarePosition = $destSquare.offset();
            var animatedPieceId = uuid();
            $("body").append(buildPieceHTML(piece, true, animatedPieceId));
            var $animatedPiece = $("#" + animatedPieceId);
            $animatedPiece.css({
                display: "",
                position: "absolute",
                top: srcSquarePosition.top,
                left: srcSquarePosition.left,
            });
            $srcSquare.find("." + CSS.piece).remove();
            function onFinishAnimation1() {
                $destSquare.append(buildPieceHTML(piece));
                $animatedPiece.remove();
                if (isFunction(completeFn)) {
                    completeFn();
                }
            }
            var opts = {
                duration: config.moveSpeed,
                complete: onFinishAnimation1,
            };
            $animatedPiece.animate(destSquarePosition, opts);
        }
        function animateSparePieceToSquare(piece, dest, completeFn) {
            var srcOffset = $("#" + sparePiecesElsIds[piece]).offset();
            var $destSquare = $("#" + squareElsIds[dest]);
            var destOffset = $destSquare.offset();
            var pieceId = uuid();
            $("body").append(buildPieceHTML(piece, true, pieceId));
            var $animatedPiece = $("#" + pieceId);
            $animatedPiece.css({
                display: "",
                position: "absolute",
                left: srcOffset.left,
                top: srcOffset.top,
            });
            function onFinishAnimation2() {
                $destSquare.find("." + CSS.piece).remove();
                $destSquare.append(buildPieceHTML(piece));
                $animatedPiece.remove();
                if (isFunction(completeFn)) {
                    completeFn();
                }
            }
            var opts = {
                duration: config.moveSpeed,
                complete: onFinishAnimation2,
            };
            $animatedPiece.animate(destOffset, opts);
        }
        function doAnimations(animations, oldPos, newPos) {
            if (animations.length === 0)
                return;
            var numFinished = 0;
            function onFinishAnimation3() {
                numFinished = numFinished + 1;
                if (numFinished !== animations.length)
                    return;
                drawPositionInstant();
                if (isFunction(config.onMoveEnd)) {
                    config.onMoveEnd(deepCopy(oldPos), deepCopy(newPos));
                }
            }
            for (var i = 0; i < animations.length; i++) {
                var animation = animations[i];
                if (animation.type === "clear") {
                    $("#" + squareElsIds[animation.square] + " ." + CSS.piece).fadeOut(config.trashSpeed, onFinishAnimation3);
                }
                else if (animation.type === "add" && !config.sparePieces) {
                    $("#" + squareElsIds[animation.square])
                        .append(buildPieceHTML(animation.piece, true))
                        .find("." + CSS.piece)
                        .fadeIn(config.appearSpeed, onFinishAnimation3);
                }
                else if (animation.type === "add" && config.sparePieces) {
                    animateSparePieceToSquare(animation.piece, animation.square, onFinishAnimation3);
                }
                else if (animation.type === "move") {
                    animateSquareToSquare(animation.source, animation.destination, animation.piece, onFinishAnimation3);
                }
            }
        }
        function calculateAnimations(pos1, pos2) {
            pos1 = deepCopy(pos1);
            pos2 = deepCopy(pos2);
            var animations = [];
            var squaresMovedTo = {};
            for (var i in pos2) {
                if (!pos2.hasOwnProperty(i))
                    continue;
                if (pos1.hasOwnProperty(i) && pos1[i] === pos2[i]) {
                    delete pos1[i];
                    delete pos2[i];
                }
            }
            for (i in pos2) {
                if (!pos2.hasOwnProperty(i))
                    continue;
                var closestPiece = findClosestPiece(pos1, pos2[i], i);
                if (closestPiece) {
                    animations.push({
                        type: "move",
                        source: closestPiece,
                        destination: i,
                        piece: pos2[i],
                    });
                    delete pos1[closestPiece];
                    delete pos2[i];
                    squaresMovedTo[i] = true;
                }
            }
            for (i in pos2) {
                if (!pos2.hasOwnProperty(i))
                    continue;
                animations.push({
                    type: "add",
                    square: i,
                    piece: pos2[i],
                });
                delete pos2[i];
            }
            for (i in pos1) {
                if (!pos1.hasOwnProperty(i))
                    continue;
                if (squaresMovedTo.hasOwnProperty(i))
                    continue;
                animations.push({
                    type: "clear",
                    square: i,
                    piece: pos1[i],
                });
                delete pos1[i];
            }
            return animations;
        }
        function drawPositionInstant() {
            $board.find("." + CSS.piece).remove();
            for (var i in currentPosition) {
                if (!currentPosition.hasOwnProperty(i))
                    continue;
                $("#" + squareElsIds[i]).append(buildPieceHTML(currentPosition[i]));
            }
        }
        function drawBoard() {
            $board.html(buildBoardHTML(currentOrientation, squareSize, config.showNotation));
            drawPositionInstant();
            if (config.sparePieces) {
                if (currentOrientation === "white") {
                    $sparePiecesTop.html(buildSparePiecesHTML("black"));
                    $sparePiecesBottom.html(buildSparePiecesHTML("white"));
                }
                else {
                    $sparePiecesTop.html(buildSparePiecesHTML("white"));
                    $sparePiecesBottom.html(buildSparePiecesHTML("black"));
                }
            }
        }
        function setCurrentPosition(position) {
            var oldPos = deepCopy(currentPosition);
            var newPos = deepCopy(position);
            var oldFen = objToFen(oldPos);
            var newFen = objToFen(newPos);
            if (oldFen === newFen)
                return;
            if (isFunction(config.onChange)) {
                config.onChange(oldPos, newPos);
            }
            currentPosition = position;
        }
        function isXYOnSquare(x, y) {
            for (var i in squareElsOffsets) {
                if (!squareElsOffsets.hasOwnProperty(i))
                    continue;
                var s = squareElsOffsets[i];
                if (x >= s.left &&
                    x < s.left + squareSize &&
                    y >= s.top &&
                    y < s.top + squareSize) {
                    return i;
                }
            }
            return "offboard";
        }
        function captureSquareOffsets() {
            squareElsOffsets = {};
            for (var i in squareElsIds) {
                if (!squareElsIds.hasOwnProperty(i))
                    continue;
                squareElsOffsets[i] = $("#" + squareElsIds[i]).offset();
            }
        }
        function removeSquareHighlights() {
            $board
                .find("." + CSS.square)
                .removeClass(CSS.highlight1 + " " + CSS.highlight2);
        }
        function snapbackDraggedPiece() {
            if (draggedPieceSource === "spare") {
                trashDraggedPiece();
                return;
            }
            removeSquareHighlights();
            function complete() {
                drawPositionInstant();
                $draggedPiece.css("display", "none");
                if (isFunction(config.onSnapbackEnd)) {
                    config.onSnapbackEnd(draggedPiece, draggedPieceSource, deepCopy(currentPosition), currentOrientation);
                }
            }
            var sourceSquarePosition = $("#" + squareElsIds[draggedPieceSource]).offset();
            var opts = {
                duration: config.snapbackSpeed,
                complete: complete,
            };
            $draggedPiece.animate(sourceSquarePosition, opts);
            isDragging = false;
        }
        function trashDraggedPiece() {
            removeSquareHighlights();
            var newPosition = deepCopy(currentPosition);
            delete newPosition[draggedPieceSource];
            setCurrentPosition(newPosition);
            drawPositionInstant();
            $draggedPiece.fadeOut(config.trashSpeed);
            isDragging = false;
        }
        function dropDraggedPieceOnSquare(square) {
            removeSquareHighlights();
            var newPosition = deepCopy(currentPosition);
            delete newPosition[draggedPieceSource];
            newPosition[square] = draggedPiece;
            setCurrentPosition(newPosition);
            var targetSquarePosition = $("#" + squareElsIds[square]).offset();
            function onAnimationComplete() {
                drawPositionInstant();
                $draggedPiece.css("display", "none");
                if (isFunction(config.onSnapEnd)) {
                    config.onSnapEnd(draggedPieceSource, square, draggedPiece);
                }
            }
            var opts = {
                duration: config.snapSpeed,
                complete: onAnimationComplete,
            };
            $draggedPiece.animate(targetSquarePosition, opts);
            isDragging = false;
        }
        function beginDraggingPiece(source, piece, x, y) {
            if (isFunction(config.onDragStart) &&
                config.onDragStart(source, piece, deepCopy(currentPosition), currentOrientation) === false) {
                return;
            }
            isDragging = true;
            draggedPiece = piece;
            draggedPieceSource = source;
            if (source === "spare") {
                draggedPieceLocation = "offboard";
            }
            else {
                draggedPieceLocation = source;
            }
            captureSquareOffsets();
            $draggedPiece.attr("src", buildPieceImgSrc(piece)).css({
                display: "",
                position: "absolute",
                left: x - squareSize / 2,
                top: y - squareSize / 2,
            });
            if (source !== "spare") {
                $("#" + squareElsIds[source])
                    .addClass(CSS.highlight1)
                    .find("." + CSS.piece)
                    .css("display", "none");
            }
        }
        function updateDraggedPiece(x, y) {
            $draggedPiece.css({
                left: x - squareSize / 2,
                top: y - squareSize / 2,
            });
            var location = isXYOnSquare(x, y);
            if (location === draggedPieceLocation)
                return;
            if (validSquare(draggedPieceLocation)) {
                $("#" + squareElsIds[draggedPieceLocation]).removeClass(CSS.highlight2);
            }
            if (validSquare(location)) {
                $("#" + squareElsIds[location]).addClass(CSS.highlight2);
            }
            if (isFunction(config.onDragMove)) {
                config.onDragMove(location, draggedPieceLocation, draggedPieceSource, draggedPiece, deepCopy(currentPosition), currentOrientation);
            }
            draggedPieceLocation = location;
        }
        function stopDraggedPiece(location) {
            var action = "drop";
            if (location === "offboard" && config.dropOffBoard === "snapback") {
                action = "snapback";
            }
            if (location === "offboard" && config.dropOffBoard === "trash") {
                action = "trash";
            }
            if (isFunction(config.onDrop)) {
                var newPosition = deepCopy(currentPosition);
                if (draggedPieceSource === "spare" && validSquare(location)) {
                    newPosition[location] = draggedPiece;
                }
                if (validSquare(draggedPieceSource) && location === "offboard") {
                    delete newPosition[draggedPieceSource];
                }
                if (validSquare(draggedPieceSource) && validSquare(location)) {
                    delete newPosition[draggedPieceSource];
                    newPosition[location] = draggedPiece;
                }
                var oldPosition = deepCopy(currentPosition);
                var result = config.onDrop(draggedPieceSource, location, draggedPiece, newPosition, oldPosition, currentOrientation);
                if (result === "snapback" || result === "trash") {
                    action = result;
                }
            }
            if (action === "snapback") {
                snapbackDraggedPiece();
            }
            else if (action === "trash") {
                trashDraggedPiece();
            }
            else if (action === "drop") {
                dropDraggedPieceOnSquare(location);
            }
        }
        widget.clear = function (useAnimation) {
            widget.position({}, useAnimation);
        };
        widget.destroy = function () {
            $container.html("");
            $draggedPiece.remove();
            $container.unbind();
        };
        widget.fen = function () {
            return widget.position("fen");
        };
        widget.flip = function () {
            return widget.orientation("flip");
        };
        widget.move = function () {
            if (arguments.length === 0)
                return;
            var useAnimation = true;
            var moves = {};
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] === false) {
                    useAnimation = false;
                    continue;
                }
                if (!validMove(arguments[i])) {
                    error(2826, "Invalid move passed to the move method.", arguments[i]);
                    continue;
                }
                var tmp = arguments[i].split("-");
                moves[tmp[0]] = tmp[1];
            }
            var newPos = calculatePositionFromMoves(currentPosition, moves);
            widget.position(newPos, useAnimation);
            return newPos;
        };
        widget.orientation = function (arg) {
            if (arguments.length === 0) {
                return currentOrientation;
            }
            if (arg === "white" || arg === "black") {
                currentOrientation = arg;
                drawBoard();
                return currentOrientation;
            }
            if (arg === "flip") {
                currentOrientation = currentOrientation === "white" ? "black" : "white";
                drawBoard();
                return currentOrientation;
            }
            error(5482, "Invalid value passed to the orientation method.", arg);
        };
        widget.position = function (position, useAnimation) {
            if (arguments.length === 0) {
                return deepCopy(currentPosition);
            }
            if (isString(position) && position.toLowerCase() === "fen") {
                return objToFen(currentPosition);
            }
            if (isString(position) && position.toLowerCase() === "start") {
                position = deepCopy(START_POSITION);
            }
            if (validFen(position)) {
                position = fenToObj(position);
            }
            if (!validPositionObject(position)) {
                error(6482, "Invalid value passed to the position method.", position);
                return;
            }
            if (useAnimation !== false)
                useAnimation = true;
            if (useAnimation) {
                var animations = calculateAnimations(currentPosition, position);
                doAnimations(animations, currentPosition, position);
                setCurrentPosition(position);
            }
            else {
                setCurrentPosition(position);
                drawPositionInstant();
            }
        };
        widget.resize = function () {
            squareSize = calculateSquareSize();
            $board.css("width", squareSize * 8 + "px");
            $draggedPiece.css({
                height: squareSize,
                width: squareSize,
            });
            if (config.sparePieces) {
                $container
                    .find("." + CSS.sparePieces)
                    .css("paddingLeft", squareSize + boardBorderSize + "px");
            }
            drawBoard();
        };
        widget.start = function (useAnimation) {
            widget.position("start", useAnimation);
        };
        function stopDefault(evt) {
            evt.preventDefault();
        }
        function mousedownSquare(evt) {
            if (!config.draggable)
                return;
            var square = $(this).attr("data-square");
            if (!validSquare(square))
                return;
            if (!currentPosition.hasOwnProperty(square))
                return;
            beginDraggingPiece(square, currentPosition[square], evt.pageX, evt.pageY);
        }
        function touchstartSquare(e) {
            if (!config.draggable)
                return;
            var square = $(this).attr("data-square");
            if (!validSquare(square))
                return;
            if (!currentPosition.hasOwnProperty(square))
                return;
            e = e.originalEvent;
            beginDraggingPiece(square, currentPosition[square], e.changedTouches[0].pageX, e.changedTouches[0].pageY);
        }
        function mousedownSparePiece(evt) {
            if (!config.sparePieces)
                return;
            var piece = $(this).attr("data-piece");
            beginDraggingPiece("spare", piece, evt.pageX, evt.pageY);
        }
        function touchstartSparePiece(e) {
            if (!config.sparePieces)
                return;
            var piece = $(this).attr("data-piece");
            e = e.originalEvent;
            beginDraggingPiece("spare", piece, e.changedTouches[0].pageX, e.changedTouches[0].pageY);
        }
        function mousemoveWindow(evt) {
            if (isDragging) {
                updateDraggedPiece(evt.pageX, evt.pageY);
            }
        }
        var throttledMousemoveWindow = throttle(mousemoveWindow, config.dragThrottleRate);
        function touchmoveWindow(evt) {
            if (!isDragging)
                return;
            evt.preventDefault();
            updateDraggedPiece(evt.originalEvent.changedTouches[0].pageX, evt.originalEvent.changedTouches[0].pageY);
        }
        var throttledTouchmoveWindow = throttle(touchmoveWindow, config.dragThrottleRate);
        function mouseupWindow(evt) {
            if (!isDragging)
                return;
            var location = isXYOnSquare(evt.pageX, evt.pageY);
            stopDraggedPiece(location);
        }
        function touchendWindow(evt) {
            if (!isDragging)
                return;
            var location = isXYOnSquare(evt.originalEvent.changedTouches[0].pageX, evt.originalEvent.changedTouches[0].pageY);
            stopDraggedPiece(location);
        }
        function mouseenterSquare(evt) {
            if (isDragging)
                return;
            if (!isFunction(config.onMouseoverSquare))
                return;
            var square = $(evt.currentTarget).attr("data-square");
            if (!validSquare(square))
                return;
            var piece = false;
            if (currentPosition.hasOwnProperty(square)) {
                piece = currentPosition[square];
            }
            config.onMouseoverSquare(square, piece, deepCopy(currentPosition), currentOrientation);
        }
        function mouseleaveSquare(evt) {
            if (isDragging)
                return;
            if (!isFunction(config.onMouseoutSquare))
                return;
            var square = $(evt.currentTarget).attr("data-square");
            if (!validSquare(square))
                return;
            var piece = false;
            if (currentPosition.hasOwnProperty(square)) {
                piece = currentPosition[square];
            }
            config.onMouseoutSquare(square, piece, deepCopy(currentPosition), currentOrientation);
        }
        function addEvents() {
            $("body").on("mousedown mousemove", "." + CSS.piece, stopDefault);
            $board.on("mousedown", "." + CSS.square, mousedownSquare);
            $container.on("mousedown", "." + CSS.sparePieces + " ." + CSS.piece, mousedownSparePiece);
            $board
                .on("mouseenter", "." + CSS.square, mouseenterSquare)
                .on("mouseleave", "." + CSS.square, mouseleaveSquare);
            var $window = $(window);
            $window
                .on("mousemove", throttledMousemoveWindow)
                .on("mouseup", mouseupWindow);
            if (isTouchDevice()) {
                $board.on("touchstart", "." + CSS.square, touchstartSquare);
                $container.on("touchstart", "." + CSS.sparePieces + " ." + CSS.piece, touchstartSparePiece);
                $window
                    .on("touchmove", throttledTouchmoveWindow)
                    .on("touchend", touchendWindow);
            }
        }
        function initDOM() {
            createElIds();
            $container.html(buildContainerHTML(config.sparePieces));
            $board = $container.find("." + CSS.board);
            if (config.sparePieces) {
                $sparePiecesTop = $container.find("." + CSS.sparePiecesTop);
                $sparePiecesBottom = $container.find("." + CSS.sparePiecesBottom);
            }
            var draggedPieceId = uuid();
            $("body").append(buildPieceHTML("wP", true, draggedPieceId));
            $draggedPiece = $("#" + draggedPieceId);
            boardBorderSize = parseInt($board.css("borderLeftWidth"), 10);
            widget.resize();
        }
        setInitialState();
        initDOM();
        addEvents();
        return widget;
    }
    return constructor;
}
exports.initial = initial;
class ChessBoardJS {
    constructor(params) {
        return initial(params.jquery)(params.selector, params.config);
    }
}
exports.ChessBoardJS = ChessBoardJS;
//# sourceMappingURL=origin.js.map