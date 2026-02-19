const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

router.post('/', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Return the file path (relative to the public directory)
        const fileUrl = `/uploads/${req.file.filename}`;

        res.json({
            message: 'File uploaded successfully',
            url: fileUrl
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Server error during upload' });
    }
});

module.exports = router;
