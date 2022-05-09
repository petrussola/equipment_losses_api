const { cloudinary } = require("../../config/cloudinary");

async function uploadImagesCsvCloudinary(req, res, next) {
  const { machines } = req.csv;
  try {
    const machinePromises = machines.map(async (machine) => {
      const data = await cloudinary.uploader.upload(machine.imageUrl, {
        folder: "machines",
      });
      return { ...machine, imageUrl: data.secure_url };
    });
    const machinesWithCloudinaryLinks = await Promise.all(machinePromises);
    req.machinesWithCloudinaryLinks = machinesWithCloudinaryLinks;
    next();
  } catch (error) {
    res.status(200).json({ successful: false, error });
  }
}

module.exports = { uploadImagesCsvCloudinary };
