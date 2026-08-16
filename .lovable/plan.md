# Clearo — plateforme de débarras avec devis IA

Marketplace de mise en relation entre particuliers/entreprises à débarrasser et débarrasseurs locaux, avec estimation de prix par IA à partir de photos.

## Identité visuelle

Direction jeune et rassurante, style startup : fond blanc, vert signature (accent vif), typographie sans-serif géométrique, cartes arrondies généreuses, ombres douces, illustrations/photos avant-après. Tokens de couleur définis dans le design system (pas de couleurs en dur).

## Parcours client

1. **Accueil** — promesse claire ("Estimez votre débarras en 2 minutes"), zone d'upload immédiate, réassurance (pros vérifiés, gratuit, sans engagement).
2. **Estimation IA** — le client dépose 1 à 10 photos ; l'IA analyse le contenu (type d'objets, volume estimé en m³, présence d'encombrants, difficulté d'accès) et renvoie une fourchette de prix avec le détail du raisonnement.
3. **Complément manuel** — formulaire : type de bien (appartement, maison, cave, garage, local), surface, étage/ascenseur, date souhaitée, contraintes. Possible aussi sans photo, pour un devis 100 % déclaratif.
4. **Localisation** — adresse/code postal, ce qui détermine la zone d'intervention.
5. **Devis** — récapitulatif chiffré, enregistré dans le compte client, avec un statut (en attente, propositions reçues, accepté).
6. **Mise en relation** — la demande est diffusée aux débarrasseurs couvrant le code postal ; ils envoient une proposition (prix + date) ; le client compare et accepte. Les coordonnées complètes ne sont échangées qu'après acceptation.

## Parcours professionnel

- Inscription pro avec profil : société, SIRET, zones d'intervention (codes postaux/départements), types de débarras acceptés, photos de réalisations.
- Tableau de bord : missions disponibles dans sa zone, envoi de propositions, suivi des missions acceptées.
- Statut de vérification géré côté admin (badge "pro vérifié").

## Pages

- `/` accueil avec upload direct
- `/estimation` tunnel de devis (photos → détails → localisation → résultat)
- `/comment-ca-marche`
- `/pros` page d'atterrissage recrutement débarrasseurs
- `/auth` connexion / inscription (client ou pro)
- `/compte` espace client : mes devis, propositions reçues
- `/pro/dashboard` espace pro : missions, propositions
- `/tarifs`, `/contact`, mentions légales

## Détails techniques

- **Lovable Cloud** activé : base de données, authentification e-mail/mot de passe, stockage des photos.
- **Tables** : `profiles` (rôle client/pro), `user_roles` (table séparée, jamais sur le profil), `pro_profiles` (société, SIRET, zones), `quotes` (devis client, statut, localisation, estimation IA), `quote_photos` (références storage), `bids` (propositions des pros), `missions` (devis accepté). RLS stricte : un client ne voit que ses devis, un pro ne voit que les demandes de ses zones (coordonnées masquées avant acceptation).
- **Storage** : bucket privé pour les photos, accès via URLs signées.
- **IA** : Lovable AI (vision multimodale) appelée depuis une server function. Prompt structuré → sortie JSON validée : volume estimé m³, catégories d'objets, encombrants, prix bas/haut, justification. Grille tarifaire paramétrable (prix au m³ + majorations étage sans ascenseur, encombrants, distance) appliquée côté serveur pour que le prix reste cohérent et ajustable sans réentraîner quoi que ce soit.
- Clé API IA côté serveur uniquement ; gestion explicite des erreurs 429/402 dans l'UI.
- Pas de paiement en ligne dans cette version.

## Hors périmètre v1

Paiement/commission Stripe, messagerie temps réel, notifications SMS, application mobile.
