import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import Handlebars from "handlebars";

const handlebarsReplacements = ({ source, replacements }) => {
  return Handlebars.compile(source)(replacements);
};

const generateJWT = (
  payload: object,
  options: object = { expiresIn: "1d" }
): string => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY as string, options);
};

const parseToken = (req: any): string => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    throw new Error("Token not found");
  }
  return token;
};

const verifyJWT = (token: string): JwtPayload | string => {
  return jwt.verify(token, process.env.JWT_SECRET_KEY as string);
};

const generateHash = async (
  text: string,
  saltRounds: number
): Promise<string> => {
  return await bcrypt.hash(String(text), saltRounds);
};

const compareHash = async (text: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(String(text), hash);
};

export {
  generateHash,
  generateJWT,
  verifyJWT,
  parseToken,
  compareHash,
  handlebarsReplacements,
};
