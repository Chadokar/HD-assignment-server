import { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../services/misc";

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = verifyJWT(token);
    req.body.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authenticate;
