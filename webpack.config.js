const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Dotenv = require("dotenv-webpack");

module.exports = {
  mode: "development", // Switch to 'production' for production builds
  devtool: "cheap-module-source-map", // Or 'source-map' for better quality
  entry: {
    background: "./src/background/index.ts",
    content: "./src/content/index.tsx",
    // Add other entry points if needed (e.g., options page)
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js", // Output filenames will be popup.js, background.js, etc.
    clean: true, // Clean the dist folder before each build
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  require("@tailwindcss/postcss"), // Use the v4 plugin
                  require("autoprefixer"), // Keep autoprefixer if still desired
                ],
              },
            },
          },
        ],
      },
      // Add loaders for other asset types if needed (e.g., images, fonts)
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
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
    new Dotenv({
      path: "./.env",
      systemvars: true,
    }),
  ],
};
