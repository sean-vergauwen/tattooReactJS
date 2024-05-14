import multer from "multer";
import fs from "fs";
import path from "path";

const storage = multer.diskStorage({
  destination: (req: any, file: any, cb) => {
    const userName = req.user.userName;
    const uploadPath = path.join(__dirname, `../Uploads/${userName}`);

    fs.mkdirSync(uploadPath, {
      recursive: true,
    });
    cb(null, uploadPath);
  },

  filename: (req: any, file: any, cb) => {
    const date = Date.now();
    const filename = date + path.extname(file.originalname);
    if (!req.filenames) {
      req.filenames = filename;
    }
    cb(null, filename);
  },
});

const upload = multer({
  fileFilter: (req: any, file: any, cb) => {
    const allowedMimeTypes = ["image/jpg", "image/png", "image/jpeg"];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      //   cb(new Error("Only .png, .jpg, and .jpeg files are allowed"), false);
      cb(new Error("Only .png, .jpg, and .jpeg files are allowed"));
    }
  },
  limits: { fileSize: 10000000 },
  storage: storage,
});

export default upload;
