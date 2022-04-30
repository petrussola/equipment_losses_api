const mongoose = require("mongoose");
const { MachineSchema } = require("./schema");

const Machine = mongoose.model("Machine", MachineSchema);

module.exports = { Machine };
