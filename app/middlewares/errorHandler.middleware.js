// Services
const logger = require("../../services/logger.service");

module.exports = (err, req, res, next) => {
  logger.error(err);
  return res.error({
    data: {},
    message: req.t("namespace:internal_server_error"),
    status: 500,
  });
};
