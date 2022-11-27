const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const schema = {
  type: "object",
  required: ["field"],
  properties: {
    field: {
      type: "string",
      pattern: "^\\+[1-9]{1}[0-9]{3,14}$",
    },
  },
};

const validate = (field) => {
  const validate = ajv.compile(schema);
  return validate({ field });
};

module.exports = validate;
