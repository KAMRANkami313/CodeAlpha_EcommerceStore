import multer from 'multer';
import ApiError from '../utils/ApiError.js';

const storage = multer.memoryStorage();

// Allowed MIME types
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

// Max file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Max number of files per upload
const MAX_FILES = 5;

// Dangerous file extensions that should never be allowed
const BLOCKED_EXTENSIONS = ['.exe', '.bat', '.cmd', '.sh', '.php', '.js', '.html', '.svg', '.xml'];

const fileFilter = (req, file, cb) => {
  // Check MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(new ApiError(400, `Invalid file type: ${file.mimetype}. Only JPEG, PNG, WebP, and GIF images are allowed.`), false);
  }

  // Check file extension for double-extension attacks (e.g., image.exe.png)
  const originalName = file.originalname.toLowerCase();
  const hasBlockedExtension = BLOCKED_EXTENSIONS.some(ext => originalName.includes(ext));
  if (hasBlockedExtension) {
    return cb(new ApiError(400, 'File name contains a blocked extension. Please rename the file.'), false);
  }

  // Verify the file has an image extension
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  const hasImageExtension = imageExtensions.some(ext => originalName.endsWith(ext));
  if (!hasImageExtension) {
    return cb(new ApiError(400, 'File must have a valid image extension (.jpg, .jpeg, .png, .webp, .gif).'), false);
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: MAX_FILES,
  },
});

export default upload;