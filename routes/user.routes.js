import { Router } from "express";
import userController from "../controllers/user.js";
import { userAccess } from "../middlewares/role.access.js";
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
    const filename = `user-avatar-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/profile", auth, userController.profile);
router.post(
  "/upload/avatar",
  [auth, userAccess, upload.single("avatar")],
  userController.uploadAvatar
);
router.post("/logout", userController.logout);

export default router;
