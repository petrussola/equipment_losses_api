const express = require("express");
const { Machine } = require("../models/models");
const { parseFile } = require("../middleware/parse-file");
const { cloudinaryUpload } = require("../middleware/cloudinary");

const machineRouter = express.Router();

machineRouter.get("/", (req, res) => {
  res.status(200).json({ succesful: true });
});

machineRouter.post(
  "/create",
  [parseFile, cloudinaryUpload],
  (req, res) => {
    const { imageUrl } = req;
    const machine = new Machine({ ...req.body, imageUrl });
    machine
      .save()
      .then((data) => {
        res.status(200).json({ succesful: true, data });
      })
      .catch((error) => {
        res.status(400).json({ succesful: false, error });
      });
  }
);

machineRouter.get("/all", async (req, res) => {
  try {
    const query = Machine.find({});
    const data = await query.exec();
    res.status(200).json({ succesful: true, data });
  } catch (error) {
    res.status(400).json({ succesful: false, error });
  }
});

module.exports = { machineRouter };
