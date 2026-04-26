const express = require("express");
const router = express.Router();

const { deleteAccount, updateUserProfile } = require("../controllers/user");

const upload = require("../utils/multer"); // we will create this

router.delete("/deleteAccount/:uid", deleteAccount);
router.patch("/update-profile/:uid", updateUserProfile);

router.post("/upload-avatar", upload.single("image"), (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      url: req.file.path, // Cloudinary URL
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Image upload failed",
    });
  }
});

module.exports = router;