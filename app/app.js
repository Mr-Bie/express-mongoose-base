const express = require("express");

//I18next package configuration
const i18n = require("i18next");
const fs_backend = require("i18next-fs-backend");
const i18Middleware = require("i18next-http-middleware");
const mongoose = require("mongoose");
const path = require("path");

// Middlewares
const morganMiddleware = require("./middlewares/morgan.middleware");

// Services
const logger = require("../services/logger.service");

class App {
  constructor() {
    this.init();
  }

  async init() {
    const app = express();
    await i18n
      .use(fs_backend)
      .use(i18Middleware.LanguageDetector)
      .init({
        lng: ["fa", "en"],
        fallbackLng: "en",
        ns: ["namespace", "auth"],
        defaultNs: "namespace",
        backend: {
          loadPath: path.join(__dirname, "../locales/{{lng}}/{{ns}}.json"),
        },
      });
    app.use(i18Middleware.handle(i18n));

    // set cors headers
    app.use((req, res, next) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST");
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type,Authorization"
      );
      next();
    });

    app.use(express.json()); // parse request body as JSON

    // response middleware
    app.use(require("./middlewares/response.middleware"));

    // register mongodb
    const mongoUser = process.env.MONGO_DB_USERNAME;
    const mongoPass = process.env.MONGO_DB_PASSWORD;
    const mongoAuth =
      mongoUser &&
      mongoPass &&
      `${process.env.MONGO_DB_USERNAME}:${encodeURIComponent(
        process.env.MONGO_DB_PASSWORD
      )}@`;
    mongoose
      .connect(
        `mongodb://${mongoAuth}${process.env.MONGO_DB_HOST.split(",")
          .map((item) => `${item}:${process.env.MONGO_DB_PORT}`)
          .join(",")}/${process.env.MONGO_DB_DATABASE}`,
        {
          // add mongodb configs here
        }
      )
      .then(() => {
        logger.info("MongoDB connect successfully.");
      })
      .catch((err) => {
        logger.error("Connection error", err);
        process.exit();
      });

    // morgan logger middleware
    app.use(morganMiddleware);

    // register routes
    require("../routes/index.router")(app);

    // error handler middleware
    app.use(require("./middlewares/errorHandler.middleware"));

    // start server
    const port = process.env.APP_PORT;
    app.listen(port, () => {
      logger.info(`server running on port ${port}.`);
    });

    // websocket server
    require("../services/webSocket.service");
  }
}

module.exports = App;
