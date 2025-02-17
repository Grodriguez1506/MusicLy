import { Router } from "express";
import songController from "../controllers/song.js";
import { artistAccess } from "../middlewares/role.access.js";
import auth from "../middlewares/auth.js";
import multer from "multer";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "./uploads/songs");
  },
  filename: (req, file, cb) => {
    const original = file.originalname.split(".");
    const filename = `${original[0]}-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}.${original[original.length - 1]}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

router.post(
  "/save",
  [auth, artistAccess, upload.single("song")],
  songController.save
);
router.put("/edit/:id?", [auth, artistAccess], songController.edit);
router.delete("/remove/:id?", [auth, artistAccess], songController.remove);
router.get("/list/:id?/:page?", auth, songController.list);
router.get("/media/:file?", auth, songController.media);

export default router;
