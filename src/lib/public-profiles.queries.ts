import { queryOptions } from "@tanstack/react-query";
import { getPublicProfessionals } from "./public-profiles.functions";
export const publicProfessionalsQuery = queryOptions({ queryKey: ["public-professionals"], queryFn: () => getPublicProfessionals(), staleTime: 60_000 });