const express = require("express");

//I18next package configuration
const i18n = require("i18next");
const fs_backend = require("i18next-fs-backend");
const i18Middleware = require("i18next-http-middleware");
const mongoose = require("mongoose");
const path = require("path");

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
    app.use(express.json()); // parse request body as JSON

    // register .env variables
    require("dotenv").config();

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
        console.log("MongoDB connect successfully.");
      })
      .catch((err) => {
        console.error("Connection error", err);
        process.exit();
      });

    // register routes
    require("../routes/index.router")(app);

    // error handler middleware
    app.use(require("./middlewares/errorHandler.middleware"));

    // start server
    const port = process.env.APP_PORT;
    app.listen(port, () => {
      console.log(`server running on port ${port}.`);
    });
  }
}

module.exports = App;