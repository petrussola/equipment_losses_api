const multer = require("multer");

const parseCsv = multer().single("machine-csv");

module.exports = {parseCsv}