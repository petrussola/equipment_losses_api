const busboy = require("busboy");

function parseFile(req, res, next) {
  try {
    const bb = busboy({ headers: req.headers });
    bb.on("file", (name, file, info) => {
      const { filename, encoding, mimeType } = info;
      console.log(
        `File [${name}]: filename: %j, encoding: %j, mimeType: %j`,
        filename,
        encoding,
        mimeType
      );
      file
        .on("data", (data) => {
          console.log(`File [${name}] got ${data.length} bytes`);
        })
        .on("close", () => {
          console.log(`File [${name}] done`);
        });
    });
    bb.on("close", () => {
      next();
    });
    req.pipe(bb);
  } catch (error) {
    debugger;
  }
}

module.exports = { parseFile };
