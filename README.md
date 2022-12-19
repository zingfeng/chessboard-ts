# chessboard-ts

Typescript for https://chessboardjs.com/



## How to install

```
npm i chessboard-ts
```



## How to use

```
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

```



### How to test 

```
npm test
or
npx webpack --config webpack.config.test.js
```

Open **test\index.html** to see result


### How to publish next version (for me)

Change version in pakage.json. Read pakage.json for config of npm

```
npm publish
```


