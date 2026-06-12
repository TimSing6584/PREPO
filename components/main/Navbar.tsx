'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { LogoutLink, useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'

export default function Navbar() {
  const { user, isLoading } = useKindeBrowserClient()
  const [avatarFailed, setAvatarFailed] = useState(false)

  useEffect(() => {
    setAvatarFailed(false)
  }, [user?.picture])

  const displayName =
    user?.given_name ||
    user?.family_name ||
    user?.email ||
    'Account'

  const initials = useMemo(() => {
    const text = typeof displayName === 'string' ? displayName.trim() : ''
    if (!text) return 'U'
    return text[0]?.toUpperCase() || 'U'
  }, [displayName])

  return (
    <header className="w-full flex justify-between items-center gap-2 z-10 min-h-0">
      <Link href="/dashboard" className="shrink-0 transition-transform hover:scale-105 active:scale-95">
        <Image
          src="/prepo-logo/prepo-logo.svg"
          width={120}
          height={40}
          alt="Prepo Logo"
          className="h-7 w-auto sm:h-9 md:h-10"
        />
      </Link>

      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {!isLoading && user && (
          <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border border-neutral-200 shadow-sm">
            {/* Initials as base layer — always visible */}
            <span className="absolute inset-0 flex items-center justify-center text-[10px] sm:text-xs font-bold text-neutral-500 bg-neutral-100">
              {initials}
            </span>

            {/* Avatar on top — falls back to initials if broken or blank */}
            {!avatarFailed && user.picture && (
              <Image
                src={user.picture}
                alt={typeof displayName === 'string' ? displayName : 'User avatar'}
                fill
                sizes="36px"
                className="object-cover"
                unoptimized
                onError={() => setAvatarFailed(true)}
              />
            )}
          </div>
        )}

        {user && (
          <LogoutLink className="px-3 py-1.5 text-xs sm:px-5 sm:py-2 sm:text-sm md:px-8 md:py-2.5 rounded-full border border-neutral-200 hover:bg-neutral-100 hover:border-neutral-300 transition-all font-medium text-neutral-800 bg-white shadow-sm whitespace-nowrap">
            Sign out
          </LogoutLink>
        )}
      </div>
    </header>
  )
}