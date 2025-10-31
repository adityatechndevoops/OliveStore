<<<<<<< HEAD
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
=======
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3'); // A helper to pipe multer directly to S3
require('dotenv').config();

// --- Configure AWS S3 ---
const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// --- Configure multer-s3 ---
// This middleware will handle the upload and send it to S3 automatically
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    
    // Set content-type automatically
    contentType: multerS3.AUTO_CONTENT_TYPE,
    
    // Set public-read ACL so files can be viewed
    acl: 'public-read', 
    
    // Create a unique filename
    key: function (req, file, cb) {
      // We can organize files by store ID and date
      // req.params.id will be the store ID from the route
      const folder = `stores/${req.params.id}`;
      const filename = `${folder}/${Date.now()}_${file.originalname}`;
      cb(null, filename);
    },
  }),
  
  // Optional: File filtering (e.g., only allow images/PDFs)
  fileFilter: function (req, file, cb) {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/pdf') {
>>>>>>> 7c51e59a64d0d19f689ff30dbbdbe47e8a654323
      cb(null, true);
    } else {
      cb(new Error('Invalid file type, only JPEG, PNG, or PDF is allowed!'), false);
    }
  },
<<<<<<< HEAD
=======
  
  // Optional: File size limit (e.g., 5MB)
>>>>>>> 7c51e59a64d0d19f689ff30dbbdbe47e8a654323
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = upload;