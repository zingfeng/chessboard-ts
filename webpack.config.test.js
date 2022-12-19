const path = require("path");

module.exports = {
  entry: "./src/test.ts",
  output: {
    path: path.resolve(__dirname, "test"),
    filename: "test.js",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".css"],
  },
  mode: "production",
};
