import { NextRequest, NextResponse } from "next/server";
import { isRequestAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { localStore } from "@/lib/local-store";

export async function POST(request: NextRequest) {
  if (!isRequestAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, url, categoryId } = await request.json();

    if (!name || !url || !categoryId) {
      return NextResponse.json(
        { error: "Feed name, URL, and category are required" },
        { status: 400 }
      );
    }

    try {
      const feed = await prisma.feed.create({
        data: {
          name: name.trim(),
          url: url.trim(),
          categoryId,
          isActive: true,
        },
      });

      return NextResponse.json({ success: true, feed });
    } catch {
      const feed = localStore.addFeed({
        name: name.trim(),
        url: url.trim(),
        categoryId,
      });
      return NextResponse.json({ success: true, feed });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!isRequestAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, isActive } = await request.json();

    if (!id || typeof isActive !== "boolean") {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    try {
      const feed = await prisma.feed.update({
        where: { id },
        data: { isActive },
      });

      return NextResponse.json({ success: true, feed });
    } catch {
      const feed = localStore.updateFeed(id, { isActive });
      return NextResponse.json({ success: true, feed });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!isRequestAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing feed ID" }, { status: 400 });
    }

    try {
      await prisma.feed.delete({ where: { id } });
    } catch {
      localStore.deleteFeed(id);
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
