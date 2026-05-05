import { prisma } from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";
import { roleChecker } from "@/app/utils/auth";
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
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}