import { prisma } from "@/app/utils/db";
import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { roleChecker } from "@/app/utils/auth";
import { QuestionType } from "@/lib/generated/prisma/client";

type RouteContext = {
  params: Promise<{ id: string }>;
};

async function ensureQuestionWriteAccess(questionId: string) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return { error: NextResponse.json({ error: "Not authenticated" }, { status: 401 }) };
  }

  const question = await prisma.question.findUnique({
    where: { id: questionId },
    select: { id: true, createdById: true, type: true, deleted: true },
  });

  if (!question || question.deleted) {
    return { error: NextResponse.json({ error: "Question not found" }, { status: 404 }) };
  }

  const isAdmin = await roleChecker("admin");
  const isOwner = question.createdById === user.id;

  if (!isAdmin && !(question.type === QuestionType.PERSONALIZED && isOwner)) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { question };
}

export async function GET(_: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const isAdmin = await roleChecker("admin");

    const question = await prisma.question.findFirst({
      where: {
        id,
        deleted: false,
        topic: {
          deleted: false,
        },
        ...(isAdmin
          ? {}
          : {
              OR: [
                { type: QuestionType.DEFAULT },
                { type: QuestionType.PERSONALIZED, createdById: user.id },
              ],
            }),
      },
      select: {
        id: true,
        statement: true,
        topicId: true,
        correctWritten: true,
        imageUrl: true,
        options: true,
        correctOption: true,
      },
    });

    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: question });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const access = await ensureQuestionWriteAccess(id);

    if ("error" in access) {
      return access.error;
    }

    const { statement, topicId, correctWritten, options, correctOption, imageUrl } =
      await request.json();

    if (!statement || !topicId || !correctWritten || correctOption === undefined || correctOption === null) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    if (!options || !(options instanceof Array) || options.length < 2) {
      return NextResponse.json({ error: "At least 2 MCQ options are required." }, { status: 400 });
    }

    const updatedQuestion = await prisma.question.update({
      where: { id },
      data: {
        statement,
        topicId,
        correctWritten,
        options,
        correctOption,
        imageUrl,
      },
    });

    return NextResponse.json({ success: true, data: updatedQuestion });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const access = await ensureQuestionWriteAccess(id);

    if ("error" in access) {
      return access.error;
    }

    await prisma.question.update({
      where: { id },
      data: { deleted: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
