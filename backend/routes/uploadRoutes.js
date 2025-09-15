import express from "express";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/upload", upload.single("image"), (req, res) => {
  try {
    res.status(200).json({
      url: req.file.path,
      public_id: req.file.filename,
    });
  } catch (err) {
    res.status(500).json({ error: "Upload failed", details: err.message });
  }
});

export default router;
