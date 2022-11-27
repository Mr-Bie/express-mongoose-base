// Routers
const authRouter = require("./auth.router");

module.exports = (app) => {
  app.get("/health", (req, res) => {
    res.status(222).send({
      result: "ok",
    });
  });

  app.use("/auth", authRouter);
};
