import { Request, Response, NextFunction } from "express";
import UserModel from "../models/UserModel";
import bcrypt from "bcrypt";
import {
  compareHash,
  generateJWT,
  handlebarsReplacements,
  verifyJWT,
} from "../services/misc";
import { sendMail, templateToHTML } from "../services/mailService";

const signIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await UserModel.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.password) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const isMatch = await compareHash(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = generateJWT({ id: user._id });
    res.json({ user, token });
  } catch (error) {
    next(error);
  }
};

const signInOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    const token = generateJWT({ email, otp }, { expiresIn: "5m" });
    const replacements = { otp, expiresIn: "5 minutes" };
    const source = templateToHTML("templates/otp.html");
    const content = handlebarsReplacements({ source, replacements });

    // send otp to user
    await sendMail({
      to: email,
      subject: "OTP verification | " + process.env.COMPANY,
      html: content,
    });
    res.status(200).json({ token, message: "OTP sent to your email" });
  } catch (error) {
    next(error);
  }
};

// Verify OTP for sign-in
const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { otp, token } = req.body;
    const decoded: any = verifyJWT(token);

    if (!decoded || decoded.otp !== otp) {
      return res.status(401).json({ message: "Invalid or expired OTP" });
    }

    const user = await UserModel.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const jwtToken = generateJWT({ id: user._id }, { expiresIn: "1d" });
    res.json({ user, token: jwtToken });
  } catch (error) {
    next(error);
  }
};

const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, dob, email } = req.body;
    // Send OTP to email
    const otp = Math.floor(100000 + Math.random() * 900000);
    const token = generateJWT({ email, otp, name, dob }, { expiresIn: "5m" });
    const replacements = { otp, expiresIn: "5 minutes" };
    const source = templateToHTML("templates/otp.html");
    const content = handlebarsReplacements({ source, replacements });

    // send otp to user
    await sendMail({
      to: email,
      subject: "OTP verification | " + process.env.COMPANY,
      html: content,
    });

    res.json({ token, message: "OTP sent to email" });
  } catch (error) {
    next(error);
  }
};

const signUpVerify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token, otp, password } = req.body;
    // Verify token and OTP logic
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
      ...req.body,
      password: hashedPassword,
    });
    const jwtToken = generateJWT({ id: user._id });
    res.json({ user, token: jwtToken });
  } catch (error) {
    next(error);
  }
};

export { signIn, signInOtp, verifyOtp, signUp, signUpVerify };
