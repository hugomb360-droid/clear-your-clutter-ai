import { describe, expect, it } from "vitest";
import { averageRating, profileCompletion, rankProfessionals, regionsFor, verifiedBadge, type PublicPro } from "./public-profiles";
const pro = (name: string, rating: number[], completed = 0): PublicPro => ({ slug: name, company_name: name, description: null, postal_codes: ["75"], service_types: [], logo_path: null, portfolio_paths: [], siret_verified: false, insurance_verified: false, completed_count: completed, reviews: rating.map(r => ({ rating: r, comment: null, created_at: "2026-10-19" })) });
describe("public professional rules", () => {
  it("requires 3 portfolio photos to complete the photo checklist", () => {
    expect(profileCompletion({ portfolio_paths: ["a", "b"] }).items[1]?.done).toBe(false);
    expect(profileCompletion({ portfolio_paths: ["a", "b", "c"] }).items[1]?.done).toBe(true);
  });
  it("requires both verification documents for completion", () => {
    expect(profileCompletion({ siret_document_path: "siret" }).items[4]?.done).toBe(false);
    expect(profileCompletion({ siret_document_path: "siret", insurance_document_path: "assurance" }).items[4]?.done).toBe(true);
  });
  it("calculates five equally weighted completion items", () => {
    expect(profileCompletion(null).percent).toBe(0);
    expect(profileCompletion({ logo_path: "logo", portfolio_paths: ["1", "2", "3"], description: "Entreprise", postal_codes: ["16"], siret_document_path: "siret", insurance_document_path: "assurance" }).percent).toBe(100);
  });
  it("requires both SIRET and insurance verification for the badge", () => {
    expect(verifiedBadge({ siret_verified: true, insurance_verified: false })).toBe(false);
    expect(verifiedBadge({ siret_verified: false, insurance_verified: true })).toBe(false);
    expect(verifiedBadge({ siret_verified: true, insurance_verified: true })).toBe(true);
  });
  it("uses actual reviews and no invented default rating", () => {
    expect(averageRating([])).toBe(null);
    expect(averageRating(pro("a", [4, 5]).reviews)).toBe(4.5);
  });
  it("ranks by rating then review count then confirmed missions", () => {
    expect(rankProfessionals([pro("none", [], 10), pro("four", [4], 9), pro("five", [5]), pro("two", [5, 5]), pro("done", [5, 5], 1)]).map(p => p.slug)).toEqual(["done", "two", "five", "four", "none"]);
  });
  it("maps professional postal coverage to the correct regions including overseas", () => {
    expect(regionsFor(["16000", "75"])).toEqual(["Île-de-France", "Nouvelle-Aquitaine"]);
    expect(regionsFor(["97400"])).toEqual(["La Réunion"]);
    expect(regionsFor(["74100"])).toEqual(["Auvergne-Rhône-Alpes"]);
  });
});