import { NextResponse } from "next/server";
import { prisma } from "@/app/utils/db";
import { roleChecker } from "@/app/utils/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ topicId: string }> }
) {
  try {
    const isAdmin = await roleChecker("admin");
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { topicId } = await params;
    if (!topicId) {
      return NextResponse.json({ error: "Topic ID is required." }, { status: 400 });
    }

    const topic = await prisma.topic.findFirst({
      where: {
        id: topicId,
        deleted: false,
      },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        createdAt: true,
      },
    });

    if (!topic) {
      return NextResponse.json({ error: "Topic not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: topic });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ topicId: string }> }
) {
  try {
    const isAdmin = await roleChecker("admin");
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { topicId } = await params;
    if (!topicId) {
      return NextResponse.json({ error: "Topic ID is required." }, { status: 400 });
    }

    const { name, imageUrl } = await request.json();
    if (!name || !imageUrl) {
      return NextResponse.json({ error: "Name and imageUrl are required." }, { status: 400 });
    }

    const existingTopic = await prisma.topic.findFirst({
      where: { id: topicId, deleted: false },
      select: { id: true },
    });

    if (!existingTopic) {
      return NextResponse.json({ error: "Topic not found." }, { status: 404 });
    }

    const updatedTopic = await prisma.topic.update({
      where: { id: topicId },
      data: {
        name,
        imageUrl,
      },
    });

    return NextResponse.json({ success: true, data: updatedTopic });
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "P2002") {
      return NextResponse.json({ error: "Topic name already exists." }, { status: 409 });
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ topicId: string }> }
) {
  try {
    const isAdmin = await roleChecker("admin");
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { topicId } = await params;
    if (!topicId) {
      return NextResponse.json({ error: "Topic ID is required." }, { status: 400 });
    }

    const existingTopic = await prisma.topic.findUnique({
      where: { id: topicId },
      select: { id: true, deleted: true },
    });

    if (!existingTopic || existingTopic.deleted) {
      return NextResponse.json({ error: "Topic not found." }, { status: 404 });
    }

    await prisma.topic.update({
      where: { id: topicId },
      data: { deleted: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
