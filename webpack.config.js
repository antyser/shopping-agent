const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  mode: "development", // Switch to 'production' for production builds
  devtool: "cheap-module-source-map", // Or 'source-map' for better quality
  entry: {
    popup: "./src/popup/popup.ts",
    background: "./src/background/index.ts",
    content: "./src/content/index.ts",
    // Add other entry points if needed (e.g., options page)
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js", // Output filenames will be popup.js, background.js, etc.
    clean: true, // Clean the dist folder before each build
  },
  resolve: {
    extensions: [".ts", ".js"], // Resolve these extensions
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"], // Injects CSS into the DOM
      },
      // Add loaders for other asset types if needed (e.g., images, fonts)
    ],
  },
  plugins: [
    // Generates popup.html from template and injects popup.js
    new HtmlWebpackPlugin({
      template: "./src/popup/popup.html",
      filename: "popup.html",
      chunks: ["popup"], // Only include the popup chunk
    }),
    // Copies manifest.json and assets to the dist folder
    new CopyWebpackPlugin({
      patterns: [
        { from: "./src/manifest.json", to: "manifest.json" },
        { from: "./src/assets", to: "assets" }, // Copy everything from src/assets
      ],
    }),
    // Define environment variables (example)
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(
        process.env.NODE_ENV || "development"
      ),
      // Add other environment variables here, e.g., Firebase config
      // 'process.env.FIREBASE_API_KEY': JSON.stringify(process.env.FIREBASE_API_KEY),
    }),
  ],
};
