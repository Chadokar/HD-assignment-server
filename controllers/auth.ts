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

const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({
      email,
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (!user.password) {
      res.status(400).json({ message: "Invalid password" });
      return;
    }

    const isMatch = await compareHash(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid password" });
      return;
    }

    const token = generateJWT({ id: user._id });
    res.json({ user, token });
  } catch (error) {
    next(error);
  }
};

const signInOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ message: "Email required" });
      return;
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
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
const verifyOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { otp, token } = req.body;
    const decoded: any = verifyJWT(token);

    if (!decoded || decoded.otp !== otp) {
      res.status(401).json({ message: "Invalid or expired OTP" });
      return;
    }

    const user = await UserModel.findOne({ email: decoded.email });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const jwtToken = generateJWT({ id: user._id }, { expiresIn: "1d" });
    res.json({ user, token: jwtToken });
  } catch (error) {
    next(error);
  }
};

const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
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
): Promise<void> => {
  try {
    const { token, otp } = req.body;
    // Verify token and OTP logic
    const decoded: any = verifyJWT(token);

    if (!decoded || decoded.otp !== otp) {
      res.status(401).json({ message: "Invalid or expired OTP" });
      return;
    }
    const user = await UserModel.findById(decoded.id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const jwtToken = generateJWT({ id: user._id });
    res.json({ user, token: jwtToken });
  } catch (error) {
    next(error);
  }
};

const savePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.findByIdAndUpdate(req.body.user.id, {
      password: hashedPassword,
    });
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserModel.findById(req.body.user.id);
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

export {
  signIn,
  signInOtp,
  verifyOtp,
  signUp,
  signUpVerify,
  savePassword,
  getUser,
};
