import { prisma } from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";
import { roleChecker } from "@/app/utils/auth";
import { redis } from "@/app/utils/redis";
import type { Topic } from '@/app/utils/api/topics'
export async function GET() {
    try {
        const cachedTopics = await redis.get<Topic[]>('topics')
        if (cachedTopics) {
            console.log("cached topics found, returning from cache")
            return NextResponse.json({
                success: true,
                data: cachedTopics,
            })
        }
        console.log("no cached topics found, fetching from database")
        const topics = await prisma.topic.findMany({
            where: {
                deleted: false,
            },
            select: {
                id: true,
                name: true,
                imageUrl: true,
                createdAt: true,
                _count: {
                    select: {
                        questions: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        const topicsReturned = topics.map((topic) => ({
            ...topic,
            createdAt: topic.createdAt.toISOString(),
        }))
        await redis.set('topics', JSON.stringify(topicsReturned));
        await redis.expire('topics', 604800); // Set expiration to 7 days (in seconds)
        return NextResponse.json({
            success: true,
            data: topicsReturned,
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function POST(request: NextRequest){
    try {
        // Check if user has admin role
        const isAdmin = await roleChecker("admin");
        if(!isAdmin){
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }
        // Create new topic in database
        const { name, imageUrl } = await request.json();
        if(!name || !imageUrl){
            return NextResponse.json({ error: "Name and imageUrl are required." }, { status: 400 });
        }
        const topic = await prisma.topic.create({
            data: {
                name: name,
                imageUrl: imageUrl
            }
        });
        return NextResponse.json({ success: true, data: topic });
    }
    catch(error){
        if (error instanceof Error && 'code' in error && error.code === 'P2002') {
            return NextResponse.json({ error: "Topic name already exists." }, { status: 409 });
        }
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
