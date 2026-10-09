# Setup Storage untuk Upload Foto

1. Buka Supabase Dashboard → **Storage**
2. Klik **New bucket**
3. Name: `wedding-photos`
4. Centang **Public bucket**
5. Create bucket

6. (Opsional) Policies:
   - Storage → wedding-photos → Policies
   - Add policy: **Public SELECT** (read) for everyone
   - Upload dilakukan via server (service_role), jadi tidak perlu public INSERT

Setelah itu, di Admin dashboard bisa upload foto langsung (Foto Pria, Foto Wanita, Gallery).
