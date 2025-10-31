const multer = require('multer');

// In-memory storage; controller will upload buffer to Cloudinary
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/png' ||
      file.mimetype === 'application/pdf'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type, only JPEG, PNG, or PDF is allowed!'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = upload;