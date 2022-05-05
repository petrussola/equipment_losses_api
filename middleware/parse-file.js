const multer = require("multer");

const parseFile = multer().single("machine-file");

module.exports = {parseFile}
