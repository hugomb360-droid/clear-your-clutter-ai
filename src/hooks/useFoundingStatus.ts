import { useQuery } from "@tanstack/react-query";
import { getMyFoundingStatus } from "@/lib/payments.functions";

export type FoundingInfo = {
  isFounding: boolean;
  paidMissions: number;
  freeRemaining: number;
};

/** Offre de lancement : 20 premiers pros, 5 chantiers sans commission Clearo. */
export function useFoundingStatus(enabled = true) {
  const query = useQuery({
    queryKey: ["founding-status"],
    enabled,
    staleTime: 60_000,
    queryFn: async (): Promise<FoundingInfo> => {
      const res = await getMyFoundingStatus();
      if ("error" in res) return { isFounding: false, paidMissions: 0, freeRemaining: 0 };
      return res;
    },
  });

  return query.data ?? { isFounding: false, paidMissions: 0, freeRemaining: 0 };
}
