require('dotenv').config();

const http = require("http");
const querystring = require("node:querystring");

if (typeof ReadableStream === 'undefined') {
  global.ReadableStream = require('stream/web').ReadableStream;
}

require("./main.js")