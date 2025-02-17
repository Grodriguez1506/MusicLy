import { Router } from "express";
import playlistController from "../controllers/playlist.js";
import auth from "../middlewares/auth.js";
import { userAccess } from "../middlewares/role.access.js";
import multer from "multer";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "./uploads/playlistCover");
  },
  filename: (req, file, cb) => {
    const original = file.originalname.split(".");
    const filename = `${original[0]}-${Date.now()}-${Math.round(
      Math.random() * 1e4
    )}.${original[original.length - 1]}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

router.post(
  "/save",
  [auth, userAccess, upload.single("image")],
  playlistController.save
);
router.delete("/remove/:id?", [auth, userAccess], playlistController.remove);
router.put("/edit/:id?", [auth, userAccess], playlistController.edit);
router.post("/add-song/:id?", [auth, userAccess], playlistController.addSong);
router.get("/list", [auth, userAccess], playlistController.list);
router.get("/one/:id?", [auth, userAccess], playlistController.one);
router.get("/cover/:id?", [auth, userAccess], playlistController.cover);

export default router;
