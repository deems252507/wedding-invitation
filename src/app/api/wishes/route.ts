import { NextRequest, NextResponse } from "next/server";
import { createWish, getWishes, deleteWish } from "@/lib/supabase/data";

export async function GET() {
  const wishes = await getWishes();
  return NextResponse.json(wishes);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { guest_name, message, attendance } = body;

    if (!guest_name?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "Nama dan pesan wajib diisi" },
        { status: 400 }
      );
    }

    const result = await createWish({
      guest_name: guest_name.trim(),
      message: message.trim(),
      attendance: attendance || "hadir",
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Simple admin password check via header
    const adminPass = req.headers.get("x-admin-password");
    if (adminPass !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const result = await deleteWish(id);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
