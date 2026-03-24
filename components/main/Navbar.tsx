'use client'

import React, { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { LogoutLink, useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'

export default function Navbar() {
  const { user, isLoading } = useKindeBrowserClient()
  const fallbackAvatar = '/avatar/default-avatar.jpg'
  const displayName =
    user?.given_name ||
    user?.family_name ||
    user?.email ||
    'Account'
  const [avatarFailed, setAvatarFailed] = useState(false)
  const avatarSrc = !avatarFailed && user?.picture ? user.picture : fallbackAvatar
  const initials = useMemo(() => {
    const text = typeof displayName === 'string' ? displayName.trim() : ''
    if (!text) return 'U'
    return text[0]?.toUpperCase() || 'U'
  }, [displayName])

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
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-neutral-200 bg-neutral-100 shadow-sm">
              <Image
                src={avatarSrc}
                alt={typeof displayName === 'string' ? displayName : 'User avatar'}
                fill
                sizes="36px"
                className="object-cover"
                unoptimized
                onError={() => setAvatarFailed(true)}
              />
              {avatarFailed && (
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-neutral-500 bg-neutral-100">
                  {initials}
                </span>
              )}
            </div>

            {/* Display name */}
            {/* <span className="hidden sm:inline text-sm font-semibold text-neutral-700">
              {displayName}
            </span> */}
          </div>
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
