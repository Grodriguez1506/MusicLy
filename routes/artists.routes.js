import { Router } from "express";
import artistController from "../controllers/artists.js";
import { artistAccess } from "../middlewares/role.access.js";
import auth from "../middlewares/auth.js";
import multer from "multer";
import path from "path";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "./uploads/avatar");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `artist-avatar-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

router.post("/register", artistController.register);
router.post("/login", artistController.login);
router.get("/profile/:id?", auth, artistController.profile);
router.post(
  "/upload",
  [auth, artistAccess, upload.single("avatar")],
  artistController.uploadAvatar
);
router.post("/logout", artistController.logout);

export default router;
