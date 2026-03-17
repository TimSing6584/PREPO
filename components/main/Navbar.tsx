'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { LogoutLink, useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'

export default function Navbar() {
  const { user, isLoading } = useKindeBrowserClient()
  const displayName =
    user?.given_name ||
    user?.family_name ||
    user?.email ||
    'Account'

  return (
    <header className="w-full flex justify-between items-center z-10">
      <Link href="/dashboard" className="transition-transform hover:scale-105 active:scale-95">
        <Image 
          src="/prepo-logo/prepo-logo.svg" 
          width={120} 
          height={40} 
          alt="Prepo Logo"
          className="h-10 w-auto"
        />
      </Link>
      <div className="flex items-center gap-3">
        {!isLoading && user && (
          <span className="hidden sm:inline text-sm font-semibold text-neutral-700">
            {displayName}
          </span>
        )}

        {user ? (
          <LogoutLink
            className="px-8 py-2.5 rounded-full border border-neutral-200 hover:bg-neutral-100 hover:border-neutral-300 transition-all font-medium text-neutral-800 bg-white shadow-sm"
          >
            Sign out
          </LogoutLink>
        ) : null}
      </div>
    </header>
  )
}
