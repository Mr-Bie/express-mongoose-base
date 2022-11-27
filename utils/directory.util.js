// Dependencies
const fs = require("fs");
const path = require("path");

// Utils
const logger = require("../services/logger.service");

exports.directoryCreator = (...paths) => {
  fs.exists(path.join(...paths), (exists) => {
    if (!exists)
      fs.mkdir(path.join(...paths), (err) => {
        err
          ? logger.error(err)
          : logger.info(paths.join("/"), " Directory Created!");
      });
  });
};

exports.directoryCreatorSync = async (...paths) => {
  fs.exists(path.join(...paths), (exists) => {
    if (!exists) {
      fs.mkdirSync(path.join(...paths));
      logger.info(paths.join("/"), " Directory Created!");
    }
  });
};

exports.fileCreator = (...paths) => {
  fs.exists(path.join(...paths), (exists) => {
    if (!exists) {
      logger.info("exists: ", exists);
      fs.open(path.join(...paths), "wx", (err) => {
        err ? logger.error(err) : logger.info(paths.join(""), " File Created!");
      });
    }
  });
};

exports.fileCreatorSync = (...paths) => {
  const exists = fs.existsSync(path.join(...paths));
  if (!exists) {
    fs.openSync(path.join(...paths), "wx");
    logger.info(paths.join(...paths), " File Created!");
  }
};

exports.fileCopierSync = (fileToCopy, pathToCopy, force = false) => {
  const fileToCopyExist = fs.existsSync(path.join(fileToCopy));
  if (!fileToCopyExist) return;
  const fileToCreateExist = fs.existsSync(path.join(pathToCopy));
  if (!fileToCreateExist || force) {
    try {
      fs.copyFileSync(path.resolve(fileToCopy), path.resolve(pathToCopy));
      logger.info(`${pathToCopy} File Created From ${fileToCopy}`);
    } catch (err) {
      logger.error(`Error in ${fileToCopy} File Creation From ${pathToCopy}`);
    }
  }
  /*  const exists = fs.existsSync(path.join(...paths));
  if (!exists) {
    fs.openSync(path.join(...paths), "wx");
    logger.info(paths.join("/"), " File Created!");
  }*/
};
