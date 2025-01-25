"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const notes_1 = require("./controllers/notes");
const auth_1 = require("./controllers/auth");
const auth_google_1 = require("./controllers/auth.google");
const validator_1 = __importDefault(require("./services/validator"));
const authMiddleware_1 = __importDefault(require("./middlewares/authMiddleware"));
const router = (0, express_1.Router)();
router.post("/signin", [
    (0, express_validator_1.body)("email", "Email required").isEmail(),
    (0, express_validator_1.body)("password", "Password required").isString(),
], validator_1.default, auth_1.signIn);
router.post("/signin-otp", [(0, express_validator_1.body)("email", "Email required").isEmail()], validator_1.default, auth_1.signInOtp);
router.post("/verify-otp", [(0, express_validator_1.body)("otp", "OTP required").isNumeric()], [(0, express_validator_1.body)("token", "Token required").isString()], validator_1.default, auth_1.verifyOtp);
router.post("/signup", [
    (0, express_validator_1.body)("name", "Name required").isString(),
    (0, express_validator_1.body)("email", "Email required").isEmail(),
    (0, express_validator_1.body)("dob", "Date of birth required").isString(),
], validator_1.default, auth_1.signUp);
router.post("/signup-verify", [
    (0, express_validator_1.body)("otp", "OTP required").isNumeric(),
    (0, express_validator_1.body)("token", "Token required").isString(),
], validator_1.default, auth_1.signUpVerify);
router.post("/save-password", [(0, express_validator_1.body)("password", "Password required").isString()], validator_1.default, auth_1.savePassword);
router.get("/user", [(0, express_validator_1.header)("Authorization", "Token required").isString()], validator_1.default, authMiddleware_1.default, auth_1.getUser);
// Google auth routes
router.get("/google", auth_google_1.decoder);
router.get("/google/redirect", auth_google_1.redirectedUrl);
// Notes routes
router.get("/notes", [(0, express_validator_1.header)("Authorization", "Token required").isString()], validator_1.default, authMiddleware_1.default, notes_1.getNotes);
router.post("/create-note", [(0, express_validator_1.header)("Authorization", "Token required").isString()], [(0, express_validator_1.body)("detail", "Detail required").isString()], validator_1.default, authMiddleware_1.default, notes_1.createNote);
router.delete("/delete-note/:id", [(0, express_validator_1.header)("Authorization", "Token required").isString()], validator_1.default, authMiddleware_1.default, notes_1.deleteNote);
exports.default = router;
