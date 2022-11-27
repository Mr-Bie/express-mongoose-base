// Dependencies
const winston = require("winston"); /*
const { Mail } = require("winston-mail");*/

// Define your severity levels.
// With them, You can create log files,
// see or hide levels based on the running ENV.
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// This method set the current severity based on
// the current NODE_ENV: show all the log levels
// if the server was run in development mode; otherwise,
// if it was run in production, show only warn and error messages.
const level = () => {
  const env = process.env.NODE_ENV || "development";
  const isDevelopment = env === "development";
  return isDevelopment ? "debug" : "warn";
};

// Define different colors for each level.
// Colors make the log message more visible,
// adding the ability to focus or ignore messages.
const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

// Tell winston that you want to link the colors
// defined above to the severity levels.
winston.addColors(colors);

// Chose the aspect of your log customizing the log format.
const format = winston.format.combine(
  // Add the message timestamp with the preferred format
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  // Define the format of the message showing the timestamp, the level and the message
  winston.format.printf(
    (i) =>
      `${i.level.toString().toUpperCase()} : ${[
        i.timestamp === "timestamp" ? ":" : i.timestamp + " : ",
      ]}'${i.message}'`
  )
);

// Define which transports the logger must use to print out messages.
// In this example, we are using three different transports
const transports = [
  new winston.transports.File({
    filename: "logs/http.log",
    level: "http",
    levelOnly: true,
  }),
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.colorize(),
      winston.format.simple()
    ),
  }),
  new winston.transports.File({
    filename: "logs/info.log",
    level: "info",
    levelOnly: true,
  }),
  new winston.transports.File({
    filename: "logs/error.log",
    level: "warn",
  }),
  new winston.transports.File({
    filename: "logs/error.log",
    level: "error",
    handleRejections: true,
    handleExceptions: true,
  }) /*
  new Mail({
    from: process.env.ERROR_LOG_MAIL_USER,
    to: process.env.ERROR_LOG_MAIL_RECEIVER,
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    username: process.env.ERROR_LOG_MAIL_USER,
    password: process.env.ERROR_LOG_MAIL_PASSWORD,
    level: "error",
  })*/,
  ,
];

// Create the logger instance and export it
// and used to log messages.
module.exports = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});
