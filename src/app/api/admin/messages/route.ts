import { NextRequest, NextResponse } from "next/server";
import { isRequestAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { localStore } from "@/lib/local-store";

export async function GET(request: NextRequest) {
  if (!isRequestAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    if (messages && messages.length > 0) {
      return NextResponse.json({ messages });
    }
  } catch (err: any) {
    console.warn("DB messages query failed, falling back to localStore:", err.message);
  }

  return NextResponse.json({ messages: localStore.getMessages() });
}
