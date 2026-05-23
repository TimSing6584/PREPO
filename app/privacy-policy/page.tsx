import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Prepo — learn how we collect, use, and protect your data.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="main-frame min-h-screen bg-white">
      {/* Minimal nav */}
      <header className="px-8 py-6 border-b border-gray-100">
        <Link href="/" className="transition-transform hover:scale-105 active:scale-95">
          <Image
            src="/prepo-logo/prepo-logo.svg"
            alt="Prepo Logo"
            width={120}
            height={40}
            className="h-10 w-auto"
          />
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-8 py-16">
        <h1 className="text-4xl font-bold text-[#101010] mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-12">Last updated: May 2026</p>

        <div className="space-y-12 text-gray-600 leading-relaxed">

          {/* Data We Collect */}
          <section>
            <h2 className="text-xl font-semibold text-[#101010] mb-4">Data We Collect</h2>
            <p>
              When you use Prepo, we collect information necessary to provide our services, including
              your name, email address, and usage data. We also collect technical information such as
              IP addresses and request headers to help us monitor and debug application errors.
            </p>
          </section>

          {/* How We Use Your Data */}
          <section>
            <h2 className="text-xl font-semibold text-[#101010] mb-4">How We Use Your Data</h2>
            <p>
              Your data is used to operate and improve the platform, authenticate your account, and
              diagnose technical issues. Error monitoring is handled by Sentry, a third-party service,
              which may receive limited personal information such as your IP address and user identifier
              when an error occurs.
            </p>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="text-xl font-semibold text-[#101010] mb-4">Third-Party Services</h2>
            <p className="mb-4">
              We use the following third-party services that may process your data:
            </p>
            <ul className="space-y-3">
              {[
                { name: 'Kinde', description: 'Authentication and user management' },
                { name: 'Sentry', description: 'Error monitoring and performance tracking' },
                { name: 'Upstash', description: 'Rate limiting and caching' },
                { name: 'Amazon S3', description: 'File storage' },
              ].map(({ name, description }) => (
                <li key={name} className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                  <span>
                    <span className="font-medium text-[#101010]">{name}</span>
                    {' '}—{' '}
                    {description}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-xl font-semibold text-[#101010] mb-4">Data Retention</h2>
            <p>
              We retain your data for as long as your account is active. You may request deletion of
              your data at any time by contacting us.
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-xl font-semibold text-[#101010] mb-4">Your Rights</h2>
            <p>
              You have the right to access, correct, or delete your personal data. To exercise these
              rights, contact us at{' '}
              <a
                href="mailto:prepo.dev.contact@gmail.com"
                className="text-[#101010] font-medium underline underline-offset-2 hover:opacity-70 transition-opacity"
              >
                prepo.dev.contact@gmail.com
              </a>
              .
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-xl font-semibold text-[#101010] mb-4">Contact</h2>
            <p>
              If you have any questions about this policy, reach out at{' '}
              <a
                href="mailto:prepo.dev.contact@gmail.com"
                className="text-[#101010] font-medium underline underline-offset-2 hover:opacity-70 transition-opacity"
              >
                prepo.dev.contact@gmail.com
              </a>
              .
            </p>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-3xl mx-auto px-8 py-12 mt-8 border-t border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Prepo Platform.</p>
          <Link href="/" className="hover:text-[#101010] transition-colors">
            ← Back to home
          </Link>
        </div>
      </footer>
    </div>
  )
}
