import { google } from "googleapis";
import { Request, Response, NextFunction } from "express";
import UserModel from "../models/UserModel";
import { generateJWT } from "../services/misc";

const client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
);

const redirectedUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("entered");
  try {
    const authorizationUrl = client.generateAuthUrl({
      access_type: "offline",
      scope: ["email", "profile"],
      include_granted_scopes: true,
    });
    res.status(200).send({ url: authorizationUrl });
  } catch (error) {
    next(error);
  }
};

const decoder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("query : ", req.query);

    const code = Array.isArray(req.query.code)
      ? req.query.code[0]
      : req.query.code;

    if (typeof code !== "string") {
      return res
        .status(400)
        .json({ message: "Authorization code not provided or invalid" });
    }

    console.log("code : ", code);

    const { tokens } = await client.getToken(code);

    if (!tokens || !tokens.id_token) {
      return res.status(400).json({ message: "Invalid Google token" });
    }

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).json({ message: "Invalid Google token" });
    }

    let user = await UserModel.findOne({
      email: payload.email,
    });
    if (!user) {
      user = await UserModel.create({
        email: payload.email,
        name: payload.name,
      });
    }

    const token = generateJWT({ id: user._id });
    res.json({ user, token });
  } catch (error) {
    next(error);
  }
};

export { redirectedUrl, decoder };
