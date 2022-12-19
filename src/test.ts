import ChessBoard from "./chessboard";

document.addEventListener("DOMContentLoaded", function (event) {
  console.log("DOM fully loaded");
  const chessboard = new ChessBoard({
    selector: "myBoard",
    config: {
      position: "start",
      draggable: true,
    },
  });
});
