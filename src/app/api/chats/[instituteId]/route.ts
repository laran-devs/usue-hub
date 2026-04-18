import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { instituteId: string } }
) {
  try {
    const messages = await prisma.chatMessage.findMany({
      where: { instituteId: params.instituteId },
      include: { user: true },
      orderBy: { createdAt: "asc" },
      take: 50,
    });
    return NextResponse.json(messages);
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { instituteId: string } }
) {
  try {
    const body = await request.json();
    const { content, userId } = body;

    const message = await prisma.chatMessage.create({
      data: {
        content,
        userId,
        instituteId: params.instituteId,
      },
      include: { user: true },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("Failed to create message:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
