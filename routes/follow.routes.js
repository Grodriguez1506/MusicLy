import { Router } from "express";
import followControllers from "../controllers/follow.js";
import auth from "../middlewares/auth.js";
import { userAccess } from "../middlewares/role.access.js";

const router = Router();

router.post("/save/:id?", [auth, userAccess], followControllers.save);
router.delete("/unfollow/:id?", [auth, userAccess], followControllers.unfollow);

export default router;
