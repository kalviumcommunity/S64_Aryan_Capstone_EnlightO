const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');

// POST /api/upload - upload a single file
router.post('/', upload.single('file'), (req, res) => {
  try {
    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      filePath: `/uploads/${req.file.filename}`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'File upload failed', error: error.message });
  }
});

module.exports = router;