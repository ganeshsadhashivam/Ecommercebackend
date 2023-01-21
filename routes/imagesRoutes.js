const cloudinary = require("cloudinary");

const router = require("express").router();

router("dotenv").config();

cloudinary.config()({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

router.delete("/:public_id", async (req, res) => {
  const { public_id } = req.params;
  try {
    await cloudinary.Uploader.destroy(public_id);
    res.status(200).send();
  } catch (e) {
    res.status(400).send(e.message);
  }
});

module.exports = router;
