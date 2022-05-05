const express = require("express");
const { machineRouter } = require("./machine.js");

const router = express.Router();

router.use("/machine", machineRouter);

module.exports = { router };
