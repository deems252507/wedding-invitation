import { getSettings } from "@/lib/supabase/data";
import InvitationClient from "@/components/invitation/InvitationClient";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ to?: string }> | { to?: string };
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await Promise.resolve(searchParams);
  const guestName = params?.to
    ? decodeURIComponent(params.to.replace(/\+/g, " "))
    : undefined;

  const settings = await getSettings();

  return <InvitationClient settings={settings} guestName={guestName} />;
}
