const { cloudinary } = require("../config/cloudinary");
const { Machine } = require("../models/models");

async function uploadParsedData(data) {
  let id = 0;
  const result = data.reduce(async (prevPromise, nextMachine) => {
    const { country, category, model, event } = nextMachine;
    await prevPromise;
    id++;
    console.log(id);
    const imageCanBeUploaded = nextMachine.imageUrl.includes("//i.");
    let cloudinaryImageUrl;
    if (imageCanBeUploaded) {
      cloudinaryImageUrl = await uploadCloudinary(nextMachine.imageUrl);
    }
    return Machine.create({
      country,
      category,
      model,
      event,
      eventDate: "blablabla",
      imageUrl: imageCanBeUploaded ? cloudinaryImageUrl : "No available image",
    });
  }, Promise.resolve());
  console.log("/n ## Done uploading data ##/n");
  return result;
}

async function uploadCloudinary(imageUrl) {
  try {
    const data = await cloudinary.uploader.upload(imageUrl, {
      folder: "machines",
      tags: "oryx",
    });
    return data.secure_url;
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = { uploadParsedData };
