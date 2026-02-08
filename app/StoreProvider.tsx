'use client'

import { useRef } from 'react'
import { Provider } from 'react-redux'
import { makeStore, AppStore } from '../store/store'
import { SessionProvider } from 'next-auth/react'

import { Session } from 'next-auth'

export default function StoreProvider({
  children,
  session
}: {
  children: React.ReactNode
  session?: Session | null
}) {
  const storeRef = useRef<AppStore | null>(null)
  if (!storeRef.current) {
    storeRef.current = makeStore()
  }

  return (
    <SessionProvider session={session}>
      <Provider store={storeRef.current}>{children}</Provider>
    </SessionProvider>
  )
}
