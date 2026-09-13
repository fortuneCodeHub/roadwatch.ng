import { SignJWT, jwtVerify } from 'jose'
import type { NextRequest } from 'next/server'

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-32-chars-minimum!!'
)

export async function signToken(payload: Record<string, unknown>) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .setIssuedAt()
    .sign(secret)
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch {
    return null
  }
}

export async function getTokenFromRequest(req: NextRequest) {
  const token = req.cookies.get('rdw_token')?.value
  if (!token) return null
  return verifyToken(token)
}
