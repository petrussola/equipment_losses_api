const { cloudinary } = require("../../config/cloudinary");
const DatauriParser = require("datauri/parser");

const parser = new DatauriParser();

async function cloudinaryUpload(req, res, next) {
  const { buffer } = req.file;
  const test = parser.format(".png", buffer);
  const uri = `data:${test.mimetype};base64,${test.base64}`;
  try {
    const data = await cloudinary.uploader.upload(uri, {
      folder: "machines",
      tags: ["oryx"],
    });
    const res = await cloudinary.uploader.add_tag("oryx", data.public_id);
    req.imageUrl = data.secure_url;
    next();
  } catch (error) {
    res.status(400).json({ succesful: false, error });
  }
}

async function cloudinaryDelete(folderName) {
  return await cloudinary.api.delete_resources_by_tag("oryx");
}

module.exports = { cloudinaryUpload, cloudinaryDelete };
