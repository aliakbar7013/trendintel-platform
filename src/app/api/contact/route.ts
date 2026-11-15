import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { localStore } from "@/lib/local-store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    try {
      const saved = await prisma.contactMessage.create({
        data: {
          name: name.trim().slice(0, 255),
          email: email.trim().toLowerCase().slice(0, 255),
          subject: (subject || "General Inquiry").trim().slice(0, 255),
          message: message.trim(),
        },
      });

      return NextResponse.json({
        success: true,
        message: "Your dispatch has been received by our editorial bureau.",
        id: saved.id,
      });
    } catch (dbErr: any) {
      console.warn("DB save failed for contact message, saving to localStore:", dbErr.message);
      const saved = localStore.addMessage({
        name: name.trim().slice(0, 255),
        email: email.trim().toLowerCase().slice(0, 255),
        subject: (subject || "General Inquiry").trim().slice(0, 255),
        message: message.trim(),
      });
      return NextResponse.json({
        success: true,
        message: "Your dispatch has been received by our editorial bureau.",
        id: saved.id,
      });
    }
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to process message." },
      { status: 500 }
    );
  }
}
