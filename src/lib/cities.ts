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
  {
    slug: "rennes",
    name: "Rennes",
    preposition: "à Rennes",
    department: "Ille-et-Vilaine (35)",
    postalCodes: "35000 à 35700",
    region: "Bretagne",
    intro:
      "Débarras à Rennes : Ville étudiante en forte croissance, les rotations de logements y sont rapides et les débarras de studios très fréquents. Débarras France estime le volume en m³ directement depuis vos photos, applique les majorations d'accès, puis transmet votre demande aux débarrasseurs vérifiés qui interviennent réellement en Bretagne sur Ille-et-Vilaine (35).",
    context: [
      "Centre historique piéton : créneaux de livraison limités et portage à prévoir.",
      "Nombreux studios et colocations meublés à vider entre deux locations.",
      "Maisons de faubourg avec grenier et cabanon de jardin à intégrer au volume.",
    ],
    neighborhoods: ["Centre-ville", "Villejean", "Beaulieu", "Sud-Gare", "Thabor"],
  },
  {
    slug: "reims",
    name: "Reims",
    preposition: "à Reims",
    department: "Marne (51)",
    postalCodes: "51100 à 51500",
    region: "Grand Est",
    intro:
      "Débarras à Reims : Entre maisons champenoises et immeubles du centre, les caves voûtées représentent souvent la moitié du volume à évacuer. Débarras France estime le volume en m³ directement depuis vos photos, applique les majorations d'accès, puis transmet votre demande aux débarrasseurs vérifiés qui interviennent réellement en Grand Est sur Marne (51).",
    context: [
      "Caves profondes et escaliers étroits typiques du bâti rémois.",
      "Débarras après succession courant sur le parc ancien.",
      "Stationnement réglementé autour de la cathédrale.",
    ],
    neighborhoods: ["Centre-ville", "Clairmarais", "Croix-Rouge", "Cernay", "Tinqueux"],
  },
  {
    slug: "le-havre",
    name: "Le Havre",
    preposition: "au Havre",
    department: "Seine-Maritime (76)",
    postalCodes: "76600 à 76620",
    region: "Normandie",
    intro:
      "Débarras au Havre : Le bâti Perret en centre-ville impose des ascenseurs de petite taille : le portage conditionne fortement le tarif. Débarras France estime le volume en m³ directement depuis vos photos, applique les majorations d'accès, puis transmet votre demande aux débarrasseurs vérifiés qui interviennent réellement en Normandie sur Seine-Maritime (76).",
    context: [
      "Appartements Perret avec ascenseurs étroits et caves collectives.",
      "Vent et pluie fréquents : bâchage du camion à prévoir.",
      "Maisons de la côte avec sous-sol complet et garage.",
    ],
    neighborhoods: ["Centre reconstruit", "Sainte-Adresse", "Danton", "Caucriauville", "Les Docks"],
  },
  {
    slug: "saint-etienne",
    name: "Saint-Étienne",
    preposition: "à Saint-Étienne",
    department: "Loire (42)",
    postalCodes: "42000 à 42230",
    region: "Auvergne-Rhône-Alpes",
    intro:
      "Débarras à Saint-Étienne : Maisons de mineurs, immeubles anciens et fort volume de biens vendus vides : les débarras complets y sont la norme. Débarras France estime le volume en m³ directement depuis vos photos, applique les majorations d'accès, puis transmet votre demande aux débarrasseurs vérifiés qui interviennent réellement en Auvergne-Rhône-Alpes sur Loire (42).",
    context: [
      "Rues en pente et accès camion difficile sur certains quartiers.",
      "Maisons ouvrières avec cave, buanderie et courette encombrées.",
      "Nombreux débarras avant travaux de rénovation.",
    ],
    neighborhoods: ["Centre-Deux", "Bellevue", "Carnot", "Montreynaud", "Saint-Victor"],
  },
  {
    slug: "toulon",
    name: "Toulon",
    preposition: "à Toulon",
    department: "Var (83)",
    postalCodes: "83000 à 83200",
    region: "Provence-Alpes-Côte d'Azur",
    intro:
      "Débarras à Toulon : Entre centre dense et collines résidentielles, l'accès camion varie fortement d'une rue à l'autre. Débarras France estime le volume en m³ directement depuis vos photos, applique les majorations d'accès, puis transmet votre demande aux débarrasseurs vérifiés qui interviennent réellement en Provence-Alpes-Côte d\'Azur sur Var (83).",
    context: [
      "Ruelles étroites du centre ancien : véhicule léger parfois obligatoire.",
      "Villas avec extérieur, pool house et abri de jardin à débarrasser.",
      "Résidences en hauteur avec voie privée à valider avant intervention.",
    ],
    neighborhoods: ["Le Mourillon", "Centre ancien", "Saint-Jean-du-Var", "Pont-du-Las", "La Rode"],
  },
  {
    slug: "grenoble",
    name: "Grenoble",
    preposition: "à Grenoble",
    department: "Isère (38)",
    postalCodes: "38000 à 38100",
    region: "Auvergne-Rhône-Alpes",
    intro:
      "Débarras à Grenoble : Beaucoup de grandes copropriétés des années 60-70 avec caves individuelles saturées de matériel de montagne. Débarras France estime le volume en m³ directement depuis vos photos, applique les majorations d'accès, puis transmet votre demande aux débarrasseurs vérifiés qui interviennent réellement en Auvergne-Rhône-Alpes sur Isère (38).",
    context: [
      "Caves et locaux à skis souvent aussi remplis que le logement.",
      "Copropriétés avec ascenseurs de faible capacité.",
      "Débarras de logements étudiants en juin et juillet.",
    ],
    neighborhoods: ["Championnet", "Île Verte", "Villeneuve", "Berriat", "Malherbe"],
  },
  {
    slug: "dijon",
    name: "Dijon",
    preposition: "à Dijon",
    department: "Côte-d'Or (21)",
    postalCodes: "21000",
    region: "Bourgogne-Franche-Comté",
    intro:
      "Débarras à Dijon : Le secteur sauvegardé impose des contraintes de circulation qui allongent le portage en centre-ville. Débarras France estime le volume en m³ directement depuis vos photos, applique les majorations d'accès, puis transmet votre demande aux débarrasseurs vérifiés qui interviennent réellement en Bourgogne-Franche-Comté sur Côte-d'Or (21).",
    context: [
      "Zone piétonne du centre : autorisation de circulation à anticiper.",
      "Hôtels particuliers avec caves voûtées et combles.",
      "Pavillons de périphérie avec garage double et abri de jardin.",
    ],
    neighborhoods: ["Centre historique", "Chenôve limitrophe", "Fontaine-d'Ouche", "Toison d'Or", "Montchapet"],
  },
  {
    slug: "angers",
    name: "Angers",
    preposition: "à Angers",
    department: "Maine-et-Loire (49)",
    postalCodes: "49000 à 49100",
    region: "Pays de la Loire",
    intro:
      "Débarras à Angers : Beaucoup de maisons de ville avec dépendances : le volume réel dépasse souvent l'estimation faite à l'œil. Débarras France estime le volume en m³ directement depuis vos photos, applique les majorations d'accès, puis transmet votre demande aux débarrasseurs vérifiés qui interviennent réellement en Pays de la Loire sur Maine-et-Loire (49).",
    context: [
      "Maisons de ville avec cave, grenier et petit jardin arrière.",
      "Centre historique aux rues étroites et pavées.",
      "Marché locatif dynamique : débarras rapides entre deux baux.",
    ],
    neighborhoods: ["Doutre", "Centre-ville", "Belle-Beille", "Monplaisir", "Justices"],
  },
  {
    slug: "nimes",
    name: "Nîmes",
    preposition: "à Nîmes",
    department: "Gard (30)",
    postalCodes: "30000 à 30900",
    region: "Occitanie",
    intro:
      "Débarras à Nîmes : L'Écusson, cœur ancien de la ville, combine ruelles étroites et immeubles sans ascenseur. Débarras France estime le volume en m³ directement depuis vos photos, applique les majorations d'accès, puis transmet votre demande aux débarrasseurs vérifiés qui interviennent réellement en Occitanie sur Gard (30).",
    context: [
      "Écusson : accès camion restreint, navettes fréquentes.",
      "Mas et villas périphériques avec dépendances agricoles.",
      "Fortes chaleurs estivales : interventions planifiées tôt le matin.",
    ],
    neighborhoods: ["Écusson", "Route d'Alès", "Costières", "Mas de Mingue", "Jean Jaurès"],
  },
  {
    slug: "villeurbanne",
    name: "Villeurbanne",
    preposition: "à Villeurbanne",
    department: "Rhône (69)",
    postalCodes: "69100",
    region: "Auvergne-Rhône-Alpes",
    intro:
      "Débarras à Villeurbanne : Gratte-ciel, immeubles récents et anciens ateliers : les configurations de débarras y sont très variées. Débarras France estime le volume en m³ directement depuis vos photos, applique les majorations d'accès, puis transmet votre demande aux débarrasseurs vérifiés qui interviennent réellement en Auvergne-Rhône-Alpes sur Rhône (69).",
    context: [
      "Immeubles anciens sans ascenseur autour des Gratte-Ciel.",
      "Anciens ateliers et locaux professionnels à vider.",
      "Stationnement dense : réservation d'emplacement conseillée.",
    ],
    neighborhoods: ["Gratte-Ciel", "Charpennes", "Cusset", "La Doua", "Tonkin"],
  },
  {
    slug: "clermont-ferrand",
    name: "Clermont-Ferrand",
    preposition: "à Clermont-Ferrand",
    department: "Puy-de-Dôme (63)",
    postalCodes: "63000 à 63100",
    region: "Auvergne-Rhône-Alpes",
    intro:
      "Débarras à Clermont-Ferrand : Maisons en pierre de Volvic avec caves profondes et rues pentues autour du centre. Débarras France estime le volume en m³ directement depuis vos photos, applique les majorations d'accès, puis transmet votre demande aux débarrasseurs vérifiés qui interviennent réellement en Auvergne-Rhône-Alpes sur Puy-de-Dôme (63).",
    context: [
      "Caves semi-enterrées et escaliers raides.",
      "Rues en pente : stationnement du camion à sécuriser.",
      "Nombreux débarras de maisons familiales après succession.",
    ],
    neighborhoods: ["Centre-ville", "Montferrand", "Les Salins", "Croix-de-Neyrat", "Jaude"],
  },
  {
    slug: "le-mans",
    name: "Le Mans",
    preposition: "au Mans",
    department: "Sarthe (72)",
    postalCodes: "72000 à 72100",
    region: "Pays de la Loire",
    intro:
      "Débarras au Mans : Cité Plantagenêt en haut, quartiers pavillonnaires en bas : deux logiques d'accès très différentes. Débarras France estime le volume en m³ directement depuis vos photos, applique les majorations d'accès, puis transmet votre demande aux débarrasseurs vérifiés qui interviennent réellement en Pays de la Loire sur Sarthe (72).",
    context: [
      "Vieux Mans : rues pavées étroites, portage manuel important.",
      "Pavillons avec garage, atelier et abri de jardin.",
      "Volumes importants lors des ventes de maisons familiales.",
    ],
    neighborhoods: ["Cité Plantagenêt", "Bellevue", "Sablons", "Pontlieue", "Novaxis"],
  },
  {
    slug: "aix-en-provence",
    name: "Aix-en-Provence",
    preposition: "à Aix-en-Provence",
    department: "Bouches-du-Rhône (13)",
    postalCodes: "13080 à 13100",
    region: "Provence-Alpes-Côte d'Azur",
    intro:
      "Débarras à Aix-en-Provence : Centre ancien protégé et bastides périphériques : le débarras y demande souvent une navette véhicule léger. Débarras France estime le volume en m³ directement depuis vos photos, applique les majorations d'accès, puis transmet votre demande aux débarrasseurs vérifiés qui interviennent réellement en Provence-Alpes-Côte d\'Azur sur Bouches-du-Rhône (13).",
    context: [
      "Centre historique piéton : navette obligatoire vers le camion.",
      "Bastides et villas avec caves, garages et extérieurs.",
      "Marché locatif étudiant très actif à la rentrée.",
    ],
    neighborhoods: ["Mazarin", "Cours Mirabeau", "Jas de Bouffan", "Encagnane", "Puyricard"],
  },
  {
    slug: "brest",
    name: "Brest",
    preposition: "à Brest",
    department: "Finistère (29)",
    postalCodes: "29200",
    region: "Bretagne",
    intro:
      "Débarras à Brest : Immeubles de la reconstruction avec caves collectives et maisons de quartier à sous-sol complet. Débarras France estime le volume en m³ directement depuis vos photos, applique les majorations d'accès, puis transmet votre demande aux débarrasseurs vérifiés qui interviennent réellement en Bretagne sur Finistère (29).",
    context: [
      "Caves collectives partagées : identification du lot avant intervention.",
      "Sous-sols complets sous les maisons des quartiers résidentiels.",
      "Météo humide : protection des accès et bâchage.",
    ],
    neighborhoods: ["Siam", "Recouvrance", "Saint-Marc", "Lambézellec", "Bellevue"],
  },
  {
    slug: "tours",
    name: "Tours",
    preposition: "à Tours",
    department: "Indre-et-Loire (37)",
    postalCodes: "37000 à 37100",
    region: "Centre-Val de Loire",
    intro:
      "Débarras à Tours : Maisons tourangelles avec caves creusées dans le tuffeau, souvent chargées jusqu'au fond. Débarras France estime le volume en m³ directement depuis vos photos, applique les majorations d'accès, puis transmet votre demande aux débarrasseurs vérifiés qui interviennent réellement en Centre-Val de Loire sur Indre-et-Loire (37).",
    context: [
      "Caves en tuffeau profondes et humides.",
      "Vieux-Tours : rues étroites et zone piétonne.",
      "Nombreuses successions sur le parc de maisons anciennes.",
    ],
    neighborhoods: ["Vieux-Tours", "Prébendes", "Rabelais", "Sanitas", "Tours-Nord"],
  },
  {
    slug: "amiens",
    name: "Amiens",
    preposition: "à Amiens",
    department: "Somme (80)",
    postalCodes: "80000 à 80090",
    region: "Hauts-de-France",
    intro:
      "Débarras à Amiens : Maisons amiénoises étroites en enfilade : le portage se fait par un couloir unique, ce qui rallonge le chantier. Débarras France estime le volume en m³ directement depuis vos photos, applique les majorations d'accès, puis transmet votre demande aux débarrasseurs vérifiés qui interviennent réellement en Hauts-de-France sur Somme (80).",
    context: [
      "Maisons de ville étroites avec escalier unique.",
      "Cours arrière et remises souvent oubliées dans l'estimation.",
      "Centre-ville avec zones de livraison réglementées.",
    ],
    neighborhoods: ["Saint-Leu", "Henriville", "Saint-Acheul", "Étouvie", "Amiens Nord"],
  },
  {
    slug: "limoges",
    name: "Limoges",
    preposition: "à Limoges",
    department: "Haute-Vienne (87)",
    postalCodes: "87000 à 87280",
    region: "Nouvelle-Aquitaine",
    intro:
      "Débarras à Limoges : Grandes maisons bourgeoises et pavillons avec sous-sols entiers : les volumes dépassent souvent 40 m³. Débarras France estime le volume en m³ directement depuis vos photos, applique les majorations d'accès, puis transmet votre demande aux débarrasseurs vérifiés qui interviennent réellement en Nouvelle-Aquitaine sur Haute-Vienne (87).",
    context: [
      "Sous-sols complets et greniers aménagés très chargés.",
      "Quartier de la Boucherie : accès camion difficile.",
      "Débarras avant vente fréquents sur le parc ancien.",
    ],
    neighborhoods: ["Centre-ville", "La Boucherie", "Beaubreuil", "Landouge", "Vanteaux"],
  },
  {
    slug: "annecy",
    name: "Annecy",
    preposition: "à Annecy",
    department: "Haute-Savoie (74)",
    postalCodes: "74000 à 74960",
    region: "Auvergne-Rhône-Alpes",
    intro:
      "Débarras à Annecy : Vieille ville protégée, forte saisonnalité touristique et caves remplies de matériel de sport. Débarras France estime le volume en m³ directement depuis vos photos, applique les majorations d'accès, puis transmet votre demande aux débarrasseurs vérifiés qui interviennent réellement en Auvergne-Rhône-Alpes sur Haute-Savoie (74).",
    context: [
      "Vieille ville piétonne : accès camion très encadré.",
      "Locations saisonnières à remettre en état entre deux saisons.",
      "Caves et garages pleins d'équipements de montagne.",
    ],
    neighborhoods: ["Vieille ville", "Novel", "Les Marquisats", "Cran-Gevrier", "Seynod"],
  },
  {
    slug: "perpignan",
    name: "Perpignan",
    preposition: "à Perpignan",
    department: "Pyrénées-Orientales (66)",
    postalCodes: "66000 à 66100",
    region: "Occitanie",
    intro:
      "Débarras à Perpignan : Centre ancien très dense et logements souvent vidés avant rénovation lourde. Débarras France estime le volume en m³ directement depuis vos photos, applique les majorations d'accès, puis transmet votre demande aux débarrasseurs vérifiés qui interviennent réellement en Occitanie sur Pyrénées-Orientales (66).",
    context: [
      "Ruelles du centre ancien inaccessibles aux gros porteurs.",
      "Débarras avant travaux de rénovation fréquents.",
      "Maisons avec patio, terrasse et remise.",
    ],
    neighborhoods: ["Centre ancien", "Saint-Jacques", "Moulin-à-Vent", "Le Vernet", "Saint-Assiscle"],
  },
  {
    slug: "besancon",
    name: "Besançon",
    preposition: "à Besançon",
    department: "Doubs (25)",
    postalCodes: "25000",
    region: "Bourgogne-Franche-Comté",
    intro:
      "Débarras à Besançon : La Boucle historique impose des accès contraints et des immeubles anciens sans ascenseur. Débarras France estime le volume en m³ directement depuis vos photos, applique les majorations d'accès, puis transmet votre demande aux débarrasseurs vérifiés qui interviennent réellement en Bourgogne-Franche-Comté sur Doubs (25).",
    context: [
      "Boucle du Doubs : rues étroites et circulation limitée.",
      "Immeubles anciens de 4 à 5 étages sans ascenseur.",
      "Maisons des coteaux avec accès en pente.",
    ],
    neighborhoods: ["La Boucle", "Battant", "Palente", "Planoise", "Chaprais"],
  },
  {
    slug: "metz",
    name: "Metz",
    preposition: "à Metz",
    department: "Moselle (57)",
    postalCodes: "57000 à 57070",
    region: "Grand Est",
    intro:
      "Débarras à Metz : Immeubles allemands du quartier impérial avec caves voûtées et hauts plafonds chargés de rangements. Débarras France estime le volume en m³ directement depuis vos photos, applique les majorations d'accès, puis transmet votre demande aux débarrasseurs vérifiés qui interviennent réellement en Grand Est sur Moselle (57).",
    context: [
      "Caves voûtées profondes du quartier impérial.",
      "Escaliers larges mais nombreux étages sans ascenseur.",
      "Débarras de maisons familiales en périphérie.",
    ],
    neighborhoods: ["Quartier impérial", "Sablon", "Borny", "Devant-les-Ponts", "Centre-ville"],
  },
  {
    slug: "orleans",
    name: "Orléans",
    preposition: "à Orléans",
    department: "Loiret (45)",
    postalCodes: "45000 à 45100",
    region: "Centre-Val de Loire",
    intro:
      "Débarras à Orléans : Centre historique piétonnier et pavillons de la périphérie avec garages saturés. Débarras France estime le volume en m³ directement depuis vos photos, applique les majorations d'accès, puis transmet votre demande aux débarrasseurs vérifiés qui interviennent réellement en Centre-Val de Loire sur Loiret (45).",
    context: [
      "Zone piétonne du centre : créneaux horaires imposés.",
      "Pavillons avec garage, atelier et abri de jardin.",
      "Nombreux débarras liés aux mutations professionnelles.",
    ],
    neighborhoods: ["Centre-ville", "La Source", "Saint-Marceau", "Dunois", "Madeleine"],
  },
  {
    slug: "rouen",
    name: "Rouen",
    preposition: "à Rouen",
    department: "Seine-Maritime (76)",
    postalCodes: "76000 à 76100",
    region: "Normandie",
    intro:
      "Débarras à Rouen : Maisons à colombages et immeubles anciens : escaliers raides et paliers exigus rallongent le portage. Débarras France estime le volume en m³ directement depuis vos photos, applique les majorations d'accès, puis transmet votre demande aux débarrasseurs vérifiés qui interviennent réellement en Normandie sur Seine-Maritime (76).",
    context: [
      "Escaliers en colimaçon dans le vieux Rouen.",
      "Caves anciennes humides à vider entièrement.",
      "Rive gauche : pavillons avec sous-sol et jardin.",
    ],
    neighborhoods: ["Vieux-Rouen", "Saint-Sever", "Jouvenet", "Grammont", "Croisset"],
  },
  {
    slug: "mulhouse",
    name: "Mulhouse",
    preposition: "à Mulhouse",
    department: "Haut-Rhin (68)",
    postalCodes: "68100 à 68200",
    region: "Grand Est",
    intro:
      "Débarras à Mulhouse : Cités ouvrières et immeubles de rapport : beaucoup de logements vidés intégralement avant relocation. Débarras France estime le volume en m³ directement depuis vos photos, applique les majorations d'accès, puis transmet votre demande aux débarrasseurs vérifiés qui interviennent réellement en Grand Est sur Haut-Rhin (68).",
    context: [
      "Cités ouvrières avec remises et jardins attenants.",
      "Immeubles de rapport à vider entre deux locataires.",
      "Caves individuelles fréquemment saturées.",
    ],
    neighborhoods: ["Centre historique", "Bourtzwiller", "Dornach", "Rebberg", "Drouot"],
  },
  {
    slug: "caen",
    name: "Caen",
    preposition: "à Caen",
    department: "Calvados (14)",
    postalCodes: "14000",
    region: "Normandie",
    intro:
      "Débarras à Caen : Immeubles de la reconstruction et maisons en pierre de Caen avec greniers difficilement accessibles. Débarras France estime le volume en m³ directement depuis vos photos, applique les majorations d'accès, puis transmet votre demande aux débarrasseurs vérifiés qui interviennent réellement en Normandie sur Calvados (14).",
    context: [
      "Greniers accessibles par trappe : manutention lente.",
      "Caves collectives des immeubles reconstruits.",
      "Débarras étudiants concentrés en fin d'année universitaire.",
    ],
    neighborhoods: ["Centre-ville", "Vaucelles", "Chemin Vert", "Beaulieu", "Grâce de Dieu"],
  },
  {
    slug: "nancy",
    name: "Nancy",
    preposition: "à Nancy",
    department: "Meurthe-et-Moselle (54)",
    postalCodes: "54000 à 54100",
    region: "Grand Est",
    intro:
      "Débarras à Nancy : Appartements bourgeois de grande surface autour de Stanislas : volumes élevés et mobilier lourd. Débarras France estime le volume en m³ directement depuis vos photos, applique les majorations d'accès, puis transmet votre demande aux débarrasseurs vérifiés qui interviennent réellement en Grand Est sur Meurthe-et-Moselle (54).",
    context: [
      "Grands appartements anciens avec mobilier massif.",
      "Accès réglementé autour de la place Stanislas.",
      "Maisons Art nouveau avec caves et combles chargés.",
    ],
    neighborhoods: ["Stanislas", "Saint-Nicolas", "Haussonville", "Poincaré", "Boudonville"],
  },
  {
    slug: "boulogne-billancourt",
    name: "Boulogne-Billancourt",
    preposition: "à Boulogne-Billancourt",
    department: "Hauts-de-Seine (92)",
    postalCodes: "92100",
    region: "Île-de-France",
    intro:
      "Débarras à Boulogne-Billancourt : Copropriétés denses avec parkings souterrains : hauteur sous plafond et créneaux d'ascenseur à vérifier. Débarras France estime le volume en m³ directement depuis vos photos, applique les majorations d'accès, puis transmet votre demande aux débarrasseurs vérifiés qui interviennent réellement en Île-de-France sur Hauts-de-Seine (92).",
    context: [
      "Parkings souterrains limités en hauteur pour les camions.",
      "Réservation d'ascenseur obligatoire dans de nombreuses copropriétés.",
      "Caves et boxes à débarrasser en complément du logement.",
    ],
    neighborhoods: ["Marcel Sembat", "Point du Jour", "Billancourt", "Les Princes", "République"],
  },
  {
    slug: "versailles",
    name: "Versailles",
    preposition: "à Versailles",
    department: "Yvelines (78)",
    postalCodes: "78000",
    region: "Île-de-France",
    intro:
      "Débarras à Versailles : Grands appartements anciens et hôtels particuliers : mobilier volumineux et objets de valeur à trier. Débarras France estime le volume en m³ directement depuis vos photos, applique les majorations d'accès, puis transmet votre demande aux débarrasseurs vérifiés qui interviennent réellement en Île-de-France sur Yvelines (78).",
    context: [
      "Appartements haussmanniens avec mobilier ancien lourd.",
      "Tri des objets de valeur et rachat éventuel avant évacuation.",
      "Rues protégées : stationnement du camion à déclarer.",
    ],
    neighborhoods: ["Notre-Dame", "Saint-Louis", "Montreuil", "Chantiers", "Porchefontaine"],
  },
  {
    slug: "angouleme",
    name: "Angoulême",
    preposition: "à Angoulême",
    department: "Charente (16)",
    postalCodes: "16000",
    region: "Nouvelle-Aquitaine",
    intro:
      "Débarras à Angoulême : Le plateau historique et ses remparts imposent des accès étroits, tandis que la périphérie compte de grandes maisons à vider. Débarras France estime le volume en m³ directement depuis vos photos, applique les majorations d'accès, puis transmet votre demande aux débarrasseurs vérifiés qui interviennent réellement en Nouvelle-Aquitaine sur Charente (16).",
    context: [
      "Plateau intra-muros : rues étroites et sens uniques.",
      "Maisons charentaises avec grange, cave et dépendances.",
      "Débarras après succession fréquents dans le centre ancien.",
    ],
    neighborhoods: ["Plateau", "Saint-Cybard", "Ma Campagne", "L'Houmeau", "Bel-Air"],
  },
  {
    slug: "saint-denis",
    name: "Saint-Denis",
    preposition: "à Saint-Denis",
    department: "Seine-Saint-Denis (93)",
    postalCodes: "93200 à 93210",
    region: "Île-de-France",
    intro:
      "Débarras à Saint-Denis : Grandes copropriétés et pavillons anciens : la rotation locative génère de nombreux débarras complets. Débarras France estime le volume en m³ directement depuis vos photos, applique les majorations d'accès, puis transmet votre demande aux débarrasseurs vérifiés qui interviennent réellement en Île-de-France sur Seine-Saint-Denis (93).",
    context: [
      "Copropriétés avec ascenseurs de petite capacité.",
      "Pavillons avec sous-sol, cour et remise.",
      "Stationnement dense : emplacement à réserver.",
    ],
    neighborhoods: ["Centre-ville", "Pleyel", "La Plaine", "Floréal", "Franc-Moisin"],
  },
];

export const CITY_SLUGS = CITIES.map((c) => c.slug);

export function getCity(slug: string): CityPage | undefined {
  return CITIES.find((c) => c.slug === slug);
}
