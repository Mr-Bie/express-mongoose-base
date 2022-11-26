const express = require("express");
const app = express();

//I18next package configuration
const i18n = require("i18next");
const Backend = require("i18next-http-backend");
const i18Middleware = require("i18next-http-middleware");
/*const i18Backend = require("i18next-fs-backend");*/
i18n
  .use(Backend)
  .init({ backend: { loadPath: "/locales/{{lng}}/{{ns}}.json" } });

app.use(i18Middleware.handle(i18n));
console.log(i18n.t("namespace:LOGIN_SUCCESS"));
app.use(express.json()); // parse request body as JSON

// register .env variables
require("dotenv").config();

// response middleware
app.use(require("./app/middlewares/responseMiddleware"));

// register mongodb
const mongoose = require("mongoose");
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
require("./routes")(app);

// error handler middleware
app.use(require("./app/middlewares/errorHandlerMiddleware"));

// start server
const port = process.env.APP_PORT;
app.listen(port, () => {
  console.log(`server running on port ${port}.`);
});
