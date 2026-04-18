import { NextRequest, NextResponse } from 'next/server'

const BACKEND = process.env.BACKEND_URL ?? 'http://localhost:5000'
const SEVEN_DAYS = 7 * 24 * 60 * 60

async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }, // ← Promise now
) {
  const { path } = await params // ← must await
  const pathStr = path.join('/')
  const url = `${BACKEND}/api/${pathStr}`

  const token = req.cookies.get('token')?.value

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Cookie: `token=${token}` } : {}),
  }

  const isReadableMethod = !['GET', 'HEAD'].includes(req.method)

  const backendRes = await fetch(url, {
    method: req.method,
    headers,
    body: isReadableMethod ? await req.text() : undefined,
  })

  const data = await backendRes.json()
  const res = NextResponse.json(data, { status: backendRes.status })

  const setCookie = backendRes.headers.get('set-cookie')
  const isAuthEndpoint = ['login', 'register'].some((e) => pathStr.includes(e))

  if (setCookie && isAuthEndpoint) {
    const newToken = setCookie.match(/token=([^;]+)/)?.[1]
    if (newToken) {
      res.cookies.set('token', newToken, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: SEVEN_DAYS,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      })
    }
  }

  if (pathStr.includes('logout')) {
    res.cookies.delete('token')
  }

  return res
}

export const GET = handler
export const POST = handler
export const PUT = handler
export const PATCH = handler
export const DELETE = handler
