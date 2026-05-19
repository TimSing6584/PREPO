import { prisma } from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { roleChecker } from "@/app/utils/auth";
import { QuestionType } from "@/lib/generated/prisma/client";
import { checkRateLimit } from "@/app/utils/ratelimit";

export async function GET() {
    try {
        const { getUser } = getKindeServerSession();
        const user = await getUser();
        if (!user) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const rateLimitError = await checkRateLimit('read');
        if (rateLimitError) return rateLimitError;

        const isAdmin = await roleChecker("admin");
        const baseWhere = {
            deleted: false,
            topic: {
                deleted: false,
            },
        };

        const questions = await prisma.question.findMany({
            where: isAdmin
                ? baseWhere
                : {
                    ...baseWhere,
                    OR: [
                        { type: QuestionType.DEFAULT },
                        { type: QuestionType.PERSONALIZED, createdById: user.id },
                    ],
                },
            include: {
                topic: true,
                createdBy: true,
                starredBy: true,
            },
            orderBy: [{ createdAt: "desc" }, { id: "desc" }]
        });

        return NextResponse.json({ success: true, data: questions });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        // Get user from Kinde Server Session
        const { getUser } = getKindeServerSession();
        const user = await getUser();
        if (!user) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }
        // Get user's Kinde ID
        const userKindeId = user.id;

        const rateLimitError = await checkRateLimit('write');
        if (rateLimitError) return rateLimitError;

        // Check if user has admin role
        const isAdmin = await roleChecker("admin");

        const { questions } = await request.json();
        if (!Array.isArray(questions) || questions.length === 0) {
            return NextResponse.json({ error: "Questions must be a non-empty array." }, { status: 400 });
        }

        // Make sure non-admins can only create one question at a time.
        if (!isAdmin && questions.length > 1) {
            return NextResponse.json({ error: "Can't create multiple questions at once." }, { status: 403 });
        }
        // Validate all questions first before creating any
        const invalidIndex = questions.findIndex((q) =>
            !q.statement || !q.topicId || !q.correctWritten ||
            !Array.isArray(q.options) || q.options.length < 2 ||
            q.correctOption === undefined || q.correctOption === null ||
            q.correctOption < 0 || q.correctOption >= q.options.length
        );
        if (invalidIndex !== -1) {
            return NextResponse.json({
                error: `Question at index ${invalidIndex} has invalid or missing fields.`
            }, { status: 400 });
        }
        // All valid — create all at once
        await prisma.question.createMany({
            data: questions.map((q) => ({
                statement: q.statement,
                topicId: q.topicId,
                correctWritten: q.correctWritten,
                options: q.options,
                correctOption: q.correctOption,
                imageUrl: q.imageUrl ?? null,
                type: isAdmin ? QuestionType.DEFAULT : QuestionType.PERSONALIZED,
                createdById: userKindeId
            }))
        });
        return NextResponse.json({ success: true });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
