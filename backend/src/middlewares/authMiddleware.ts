import { Request, Response, NextFunction } from 'express'
import { validateToken } from '../services/authService'
import jwt, { JwtPayload } from 'jsonwebtoken'

interface AuthRequest extends Request {
  user?: JwtPayload | string
}

function isJwtPayload (user: JwtPayload | string): user is JwtPayload {
  return (user as JwtPayload).role !== undefined
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers['authorization']?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'No token provided' })
  }
  try {
    const decoded = validateToken(token)
    req.user = decoded
    next()
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token has expired' })
    } else {
      return res.status(401).json({ message: 'Invalid token' })
    }
  }
}

export const authorizateAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || !isJwtPayload(req.user)) {
    return res.status(403).json({ message: 'Forbidden' })
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' })
  }
  next()
}
