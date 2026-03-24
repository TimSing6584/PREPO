import { execSync, spawn } from 'node:child_process'
import { writeFileSync } from 'node:fs'

try {
  const envContent = execSync('infisical export --env=dev', {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit'],
  })

  writeFileSync('.env.local', envContent)
  console.log('Wrote Infisical secrets to .env.local')
} catch (error) {
  console.error('Failed to export secrets from Infisical.')
  process.exit(1)
}

const pnpmBin = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm'
const child = spawn(pnpmBin, ['exec', 'next', 'dev'], {
  stdio: 'inherit',
  shell: false,
})

child.on('exit', (code) => {
  process.exit(code ?? 0)
})

