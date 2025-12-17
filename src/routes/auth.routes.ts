import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validationMiddleware } from "../middleware/validation.middleware";
import { SignupDto } from "../dto/SignupDto";
import { LoginDto } from "../dto/LoginDto";

const router = Router();

router.post("/signup",validationMiddleware(SignupDto),AuthController.signup);
router.post("/login",validationMiddleware(LoginDto),AuthController.login);

export default router;
