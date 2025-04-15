
import { Router } from "express";
import * as controller from "../controllers/user.controller";
import * as middlewares from '../middlewares/auth.middlewares'
const router:Router = Router();

// đăng ký
router.post("/register", controller.register);
router.post("/login", controller.login);
router.get('/detail',middlewares.requireAuth,controller.detail)
export const userRoutes:Router = router;