import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
  }
  next(); // Continue with the request if no errors
};

export default validate;
