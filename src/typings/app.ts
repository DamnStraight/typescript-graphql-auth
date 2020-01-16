import { Request } from "express";

export interface AuthenticatedUser {
  id: number;
  role: string;
  auth: {
    accessToken: string;
  }
}

export interface AppContext {
  isAuth: boolean;
  currentUser: AuthenticatedUser;
  req: Request;
}