import { NextRequest, NextResponse } from "next/server";
import { getSettings, updateSettings } from "@/lib/supabase/data";

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  try {
    const adminPass = req.headers.get("x-admin-password");
    if (adminPass !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    // Remove fields that shouldn't be updated this way
    const { id, updated_at, ...payload } = body;

    const result = await updateSettings(payload);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    const settings = await getSettings();
    return NextResponse.json(settings);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
