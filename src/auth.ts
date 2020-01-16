import { sign, verify } from 'jsonwebtoken';
import { Request, Response } from 'express';
import { getBearerToken } from './middleware/express/headerValidation';
import { getRepository } from 'typeorm';
import { User } from './entity/User';
import { redis } from '.';
import Logger from './util/logging/Logger';

export interface TokenDto {
  userId: number;
  role: string;
}

export const createAccessToken = (payload: TokenDto) =>
  sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15min' });

export const createRefreshToken = (payload: TokenDto) =>
  sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

interface RefreshTokenBody {
  refreshToken: string;
}

/**
 * POST /refreshToken endpoint handler
 *
 * Validates the refresh token and returns new ones on valid request
 */
export const refreshTokenHandler = async (
  req: Request,
  res: Response
): Promise<Response | undefined> => {
  const authHeader: string | undefined = req.headers['authorization'];
  const { refreshToken }: RefreshTokenBody = req.body;

  if (!authHeader || !refreshToken)
    return res.send({ ok: false, accessToken: '', refreshToken: '' });

  const token = getBearerToken(authHeader);

  if (!token) return res.send({ ok: false, accessToken: '', refreshToken: '' });

  let payload: TokenDto;
  // Check that the refresh token is not expired
  try {
    payload = verify(token, process.env.REFRESH_TOKEN_SECRET) as TokenDto;

    const maybeToken = await redis.get(String(payload.userId));

    // Check if the blacklist contained the users refresh token
    if (!!maybeToken) {
      // Fetch the user object (ensure we use most up to date data)
      const user = await getRepository(User).findOne(payload.userId);

      // If the user exists, create and return new tokens
      return !!user
        ? res.send({
            ok: true,
            accessToken: createAccessToken(user.toTokenDto()),
            refreshToken: '',
          })
        : res.send({ ok: false, accessToken: '', refreshToken: '' });
    }
  } catch (err) {
    Logger.warn(`http:post:refreshToken - failed refresh token attempt`, req.ip, refreshToken);
  }

  return res.send({ ok: false, accessToken: '', refreshToken: '' });
};
