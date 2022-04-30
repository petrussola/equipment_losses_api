const express = require("express");
const { Machine } = require("../models/models");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({ succesful: true });
});

router.post("/add", (req, res) => {
  const machine = new Machine(req.body);
  machine
    .save()
    .then((data) => {
      res.status(200).json({ succesful: true, data });
    })
    .catch((error) => {
      res.status(400).json({ succesful: false, data: error.message });
    });
});

module.exports = { router };
