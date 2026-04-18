import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const institutes = await prisma.institute.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(institutes);
  } catch (error) {
    console.error("Failed to fetch institutes:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
