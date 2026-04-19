import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    
    // We'll mock the nicknames for now as the Post model doesn't have a userId yet.
    // In a real scenario, we'd relate posts to users.
    // But for "truly anonymous" wall, we can just attach the user's nickname if we add it to the model.
    // Fixed: To keep it 100% anonymous as requested, we can use the nickname from the session when posting.
    
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { content, nickname } = body;

    const post = await prisma.post.create({
      data: {
        content,
        nickname: nickname || "Анонимный Студент",
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Failed to create post:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
