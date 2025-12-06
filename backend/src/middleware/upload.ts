import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),        // 🔹 keep in memory
  limits: {
    fileSize: 1024 * 1024,               // 1 MB
  },
});

export default upload;
