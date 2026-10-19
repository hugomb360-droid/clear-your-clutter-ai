import { describe, expect, it } from "vitest";
import { successionSchema, reportSchema, referralSchema, reportAvailable } from "./succession.schemas";

const dossier = { address: "12 rue des Lilas", postalCode: "75011", city: "Paris", propertyType: "Maison", fullName: "Camille Test", phone: "0600000000", heirPresent: false, remoteKeys: true, keyInstructions: "L'agence remet les clés", valuables: "Bijoux et albums de famille", furnitureChoice: "don_revente", deadline: "2026-12-15", deadlineReason: "vente", heirsAgreement: true };
describe("Dossier succession", () => {
  it("conserve les consignes d'héritier absent, clés, objets, mobilier et vente", () => {
    expect(successionSchema.parse(dossier)).toMatchObject({ heirPresent: false, remoteKeys: true, keyInstructions: "L'agence remet les clés", valuables: "Bijoux et albums de famille", furnitureChoice: "don_revente", deadline: "2026-12-15", deadlineReason: "vente" });
  });
  it("permet une échéance de fin de bail", () => expect(successionSchema.parse({ ...dossier, deadlineReason: "bail" }).deadlineReason).toBe("bail"));
  it("exige les modalités de remise des clés à distance", () => expect(successionSchema.safeParse({ ...dossier, keyInstructions: "" }).success).toBe(false));
  it("exige l'accord des héritiers", () => expect(successionSchema.safeParse({ ...dossier, heirsAgreement: false }).success).toBe(false));
  it("exige une adresse et un code postal à 5 chiffres", () => {
    expect(successionSchema.safeParse({ ...dossier, address: "" }).success).toBe(false);
    expect(successionSchema.safeParse({ ...dossier, postalCode: "75" }).success).toBe(false);
  });
});
describe("Rapport notaire", () => {
  const report = { bidId: "00000000-0000-4000-8000-000000000001", volumeM3: 22.5, recycling: "Bois au centre de tri ; mobilier donné à Emmaüs." };
  it("enregistre le volume réellement évacué et les destinations", () => expect(reportSchema.parse(report)).toEqual(report));
  it("refuse un volume nul", () => expect(reportSchema.safeParse({ ...report, volumeM3: 0 }).success).toBe(false));
  it("exige les filières de recyclage", () => expect(reportSchema.safeParse({ ...report, recycling: "" }).success).toBe(false));
  it("n'autorise le rapport qu'après fin du chantier et hors litige", () => {
    expect(reportAvailable("accepted")).toBe(false);
    expect(reportAvailable("disputed")).toBe(false);
    expect(reportAvailable("awaiting_confirmation")).toBe(true);
    expect(reportAvailable("completed")).toBe(true);
  });
});
describe("Prescripteurs", () => {
  it.each(["notaire", "agence", "ehpad"])("accepte le contact %s", profession => expect(referralSchema.safeParse({ profession, organization: "Structure Test", name: "Camille Test", email: "test@example.com", phone: "", message: "Demande de partenariat en Charente", consent: true, website: "" }).success).toBe(true));
});