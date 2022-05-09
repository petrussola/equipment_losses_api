const csv = require("@fast-csv/parse");
const streamifier = require("streamifier");

async function parseCsv(req, res, next) {
  const { buffer } = req.file;

  const machines = [];

  streamifier
    .createReadStream(buffer)
    .pipe(csv.parse({ headers: true, ignoreEmpty: true }))
    .on("error", (error) => console.log(error))
    .on("data", (row) => {
      machines.push(row);
    })
    .on("end", (rowCount) => {
      req.csv = { machines, rowCount };
      next();
    });
}

module.exports = { parseCsv };
