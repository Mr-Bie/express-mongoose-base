//Dependencies
require("dotenv").config();
const path = require("path");

//Utils
const {
  directoryCreator: createDirectory,
  fileCreatorSync: createFile,
  fileCopierSync: copyFile,
} = require("./utils/directory.util");

//Create App needed directories
createDirectory("logs");
createDirectory("files");
createDirectory("public");
copyFile(path.join(__dirname, ".env-example"), path.join(__dirname, ".env"));

new (require("./app/app"))();
