// app/providers/auth-provider.tsx
'use client'

import { useEffect } from 'react'
import { ensureToken } from '../api/services/authService'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // En dev: tentera loginDemo() si pas de token
    ensureToken().catch((e) => {
      console.error('ensureToken failed:', e)
    })
  }, [])

  return <>{children}</>
}
