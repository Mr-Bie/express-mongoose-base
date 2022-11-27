const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const schema = {
  type: "object",
  required: ["email"],
  properties: {
    email: {
      type: "string",
      format: "email",
    },
  },
};

const validate = (email) => {
  const validate = ajv.compile(schema);
  return validate({ email });
};

module.exports = validate;
