// Services
const logger = require("../../services/logger.service");

module.exports = (err, req, res, next) => {
  logger.error(err);
  return res.error({}, req.t("internal_server_error"), 500);
};
