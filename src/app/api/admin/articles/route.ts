import { NextRequest, NextResponse } from "next/server";
import { isRequestAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { localStore } from "@/lib/local-store";

export async function GET(request: NextRequest) {
  if (!isRequestAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "15", 10);
  const q = searchParams.get("q")?.trim() || "";

  const where: any = {};
  if (q) {
    where.OR = [
      { title: { contains: q } },
      { slug: { contains: q } },
      { sourceName: { contains: q } },
    ];
  }

  try {
    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          category: {
            select: { id: true, name: true, slug: true, color: true },
          },
        },
      }),
      prisma.article.count({ where }),
    ]);

    if (total > 0 || !q) {
      return NextResponse.json({
        articles,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      });
    }
  } catch (err: any) {
    console.warn("DB articles query failed, falling back to localStore:", err.message);
  }

  // Fallback to local store
  let list = localStore.getAllArticles();
  if (q) {
    const lower = q.toLowerCase();
    list = list.filter(
      (a) =>
        a.title.toLowerCase().includes(lower) ||
        a.slug.toLowerCase().includes(lower) ||
        a.sourceName.toLowerCase().includes(lower)
    );
  }
  const total = list.length;
  const paginated = list.slice((page - 1) * limit, page * limit);

  return NextResponse.json({
    articles: paginated,
    total,
    page,
    totalPages: Math.ceil(total / limit) || 1,
  });
}

export async function PUT(request: NextRequest) {
  if (!isRequestAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, title, excerpt, content, isFeatured, isBreaking, categoryId } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing article ID" }, { status: 400 });
    }

    try {
      const updated = await prisma.article.update({
        where: { id },
        data: {
          ...(title && { title }),
          ...(excerpt && { excerpt }),
          ...(content && { content }),
          ...(typeof isFeatured === "boolean" && { isFeatured }),
          ...(typeof isBreaking === "boolean" && { isBreaking }),
          ...(categoryId && { categoryId }),
        },
      });

      return NextResponse.json({ success: true, article: updated });
    } catch {
      const updated = localStore.updateArticle(id, {
        ...(title && { title }),
        ...(excerpt && { excerpt }),
        ...(content && { content }),
        ...(typeof isFeatured === "boolean" && { isFeatured }),
        ...(typeof isBreaking === "boolean" && { isBreaking }),
        ...(categoryId && { categoryId }),
      });
      return NextResponse.json({ success: true, article: updated });
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
      return NextResponse.json({ error: "Missing article ID" }, { status: 400 });
    }

    try {
      await prisma.article.delete({
        where: { id },
      });
    } catch {
      localStore.deleteArticle(id);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
