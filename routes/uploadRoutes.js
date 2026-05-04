const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const AdmZip = require('adm-zip');

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp|gif|pdf|ppt|pptx|doc|docx/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Mimetype check can be flaky for office files, so we rely more on extension
  if (extname) {
    return cb(null, true);
  } else {
    cb('Error: Invalid file type!');
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

router.post('/', upload.single('image'), (req, res) => {
  res.send(`/${req.file.path.replace(/\\/g, '/')}`);
});

// New endpoint for PPT extraction
router.post('/extract-ppt', upload.single('ppt'), (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded');

  const filePath = req.file.path;
  const ext = path.extname(req.file.originalname).toLowerCase();

  if (ext !== '.pptx') {
    return res.status(400).send('Only .pptx files are supported for automatic extraction');
  }

  try {
    const zip = new AdmZip(filePath);
    const zipEntries = zip.getEntries();
    const slideImages = [];

    // Look for images in ppt/media
    // PPTX stores images in ppt/media/image1.png, image2.jpeg, etc.
    // They are usually in order of appearance in the slides XML
    // This is a heuristic extraction
    const mediaEntries = zipEntries.filter(entry => 
      entry.entryName.startsWith('ppt/media/') && 
      /\.(png|jpeg|jpg|webp)$/i.test(entry.entryName)
    );

    // Sort by name (image1, image2, etc)
    mediaEntries.sort((a, b) => {
      const numA = parseInt(a.entryName.match(/\d+/)?.[0] || 0);
      const numB = parseInt(b.entryName.match(/\d+/)?.[0] || 0);
      return numA - numB;
    });

    mediaEntries.forEach((entry, index) => {
      const fileName = `slide-img-${Date.now()}-${index}${path.extname(entry.entryName)}`;
      const outPath = path.join('uploads', fileName);
      fs.writeFileSync(outPath, entry.getData());
      slideImages.push(`/uploads/${fileName}`);
    });

    if (slideImages.length === 0) {
      return res.status(400).send('No images found inside the PPTX. Try saving your PPTX with "Optimize for compatibility".');
    }

    res.json(slideImages);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error extracting PPTX');
  }
});

module.exports = router;
