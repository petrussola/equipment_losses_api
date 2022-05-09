const multer = require("multer");

const multerCsv = multer().single("machine-csv");

module.exports = {multerCsv}