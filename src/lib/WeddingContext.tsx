"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_DATA,
  loadWeddingData,
  type WeddingData,
} from "./wedding-data";
import { getWeddingDataFromSupabase } from "./supabase/data";
import { isSupabaseConfigured } from "./supabase/client";

const WeddingCtx = createContext<WeddingData>(DEFAULT_DATA);

export function WeddingProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<WeddingData>(DEFAULT_DATA);

  const refresh = useCallback(async () => {
    if (isSupabaseConfigured()) {
      const remote = await getWeddingDataFromSupabase();
      if (remote) {
        setData(remote);
        return;
      }
    }
    setData(loadWeddingData());
  }, []);

  useEffect(() => {
    void refresh();
    const onUpdate = () => void refresh();
    window.addEventListener("wedding-data-updated", onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener("wedding-data-updated", onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, [refresh]);

  return <WeddingCtx.Provider value={data}>{children}</WeddingCtx.Provider>;
}

export function useWeddingData(): WeddingData {
  return useContext(WeddingCtx);
}
