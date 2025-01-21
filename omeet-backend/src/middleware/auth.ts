import { Request } from "express";
import jwt from 'jsonwebtoken'
import User from "../models/user";

interface JwtPayload {
  id: string;
  email: string;
}

interface AuthContext {
  user?: any;
  req: Request
}

export const authMiddleware = async ({ req }: { req: Request }): Promise<AuthContext> => {
  const authHeader = req.headers.authorization;

  if(!authHeader) {
    return { req };
  }

  try {
    const token = authHeader.split('Bearer ')[1];
    if(!token) {
      return { req }
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const user = await User.findById(decoded.id).select('-passsword');

    return {
      user,
      req
    }
  } catch(error) {
    return { req }
  }
}