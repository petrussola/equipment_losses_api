const express = require("express");
const { Machine } = require("../models/models");
const { parseFile } = require("../middleware/parse-file");
const { multerCsv } = require("../middleware/multer-csv");
const {
  cloudinaryUpload,
  cloudinaryDelete,
} = require("../middleware/cloudinary/cloudinary");
const { parseCsv } = require("../middleware/parse-csv");
const {
  uploadImagesCsvCloudinary,
} = require("../middleware/cloudinary/cloudinary-csv");
const parsedData = require("../parse-content/sample.json");
const { uploadParsedData } = require("../parse-content/upload-parsed-data");

const machineRouter = express.Router();

machineRouter.get("/", (req, res) => {
  res.status(200).json({ successful: true });
});

/////////
// GET //
/////////

machineRouter.get("/all", async (req, res) => {
  try {
    const query = Machine.find({});
    const data = await query.exec();
    res.status(200).json({ successful: true, count: data.length, data });
  } catch (error) {
    res.status(400).json({ successful: false, error });
  }
});

machineRouter.get("/category/all", async (req, res) => {
  try {
    const data = await Machine.aggregate().sortByCount("category");
    res.status(200).json({ successful: true, data });
  } catch (error) {
    res.status(400).json({ successful: false, error });
  }
});

machineRouter.get("/category/:category", async (req, res) => {
  const { category } = req.params;
  try {
    const data = await Machine.find().where("category").all(category).exec();
    res.status(200).json({ successful: true, count: data.length, data });
  } catch (error) {
    debugger;
  }
});

machineRouter.get("/model/:category/:model", async (req, res) => {
  const { category, model } = req.params;
  try {
    const data = await Machine.find()
      .where("category")
      .all(category)
      .where("model", model)
      .exec();
    res.status(200).json({ successful: true, count: data.length, data });
  } catch (error) {
    debugger;
  }
});

machineRouter.get("/country/:country", async (req, res) => {
  const { country } = req.params;
  try {
    const data = await Machine.find().where("country", country);
    res.status(200).json({ successful: true, count: data.length, data });
  } catch (error) {
    res.status(400).json({ successful: false, error });
  }
});

//////////
// POST //
//////////

// create individual machine
machineRouter.post("/create", [parseFile, cloudinaryUpload], (req, res) => {
  const { imageUrl } = req;
  const machine = new Machine({ ...req.body, imageUrl });
  machine
    .save()
    .then((data) => {
      res.status(200).json({ successful: true, data });
    })
    .catch((error) => {
      res.status(400).json({ successful: false, error });
    });
});

// upload images and machines from csv file
machineRouter.post(
  "/csv-upload",
  [multerCsv, parseCsv, uploadImagesCsvCloudinary],
  async (req, res) => {
    const { machinesWithCloudinaryLinks } = req;
    const { rowCount } = req.csv;
    try {
      const data = await Machine.create(machinesWithCloudinaryLinks);
      res.status(200).json({ successful: true, rowsParsed: rowCount, data });
    } catch (error) {
      res.status(400).json({ successful: false, error });
    }
  }
);

// parses data.json file and uploads image to cloudinary and model to mongodb
machineRouter.post("/trigger-parse-data-upload", async (req, res) => {
  try {
    const data = await uploadParsedData(parsedData);
    res.status(200).json({ successful: true, data });
  } catch (error) {
    res.status(400).json({ successful: false, error });
  }
});

/////////
// PUT //
/////////

machineRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { body } = req;
  try {
    const updatedMachine = await Machine.findByIdAndUpdate(id, body, {
      returnDocument: "after",
    });
    res.status(200).json({ successful: true, data: updatedMachine });
  } catch (error) {
    res.status(400).json({ successful: false, error });
  }
});

////////////
// DELETE //
////////////

machineRouter.delete("/delete-all", async (req, res) => {
  try {
    const images = await cloudinaryDelete("machines");
    const data = await Machine.deleteMany();
    res.status(200).json({ successful: true, data, images });
  } catch (error) {
    res.status(400).json({ successful: false, error });
  }
});

module.exports = { machineRouter };
