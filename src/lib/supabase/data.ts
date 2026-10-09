import { createClient, createServiceClient } from "./server";
import { DEFAULT_SETTINGS, type InvitationSettings, type Wish } from "../types";

export async function getSettings(): Promise<InvitationSettings> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("invitation_settings")
      .select("*")
      .limit(1)
      .single();

    if (error || !data) {
      return { ...DEFAULT_SETTINGS, id: "default", updated_at: new Date().toISOString() };
    }
    return data as InvitationSettings;
  } catch {
    return { ...DEFAULT_SETTINGS, id: "default", updated_at: new Date().toISOString() };
  }
}

export async function updateSettings(
  payload: Partial<InvitationSettings>
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createServiceClient();
    const { data: existing } = await supabase
      .from("invitation_settings")
      .select("id")
      .limit(1)
      .single();

    if (!existing) {
      const { error } = await supabase.from("invitation_settings").insert({
        ...DEFAULT_SETTINGS,
        ...payload,
      });
      if (error) return { success: false, error: error.message };
      return { success: true };
    }

    const { error } = await supabase
      .from("invitation_settings")
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq("id", existing.id);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

export async function getWishes(): Promise<Wish[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("wishes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return [];
    return (data as Wish[]) || [];
  } catch {
    return [];
  }
}

export async function deleteWish(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createServiceClient();
    const { error } = await supabase.from("wishes").delete().eq("id", id);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

export async function createWish(wish: {
  guest_name: string;
  message: string;
  attendance?: string;
}): Promise<{ success: boolean; error?: string; data?: Wish }> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("wishes")
      .insert({
        guest_name: wish.guest_name,
        message: wish.message,
        attendance: wish.attendance || "hadir",
      })
      .select()
      .single();

    if (error) return { success: false, error: error.message };
    return { success: true, data: data as Wish };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}
