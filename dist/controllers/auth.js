"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.savePassword = exports.signUpVerify = exports.signUp = exports.verifyOtp = exports.signInOtp = exports.signIn = void 0;
const UserModel_1 = __importDefault(require("../models/UserModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const misc_1 = require("../services/misc");
const mailService_1 = require("../services/mailService");
const signIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield UserModel_1.default.findOne({
            email,
        });
        if (!user) {
            throw new Error("User not found");
        }
        if (!user.password) {
            res.status(400).json({ message: "Invalid password" });
            return;
        }
        const isMatch = yield (0, misc_1.compareHash)(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: "Invalid password" });
            return;
        }
        console.log("user : ", user);
        const token = (0, misc_1.generateJWT)({ id: user._id });
        res.json({
            token,
            user: {
                name: user.name,
                email: user.email,
                id: user._id,
                dob: user.dob,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.signIn = signIn;
const signInOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({ message: "Email required" });
            return;
        }
        const user = yield UserModel_1.default.findOne({ email });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const otp = Math.floor(100000 + Math.random() * 900000);
        const token = (0, misc_1.generateJWT)({ email, otp }, { expiresIn: "5m" });
        const replacements = { otp, expiresIn: "5 minutes" };
        const source = (0, mailService_1.templateToHTML)("templates/otp.html");
        const content = (0, misc_1.handlebarsReplacements)({ source, replacements });
        // send otp to user
        yield (0, mailService_1.sendMail)({
            to: email,
            subject: "OTP verification | " + process.env.COMPANY,
            html: content,
        });
        res.status(200).json({ token, message: "OTP sent to your email" });
    }
    catch (error) {
        next(error);
    }
});
exports.signInOtp = signInOtp;
// Verify OTP for sign-in
const verifyOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { otp, token } = req.body;
        const decoded = (0, misc_1.verifyJWT)(token);
        if (!decoded || decoded.otp !== otp) {
            res.status(401).json({ message: "Invalid or expired OTP" });
            return;
        }
        const user = yield UserModel_1.default.findOne({ email: decoded.email });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const jwtToken = (0, misc_1.generateJWT)({ id: user._id }, { expiresIn: "1d" });
        res.json({ user, token: jwtToken });
    }
    catch (error) {
        next(error);
    }
});
exports.verifyOtp = verifyOtp;
const signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, dob, email } = req.body;
        const user = yield UserModel_1.default.findOne({ email });
        if (user) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        // Send OTP to email
        const otp = Math.floor(100000 + Math.random() * 900000);
        const token = (0, misc_1.generateJWT)({ email, name, dob, otp }, { expiresIn: "1d" });
        const replacements = { otp, expiresIn: "5 minutes" };
        const source = (0, mailService_1.templateToHTML)("templates/otp.html");
        const content = (0, misc_1.handlebarsReplacements)({ source, replacements });
        // send otp to user
        yield (0, mailService_1.sendMail)({
            to: email,
            subject: "OTP verification | " + process.env.COMPANY,
            html: content,
        });
        res.json({ token, message: "OTP sent to email" });
    }
    catch (error) {
        next(error);
    }
});
exports.signUp = signUp;
const signUpVerify = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token, otp } = req.body;
        // Verify token and OTP logic
        const decoded = (0, misc_1.verifyJWT)(token);
        console.log("decoded : ", decoded);
        console.log(typeof decoded.otp, " ", typeof otp);
        if (!decoded || decoded.otp !== otp) {
            res.status(401).json({ message: "Invalid or expired OTP" });
            return;
        }
        const { email, name, dob } = decoded;
        const jwtToken = (0, misc_1.generateJWT)({ email, name, dob }, { expiresIn: "1d" });
        res.status(200).json({ token: jwtToken });
    }
    catch (error) {
        next(error);
    }
});
exports.signUpVerify = signUpVerify;
const savePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password, token } = req.body;
        const decoded = (0, misc_1.verifyJWT)(token);
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = yield UserModel_1.default.create({
            name: decoded.name,
            email: decoded.email,
            dob: decoded.dob,
            password: hashedPassword,
        });
        const { name, email, _id: id, dob } = user;
        const jwtToken = (0, misc_1.generateJWT)({ id });
        res.status(201).json({ user: { name, email, id, dob }, token: jwtToken });
    }
    catch (error) {
        next(error);
    }
});
exports.savePassword = savePassword;
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserModel_1.default.findById(req.body.user.id);
        res.json({ user });
    }
    catch (error) {
        next(error);
    }
});
exports.getUser = getUser;
