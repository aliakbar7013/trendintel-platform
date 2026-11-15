import { NextRequest, NextResponse } from "next/server";
import { isRequestAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { localStore } from "@/lib/local-store";

export async function GET(request: NextRequest) {
  if (!isRequestAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const categories = await prisma.category.findMany({
      orderBy: { order: "asc" },
      include: {
        feeds: true,
        _count: { select: { articles: true } },
      },
    });

    if (categories && categories.length > 0) {
      return NextResponse.json({ categories });
    }
  } catch (err: any) {
    console.warn("DB categories query failed, falling back to localStore:", err.message);
  }

  return NextResponse.json({ categories: localStore.getCategories() });
}

export async function POST(request: NextRequest) {
  if (!isRequestAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, slug, description, color, order } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: "Name and slug are required" }, { status: 400 });
    }

    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]+/g, "-");

    try {
      const category = await prisma.category.create({
        data: {
          name,
          slug: cleanSlug,
          description: description || null,
          color: color || "#f59e0b",
          order: order || 0,
        },
      });

      return NextResponse.json({ success: true, category });
    } catch {
      const category = localStore.addCategory({
        name,
        slug: cleanSlug,
        description,
        color,
        order,
      });
      return NextResponse.json({ success: true, category });
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
      return NextResponse.json({ error: "Missing category ID" }, { status: 400 });
    }

    try {
      await prisma.category.delete({ where: { id } });
    } catch {
      localStore.deleteCategory(id);
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
