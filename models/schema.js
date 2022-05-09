const mongoose = require("mongoose");
const { Schema } = mongoose;

const MachineSchema = new Schema({
  country: { type: String, required: true, enum: ["ua", "ru"] },
  category: {
    type: String,
    required: true,
    enum: [
      "tank",
      "armoured_fighting_vehicle",
      "infrantry_fighting_vehicle",
      "armoured_personnel_carrier",
      "mrap_vehicle",
      "infantry_mobility_vehicle",
      "command_posts_communications_station",
      "engineering_vehicle_and_equipment",
      "towed_artillery",
      "heavy_mortar",
      "self_propelled_artillery",
      "multiple_rocket_launcher",
      "anti_aircraft_gun",
      "self_propelled_anti_aircraft_gun",
      "surface_to_air_missile_system",
      "radar_and_communication_equipment",
      "jammer_and_deception_system",
      "aircraft",
      "helicopter",
      "uav",
      "naval_ship",
      "logistics_train",
      "truck_vehicle__jeep",
    ],
  },
  model: { type: String, required: true },
  event: [
    {
      type: String,
      required: true,
      enum: [
        "destroyed",
        "captured",
        "abandoned",
        "destroyed by Bayraktar TB2",
        "destroyed by Orion",
        "destroyed by artillery",
        "damaged",
        "sunk",
      ],
    },
  ],
  eventDate: {
    type: String,
    required: true,
  },
  imageUrl: { type: String, required: true },
  additionalInformation: { type: String },
});

module.exports = { MachineSchema };
