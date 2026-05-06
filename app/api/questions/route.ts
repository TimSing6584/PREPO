import { prisma } from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import { roleChecker } from "@/app/utils/auth";
import { QuestionType } from "@/lib/generated/prisma/client";

export async function GET() {
    try {
        const questions = await prisma.question.findMany({
            where: {
                deleted: false,
                topic: {
                    deleted: false,
                },
            },
            include: {
                topic: true,
                createdBy: true,
                starredBy: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json({ success: true, data: questions });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function POST(request: NextRequest){
    try {
        // Get user from Kinde Server Session
        const {getUser} = getKindeServerSession();
        const user = await getUser();
        if(!user){
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }
        // Get user's Kinde ID
        const userKindeId = user.id;

        // Check if user has admin role
        const isAdmin = await roleChecker("admin");

        const { statement, topicId, correctWritten, options, correctOption, imageUrl } = await request.json();
        // Be careful!!! correctOption can be 0 (int), therefore !correctOption can reject it
        if(!statement || !topicId || !correctWritten || correctOption === undefined || correctOption === null){
            return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
        }
        if(!options || !(options instanceof Array) || options.length < 2){
            return NextResponse.json({ error: "At least 2 MCQ options are required." }, { status: 400 });
        }
        // Create new question in database
        const question = await prisma.question.create({
            data: {
                statement,
                topicId,
                correctWritten,
                options,
                correctOption,
                imageUrl,
                type: isAdmin ? QuestionType.DEFAULT : QuestionType.PERSONALIZED,
                createdById: userKindeId
            }
        });
        return NextResponse.json({ success: true, data: question });
    }
    catch(error){
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
