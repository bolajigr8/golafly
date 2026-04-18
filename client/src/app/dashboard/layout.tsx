import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/dashboard/DashboardShell'
import type { User } from '@/types/auth.types'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) redirect('/login')

  // Definite assignment assertion — redirect() throws internally so TS
  // cannot infer it as never without this assertion
  let user!: User

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000'
    const response = await fetch(`${apiUrl}/api/auth/me`, {
      headers: {
        Cookie: `token=${token}`,
        Accept: 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) redirect('/login')

    const json = (await response.json()) as {
      success: boolean
      data: { user: User }
    }

    user = json.data.user
  } catch (err) {
    // If err is a Next.js redirect, re-throw it — otherwise redirect to login
    // Next.js redirect() throws a special error that must propagate
    if (err instanceof Error && err.message === 'NEXT_REDIRECT') throw err
    redirect('/login')
  }

  return <DashboardShell user={user}>{children}</DashboardShell>
}
