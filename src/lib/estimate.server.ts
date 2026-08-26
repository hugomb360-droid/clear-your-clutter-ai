import { computePrice, type AiAnalysis, type EstimationResult } from "./pricing";

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

const SYSTEM_PROMPT = `Tu es l'expert d'estimation de Débarras France, une plateforme française de débarras.
À partir des photos fournies, tu estimes le volume à débarrasser en mètres cubes (m3)
ainsi que la nature des objets. Sois réaliste : une pièce standard pleine fait 8 à 15 m3, une cave encombrée 4 à 10 m3,
un appartement complet 20 à 45 m3. Réponds UNIQUEMENT avec un objet JSON valide, sans texte autour, au format :
{"volumeM3": number, "categories": string[], "bulkyItems": boolean, "hardAccess": boolean, "confidence": "faible"|"moyenne"|"élevée", "summary": string}
"categories" liste 3 à 6 familles d'objets en français (ex: "mobilier", "électroménager", "cartons", "gravats").
"bulkyItems" vaut true s'il y a des objets lourds ou volumineux (piano, canapé, électroménager, gravats).
"summary" est une phrase en français expliquant l'estimation.`;

export type EstimateContext = {
  propertyType?: string | undefined;
  surfaceM2?: number | undefined;
  floor?: number | undefined;
  hasElevator?: boolean | undefined;
  hardAccess?: boolean | undefined;
  notes?: string | undefined;
  images: string[];
};

function parseAnalysis(raw: string): AiAnalysis {
  const match = raw.match(/\{[\s\S]*\}/);
  const parsed = JSON.parse(match ? match[0] : raw) as Partial<AiAnalysis>;
  const volume = Number(parsed.volumeM3);
  return {
    volumeM3: Number.isFinite(volume) && volume > 0 ? volume : 8,
    categories: Array.isArray(parsed.categories) ? parsed.categories.slice(0, 6) : [],
    bulkyItems: Boolean(parsed.bulkyItems),
    hardAccess: Boolean(parsed.hardAccess),
    confidence:
      parsed.confidence === "élevée" || parsed.confidence === "faible"
        ? parsed.confidence
        : "moyenne",
    summary: typeof parsed.summary === "string" ? parsed.summary : "Estimation générée par Débarras France.",
  };
}

export async function runEstimation(input: EstimateContext): Promise<EstimationResult> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("Le service d'estimation est indisponible.");

  const details = [
    `Type de bien : ${input.propertyType}`,
    input.surfaceM2 ? `Surface : ${input.surfaceM2} m2` : null,
    `Étage : ${input.floor}${input.hasElevator ? " (avec ascenseur)" : " (sans ascenseur)"}`,
    input.notes ? `Précisions du client : ${input.notes}` : null,
    input.images.length
      ? `${input.images.length} photo(s) jointes.`
      : "Aucune photo : base-toi sur les informations déclarées.",
  ]
    .filter(Boolean)
    .join("\n");

  const content: Array<Record<string, unknown>> = [{ type: "text", text: details }];
  for (const image of input.images.slice(0, 8)) {
    content.push({ type: "image_url", image_url: { url: image } });
  }

  const response = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "google/gemini-3.5-flash",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content },
      ],
    }),
  });

  if (response.status === 429) {
    throw new Error("Trop de demandes en même temps. Merci de réessayer dans une minute.");
  }
  if (response.status === 402) {
    throw new Error("Le service d'estimation est momentanément indisponible (crédits épuisés).");
  }
  if (!response.ok) {
    console.error("AI gateway error", response.status, await response.text());
    throw new Error("L'estimation automatique a échoué. Réessayez ou demandez un devis manuel.");
  }

  const payload = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const raw = payload.choices?.[0]?.message?.content ?? "";

  let analysis: AiAnalysis;
  try {
    analysis = parseAnalysis(raw);
  } catch {
    throw new Error("Réponse de l'IA illisible. Réessayez avec d'autres photos.");
  }

  if (input.hardAccess) analysis.hardAccess = true;

  const price = computePrice({
    volumeM3: analysis.volumeM3,
    floor: input.floor ?? 0,
    hasElevator: input.hasElevator ?? false,
    bulkyItems: analysis.bulkyItems,
    hardAccess: analysis.hardAccess || (input.hardAccess ?? false),
  });

  return { analysis, price };
}
