import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

const BUCKET = "wedding-photos";

async function ensureBucket(supabase: ReturnType<typeof createServiceClient>) {
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.some((b) => b.name === BUCKET);
  if (!exists) {
    const { error } = await supabase.storage.createBucket(BUCKET, {
      public: true,
      fileSizeLimit: 5 * 1024 * 1024,
      allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    });
    if (error && !error.message.toLowerCase().includes("already")) {
      throw new Error(
        `Bucket gagal dibuat: ${error.message}. Buat manual di Supabase → Storage → New bucket → nama: wedding-photos (Public).`
      );
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const adminPass = req.headers.get("x-admin-password");
    if (adminPass !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "photos";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      return NextResponse.json(
        { error: "Hanya file gambar (jpg, png, webp, gif)" },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Maksimal 5MB" }, { status: 400 });
    }

    const supabase = createServiceClient();

    try {
      await ensureBucket(supabase);
    } catch (e) {
      return NextResponse.json({ error: String(e) }, { status: 500 });
    }

    const ext = file.name.split(".").pop() || "jpg";
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error } = await supabase.storage.from(BUCKET).upload(fileName, buffer, {
      contentType: file.type,
      upsert: false,
    });

    if (error) {
      return NextResponse.json(
        {
          error:
            error.message.includes("Bucket not found")
              ? "Bucket 'wedding-photos' belum ada. Buat di Supabase → Storage → New bucket → Public."
              : error.message,
        },
        { status: 500 }
      );
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET).getPublicUrl(fileName);

    return NextResponse.json({ url: publicUrl });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
