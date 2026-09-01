require('dotenv').config();

module.exports = {
  appId: process.env.APPID,

  productName: process.env.APP_NAME,

  directories: {
    output: 'dist'
  },

  files: [
    "main.js",
    "preload.js",
    "model.js",
    "socketManager.js",
    "server/**/*",
    "hospital/build/**/*",
    "build/**/*",
    ".env",
    "node_modules/**/*"
  ],

  asar: true
};