import { NextRequest, NextResponse } from 'next/server'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { checkRateLimit } from '@/app/utils/ratelimit'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const MAX_IMAGE_SIZE = 4 * 1024 * 1024 // 4 MB per file

export async function POST(request: NextRequest) {
  try {
    const { getUser } = getKindeServerSession()
    const user = await getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const rateLimitError = await checkRateLimit('upload')
    if (rateLimitError) return rateLimitError

    const formData = await request.formData()
    const category = formData.get('category')
    const message = formData.get('message')
    const imageFiles = formData.getAll('images')

    if (!category || typeof category !== 'string' || !category.trim()) {
      return NextResponse.json({ error: 'Category is required.' }, { status: 400 })
    }
    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 })
    }
    // Email that feedback will be sent to
    const to = process.env.COMPANY_EMAIL
    if (!to) {
      return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 })
    }

    const senderName = [user.given_name, user.family_name].filter(Boolean).join(' ') || 'Anonymous'
    const senderEmail = user.email ?? 'unknown'

    const attachments: { filename: string; content: Buffer }[] = []

    for (const entry of imageFiles) {
      if (!(entry instanceof File)) continue
      if (entry.size > MAX_IMAGE_SIZE) {
        return NextResponse.json({ error: 'Each image must be under 4 MB.' }, { status: 400 })
      }
      const buffer = Buffer.from(await entry.arrayBuffer())
      attachments.push({ filename: entry.name, content: buffer })
    }

    await resend.emails.send({
      from: 'Feedback <noreply@prepo.space>',
      to,
      replyTo: senderEmail,
      subject: `[Feedback] ${category} — ${senderName}`,
      html: buildEmailHtml({ name: senderName, email: senderEmail, category, message: message.trim() }),
      attachments,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

function buildEmailHtml(fields: {
  name: string
  email: string
  category: string
  message: string
}): string {
  const esc = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  return `<!DOCTYPE html><html><body style="font-family:sans-serif;color:#111;max-width:600px;margin:0 auto;padding:24px">
    <h2 style="margin-top:0">New Feedback</h2>
    <table style="width:100%;border-collapse:collapse">
      <tr><td style="padding:8px 0;font-weight:600;width:80px">Name</td><td style="padding:8px 0">${esc(fields.name)}</td></tr>
      <tr><td style="padding:8px 0;font-weight:600">Email</td><td style="padding:8px 0">${esc(fields.email)}</td></tr>
      <tr><td style="padding:8px 0;font-weight:600">Category</td><td style="padding:8px 0">${esc(fields.category)}</td></tr>
      <tr><td style="padding:8px 0;font-weight:600;vertical-align:top">Message</td><td style="padding:8px 0;white-space:pre-wrap">${esc(fields.message)}</td></tr>
    </table>
  </body></html>`
}
