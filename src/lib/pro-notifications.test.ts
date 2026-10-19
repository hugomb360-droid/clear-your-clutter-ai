import { describe, expect, it } from "vitest";
import { notificationText, responseDelay } from "./pro-notifications";
describe("Professional alert content", () => {
  it("includes city, cubic volume, AI price range and access", () => {
    const text = notificationText({ city: "Paris", postalCode: "75011", volumeM3: 15, priceMin: 1100, priceMax: 1900, isAi: true, floor: 3, hasElevator: false, access: "Accès difficile" });
    expect(text).toContain("Paris (75011)"); expect(text).toContain("15 m³"); expect(text).toMatch(/IA : 1.?100.*1.?900/); expect(text).toContain("Accès difficile"); expect(text).toContain("Étage 3 sans ascenseur");
  });
  it("does not invent an estimate or access for succession", () => {
    const text = notificationText({ city: null, postalCode: "16000", volumeM3: null, priceMin: null, priceMax: null, isAi: false, floor: null, hasElevator: null, access: null });
    expect(text).toContain("Volume non estimé"); expect(text).toContain("Sur devis"); expect(text).toContain("Accès non renseigné");
  });
  it("includes floor and elevator when recorded", () => {
    expect(notificationText({ city: "Lyon", postalCode: "69001", volumeM3: 6, priceMin: 450, priceMax: 950, isAi: true, floor: 2, hasElevator: true, access: null })).toContain("Étage 2 avec ascenseur");
  });
  it("shows no response delay without real observations", () => { expect(responseDelay(null, 0)).toBeNull(); expect(responseDelay(30, 0)).toBeNull(); });
  it("converts measured delays to hours", () => { expect(responseDelay(120, 4)).toBe("2 h"); });
});