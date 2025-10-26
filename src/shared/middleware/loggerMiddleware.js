"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pino_http_1 = require("pino-http");
var pino_1 = require("pino");
var logger = (0, pino_http_1.pinoHttp)({
    level: process.env.PINO_LOG_LEVEL || 'info',
    formatters: {
        level: function (label) {
            return { level: label.toUpperCase() };
        },
    },
    timestamp: pino_1.default.stdTimeFunctions.isoTime,
});
exports.default = logger;
