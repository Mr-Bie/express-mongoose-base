// Dependencies
const Ajv = require("ajv");
const addFormats = require("ajv-formats");

// Ajv instance
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
require("ajv-errors")(ajv);

module.exports = (schema) => async (req, res, next) => {
  const validate = ajv.compile(schema);
  const valid = await validate(req.body);
  if (!valid)
    return res.error({
      data: validate.errors.map((v) => {
        return { key: v.instancePath || null, message: req.t(v.message) };
      }),
      message: req.t("namespace:body_validation_failed"),
      status: 406,
    });
  next();
};
