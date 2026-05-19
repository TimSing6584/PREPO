import { prisma } from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";
import { checkIpRateLimit } from "@/app/utils/ratelimit";

export async function GET(request: NextRequest) {
    const rateLimitError = await checkIpRateLimit(request);
    if (rateLimitError) return rateLimitError;

    const { searchParams } = new URL(request.url)
    const name = searchParams.get('name')
    if (!name) {
        return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }
    const existing = await prisma.topic.findFirst({
        where: { name, deleted: false },
    })
    if (existing) {
        return NextResponse.json({ exists: true })
    }
    else {
        return NextResponse.json({ exists: false })
    }
}