export interface CityPage {
  slug: string;
  name: string;
  /** "à Paris", "au Havre", "à Marseille" */
  preposition: string;
  department: string;
  postalCodes: string;
  region: string;
  intro: string;
  context: string[];
  neighborhoods: string[];
}

export const CITIES: CityPage[] = [
  {
    slug: "paris",
    name: "Paris",
    preposition: "à Paris",
    department: "Paris (75)",
    postalCodes: "75001 à 75020",
    region: "Île-de-France",
    intro:
      "Immeubles haussmanniens, escaliers étroits, rues en stationnement payant : le débarras parisien demande une logistique précise. Débarras France estime le volume à partir de vos photos et transmet la demande aux débarrasseurs qui interviennent réellement dans votre arrondissement.",
    context: [
      "Étages sans ascenseur et cages d'escalier étroites : le portage pèse sur le prix, précisez-le dès l'estimation.",
      "Stationnement : une autorisation de voirie peut être nécessaire pour immobiliser le camion.",
      "Caves et chambres de bonne s'ajoutent souvent au volume principal.",
    ],
    neighborhoods: [
      "Paris Centre (1er-4e)",
      "Quartier Latin (5e-6e)",
      "Batignolles (17e)",
      "Belleville (19e-20e)",
      "Montparnasse (14e-15e)",
    ],
  },
  {
    slug: "marseille",
    name: "Marseille",
    preposition: "à Marseille",
    department: "Bouches-du-Rhône (13)",
    postalCodes: "13001 à 13016",
    region: "Provence-Alpes-Côte d'Azur",
    intro:
      "Du centre-ville aux quartiers en collines, les accès marseillais varient énormément d'une rue à l'autre. Débarras France calcule le volume en m³ depuis vos photos, applique les majorations d'accès et vous met en relation avec des débarrasseurs des 16 arrondissements.",
    context: [
      "Rues en pente et voies étroites : le camion se gare parfois loin de l'entrée.",
      "Villas et cabanons avec dépendances, caves et extérieurs à intégrer au volume.",
      "Débarras après succession fréquent sur le parc ancien du centre.",
    ],
    neighborhoods: [
      "Vieux-Port (1er-2e)",
      "La Joliette (2e)",
      "Castellane (6e)",
      "Le Prado (8e)",
      "La Valentine (11e)",
    ],
  },
  {
    slug: "lyon",
    name: "Lyon",
    preposition: "à Lyon",
    department: "Rhône (69)",
    postalCodes: "69001 à 69009",
    region: "Auvergne-Rhône-Alpes",
    intro:
      "Traboules de la Croix-Rousse, immeubles anciens de la Presqu'île, appartements récents de la Part-Dieu : Débarras France adapte l'estimation à la réalité de votre logement lyonnais et diffuse la demande aux pros de la métropole.",
    context: [
      "Immeubles anciens sans ascenseur sur les pentes de la Croix-Rousse.",
      "Zones à circulation réglementée : les pros anticipent le créneau d'intervention.",
      "Caves voûtées fréquentes, souvent chargées en cartons et mobilier.",
    ],
    neighborhoods: [
      "Presqu'île (1er-2e)",
      "Part-Dieu (3e)",
      "Croix-Rousse (4e)",
      "Vieux Lyon (5e)",
      "Gerland (7e)",
    ],
  },
  {
    slug: "toulouse",
    name: "Toulouse",
    preposition: "à Toulouse",
    department: "Haute-Garonne (31)",
    postalCodes: "31000, 31100, 31200, 31300, 31400, 31500",
    region: "Occitanie",
    intro:
      "Maisons toulousaines avec garage et jardin, appartements étudiants, logements en résidence : les volumes varient fortement. Photographiez, obtenez une fourchette de prix, puis comparez les propositions des débarrasseurs toulousains.",
    context: [
      "Maisons de ville avec cour, garage et remise : volumes souvent supérieurs à 30 m³.",
      "Forte rotation étudiante : petits débarras rapides en studio et T2.",
      "Hypercentre à accès restreint : le stationnement se prépare à l'avance.",
    ],
    neighborhoods: ["Capitole", "Saint-Cyprien", "Rangueil", "Borderouge", "Purpan"],
  },
  {
    slug: "nice",
    name: "Nice",
    preposition: "à Nice",
    department: "Alpes-Maritimes (06)",
    postalCodes: "06000, 06100, 06200, 06300",
    region: "Provence-Alpes-Côte d'Azur",
    intro:
      "Entre le Vieux-Nice, les collines de Cimiez et les résidences du bord de mer, l'accès conditionne beaucoup le prix. Débarras France estime votre débarras en photos et vous met en relation avec des pros locaux vérifiés.",
    context: [
      "Ruelles piétonnes du Vieux-Nice : portage à la main sur plusieurs dizaines de mètres.",
      "Résidences avec ascenseur : intervention plus rapide et moins chère.",
      "Logements meublés et locations saisonnières à remettre à blanc entre deux locataires.",
    ],
    neighborhoods: ["Vieux-Nice", "Cimiez", "Libération", "Riquier", "Fabron"],
  },
  {
    slug: "nantes",
    name: "Nantes",
    preposition: "à Nantes",
    department: "Loire-Atlantique (44)",
    postalCodes: "44000, 44100, 44200, 44300",
    region: "Pays de la Loire",
    intro:
      "Maisons nantaises avec cave et jardin, immeubles du centre, logements neufs de l'Île de Nantes : l'estimation Débarras France tient compte du volume réel et de l'accès, puis diffuse la demande aux débarrasseurs de la métropole.",
    context: [
      "Maisons de ville avec cave et grenier : le volume total dépasse souvent l'estimation à l'œil.",
      "Centre-ville avec voies réservées : créneau de chargement à planifier.",
      "Nombreux débarras avant vente ou après succession sur le parc ancien.",
    ],
    neighborhoods: ["Centre-ville", "Île de Nantes", "Doulon", "Saint-Félix", "Zola"],
  },
  {
    slug: "montpellier",
    name: "Montpellier",
    preposition: "à Montpellier",
    department: "Hérault (34)",
    postalCodes: "34000, 34070, 34080, 34090",
    region: "Occitanie",
    intro:
      "L'Écusson piéton, les résidences de Port Marianne, les maisons des quartiers résidentiels : chaque configuration a son coût de portage. Estimez en photos et recevez des propositions de débarrasseurs montpelliérains.",
    context: [
      "Écusson piéton : accès camion limité, portage à la main fréquent.",
      "Résidences récentes avec parking et ascenseur : intervention optimisée.",
      "Logements étudiants à vider rapidement en fin d'année universitaire.",
    ],
    neighborhoods: ["Écusson", "Port Marianne", "Antigone", "Les Beaux-Arts", "Croix d'Argent"],
  },
  {
    slug: "strasbourg",
    name: "Strasbourg",
    preposition: "à Strasbourg",
    department: "Bas-Rhin (67)",
    postalCodes: "67000, 67100, 67200",
    region: "Grand Est",
    intro:
      "Immeubles anciens de la Grande Île, maisons alsaciennes avec grenier et cave : les volumes strasbourgeois sont souvent sous-estimés. Débarras France les calcule à partir de vos photos et contacte les pros du secteur.",
    context: [
      "Greniers aménageables chargés de mobilier ancien et de cartons.",
      "Grande Île classée : circulation et stationnement réglementés.",
      "Caves de maisons alsaciennes fréquemment pleines et à accès étroit.",
    ],
    neighborhoods: ["Grande Île", "Neudorf", "Krutenau", "Robertsau", "Cronenbourg"],
  },
  {
    slug: "bordeaux",
    name: "Bordeaux",
    preposition: "à Bordeaux",
    department: "Gironde (33)",
    postalCodes: "33000, 33100, 33200, 33300, 33800",
    region: "Nouvelle-Aquitaine",
    intro:
      "Échoppes bordelaises, appartements en pierre du centre, maisons avec jardin en périphérie : le débarras bordelais mêle petits et gros volumes. Photographiez, obtenez un prix indicatif, comparez les pros locaux.",
    context: [
      "Échoppes avec combles et arrière-cour : volume total souvent élevé.",
      "Centre historique à rues étroites : stationnement du camion à anticiper.",
      "Débarras avant travaux de rénovation très fréquents sur le parc ancien.",
    ],
    neighborhoods: ["Chartrons", "Saint-Michel", "Nansouty", "Caudéran", "Bastide"],
  },
  {
    slug: "lille",
    name: "Lille",
    preposition: "à Lille",
    department: "Nord (59)",
    postalCodes: "59000, 59260, 59777, 59800",
    region: "Hauts-de-France",
    intro:
      "Maisons 1930 avec cave et grenier, appartements du Vieux-Lille, logements étudiants : Débarras France estime le volume en m³ depuis vos photos et transmet la demande aux débarrasseurs de la métropole lilloise.",
    context: [
      "Maisons de ville sur trois niveaux : escaliers raides, portage plus long.",
      "Caves et greniers systématiques dans le parc ancien.",
      "Vieux-Lille : rues pavées et étroites, camion parfois éloigné de la porte.",
    ],
    neighborhoods: ["Vieux-Lille", "Wazemmes", "Vauban", "Fives", "Lille-Sud"],
  },
];

export const CITY_SLUGS = CITIES.map((c) => c.slug);

export function getCity(slug: string): CityPage | undefined {
  return CITIES.find((c) => c.slug === slug);
}
