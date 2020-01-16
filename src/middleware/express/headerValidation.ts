import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { AuthenticatedUser } from '../../typings/app';

/**
 * Remove the Bearer portion of the authorization header value and return only the token
 * "Bearer TOKENHERE" => "TOKENHERE"
 *
 * @param header  Autheorization header's value string
 */
export const getBearerToken = (header: string): string | null => {
  if (header.startsWith("Bearer ")) {
    return header.slice(7, header.length);
  }
  return null;
};

/**
 * Object stored inside the JWT Token
 */
interface TokenPayload {
  userId: number;
  role: string;
  iat: number;
  exp: number;
}

/**
 * Set the isAuth boolean to false and run the express callback
 */
export const invalidateRequest = (req: Request, next: NextFunction) => {
  req.isAuth = false;
  next();
};

/**
 * Extracts and decodes the payload from the JWT token passed in the authorization header (if set).
 * Attaches decoded payload to the request object to be transferred to the graphql context later on.
 *
 * @param req
 * @param _
 * @param next
 */
const headerValidation = (req: Request, _: Response, next: NextFunction) => {
  // Grab the value from the authorization header
  const authHeader: string | undefined = req.headers['authorization'];

  // If it's not set, flag it as an unauthenticated request
  if (!authHeader) return invalidateRequest(req, next);

  // Extract the JWT Token
  const token = getBearerToken(authHeader);

  // If there's no token, flag as unauthenticated
  if (!token) return invalidateRequest(req, next);

  try {
    // Decode the token
    const decodedToken = verify(token, 'SECRET') as TokenPayload;

    // Store the decoded payload into our request object
    req.isAuth = true;
    req.currentUser = {
      id: decodedToken.userId,
      role: decodedToken.role,
      auth: {
        accessToken: token,
      },
    } as AuthenticatedUser;

    return next();
  } catch (err) {
    // Expired token token, flag as unauthenticated
    return invalidateRequest(req, next);
  }
};

export default headerValidation;
