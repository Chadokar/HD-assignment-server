import { Router } from "express";
import { body, header } from "express-validator";
import { createNote, deleteNote, getNotes } from "./controllers/notes";
import {
  signIn,
  signInOtp,
  verifyOtp,
  signUp,
  signUpVerify,
  savePassword,
  getUser,
} from "./controllers/auth";
import { redirectedUrl, decoder } from "./controllers/auth.google";
import validator from "./services/validator";
import authenticate from "./middlewares/authMiddleware";
const router = Router();

router.post(
  "/signin",
  [
    body("email", "Email required").isEmail(),
    body("password", "Password required").isString(),
  ],
  validator,
  signIn
);

router.post(
  "/signin-otp",
  [body("email", "Email required").isEmail()],
  validator,
  signInOtp
);

router.post(
  "/verify-otp",
  [body("otp", "OTP required").isNumeric()],
  [body("token", "Token required").isString()],
  validator,
  verifyOtp
);

router.post(
  "/signup",
  [
    body("name", "Name required").isString(),
    body("email", "Email required").isEmail(),
    body("dob", "Date of birth required").isString(),
  ],
  validator,
  signUp
);

router.post(
  "/signup-verify",
  [
    body("otp", "OTP required").isNumeric(),
    body("token", "Token required").isString(),
  ],
  validator,
  signUpVerify
);

router.post(
  "/save-password",
  [body("password", "Password required").isString()],
  validator,
  savePassword
);

router.get(
  "/user",
  [header("Authorization", "Token required").isString()],
  validator,
  authenticate,
  getUser
);

// Google auth routes

router.get("/google", decoder);

router.get("/google/redirect", redirectedUrl);

// Notes routes

router.get(
  "/notes",
  [header("Authorization", "Token required").isString()],
  validator,
  authenticate,
  getNotes
);

router.post(
  "/create-note",
  [header("Authorization", "Token required").isString()],
  [body("detail", "Detail required").isString()],
  validator,
  authenticate,
  createNote
);

router.delete(
  "/delete-note/:id",
  [header("Authorization", "Token required").isString()],
  validator,
  authenticate,
  deleteNote
);

export default router;
