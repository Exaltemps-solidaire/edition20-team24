# Plan d'itérations — La Cloche, planning formations

**Plan validé le 2026-11-18.**

- **Source du plan** : proposé par l'agent (aucun plan d'itérations trouvé dans la passation : ni fichier `cadrage/*iteration*`, ni clé `iterations` dans `passation.json`).
- **Temps restant annoncé** : 30 minutes, à 2026-11-18 (heure de la question).
- **Durée du tour de test de l'équipe dans PM Lab** : 10 minutes.
- **Temps restant au début de l'itération 1** : ~25-30 minutes, à 2026-11-18.
- **Temps restant annoncé pour la replanification (itération 2)** : 15 minutes, à 2026-11-18. Tour de test toujours estimé à 10 minutes.
- **Plan de l'itération 2 validé tel quel le 2026-11-18.** Temps restant confirmé au début de l'itération 2 : ~15 minutes.
- **Hors périmètre du programme** (voir `passation/cadrage/7-prd.md`, section « Hors périmètre ») : gestion des obligations Qualiopi, comptes bénévoles dans Softr, suivi financier, gestion des contenus pédagogiques, autres antennes, connexion/mot de passe.

## ✂️ Le temps ne permet qu'une seule itération

Avec 30 minutes et un minimum incompressible de ~5 minutes de publication + 10 minutes de tour de test par itération, une seconde itération ne tiendrait que si elle ne coûtait presque rien à coder — et il resterait alors à peine quelques minutes pour la publier et la faire tester, ce qui est trop juste pour être fiable. Je ne détaille donc qu'**une itération**, qui pose le squelette déployé et le premier écran du cas passant. Le reste du programme (composition d'équipe, appel aux bénévoles, tableau de bord responsable, alertes) est en liste « À venir » et sera découpé au fil de l'eau, selon le temps qui restera réellement annoncé au début de la prochaine itération.

Si le temps restant venait à être prolongé, dis-le-moi : je redécoupe immédiatement une itération 2 utile (la plus naturelle : composition de l'équipe).

## Itération 1 : la coordinatrice voit le calendrier des sessions avec leur badge complet/incomplet

- **Dans le périmètre** :
  - une route `GET /api/v1/sessions` sur l'API (8081) qui renvoie une liste de sessions **en dur** (module, date, type, équipe assignée) ;
  - une fonction pure qui calcule le badge d'une session (« équipe complète » / « équipe incomplète ») à partir de la règle de l'association : moins d'une demi-journée → 1 salarié·e + 1 bénévole ; journée entière → 2 salarié·es + 1 bénévole (règle citée dans `passation/cadrage/7-prd.md`) ;
  - l'écran « Calendrier des sessions » sur le front (8080), qui appelle l'API en chemin relatif (`/api/v1/sessions`) et affiche la liste avec le badge ;
  - `.env.example` et `DEPLOIEMENT.md` à la racine, posés dès ce premier commit (contrat de déployabilité) ;
  - déploiement sur le serveur selon `docs/guidelines-deploiement.md` (c'est-à-dire le `/CLAUDE.md` racine du serveur) et signalement `version-prete` (numéro 1).
- **Hors périmètre** : création de session, composition d'équipe (sélection de personnes), appel aux bénévoles par mail/Fillout, tableau de bord responsable, alerte J-7, écran « Qui êtes-vous ? » (persona), confirmation commerce. Tout est reporté.
- **Critères d'acceptation** (3 au plus) :
  - Étant donné l'application déployée, quand on ouvre l'URL racine, alors on voit la liste des sessions avec, pour chacune, son badge « équipe complète » ou « équipe incomplète ».
  - Étant donné une session avec une équipe incomplète pour sa durée (ex. journée entière avec un seul salarié·e), quand la fonction de badge est appelée, alors elle renvoie « incomplète ».
  - Étant donné l'application déployée, quand on appelle `$URL_PUBLIQUE/health` et `$URL_PUBLIQUE/sante`, alors les deux répondent 200 (à vérifier par le développeur dans son navigateur, sans bloquer le signal).
- **Hypothèse de l'équipe couverte** : « Nous croyons que le calendrier commun avec badge permet à la responsable d'antenne de repérer les équipes incomplètes sans ouvrir chaque session » — partiellement : le badge existe et s'affiche, mais la responsable d'antenne et son tableau de bord Softr-équivalent arrivent dans une itération suivante. Pour l'instant c'est la coordinatrice qui voit l'écran.
- **Codage estimé** : 10 minutes.
- **Fichiers prévus** (~5, hors tests) :
  - `api/src/routes.ts` (route `/api/v1/sessions` + fonction de calcul du badge)
  - `frontend/src/app/page.tsx` (écran calendrier des sessions)
  - `.env.example`
  - `DEPLOIEMENT.md`
  - `podman-compose.yml` si nécessaire côté dépôt (sinon géré uniquement côté serveur)
- **Tests unitaires prévus** : 1 à 3, sur la fonction de calcul du badge (règle 1 salarié·e + 1 bénévole / 2 salarié·es + 1 bénévole selon la durée, et les cas complet/incomplet) — pas de test sur le balisage de l'écran.
- **Étapes ajoutées à la démo** (`e2e/demo.spec.ts`) : ouvrir l'application, vérifier que la liste des sessions avec badges s'affiche.
- **Bilan** :
  - Durée de codage réelle : 2 minutes (budget de 10 minutes respecté, pas de dépassement).
  - Critères d'acceptation : les trois satisfaits (liste affichée avec badges, règle d'équipe testée, `/health` et `/sante` répondent 200 en local sur 8080/8081 — à confirmer par le développeur sur `$URL_PUBLIQUE`).
  - Rien de reporté par rapport au périmètre de cette itération.
  - Le harnais n'a rien bloqué : `npm test` passe (5 tests), `./scripts/verifier-deployabilite.sh` ne signale aucune borne ni alarme, `signaler-version.sh 1` a été accepté (`moteur_avance: false` — la squad voit et teste la version, sans faire avancer le parcours PM Lab).
  - ⚠️ Limite constatée en local : le routage `/api/*` vers le port 8081 est fait par la passerelle publique (apisix), injoignable depuis la VM. En local, `curl localhost:8080/api/v1/sessions` ne répond pas (seul `curl localhost:8081/api/v1/sessions` fonctionne) ; la démo Playwright jouée en local sur `localhost:8080` échoue donc sur l'étape du badge (fetch relatif qui ne trouve pas l'API sur ce port), alors que `GET /api/v1/sessions` fonctionne bien en direct sur 8081. Ce n'est pas un bug du code : ça ne peut être vérifié de bout en bout que via `$URL_PUBLIQUE`, par le développeur dans son navigateur.
  - **Modifications** :
    - `api/src/routes.ts` : ajout de `calculerBadge`, `effectifRequis`, des sessions en dur et de la route `GET /api/v1/sessions` — sert les 3 critères.
    - `api/src/routes.test.ts` : 3 tests sur `calculerBadge` et la route `/api/v1/sessions` — critère 2 (règle d'équipe).
    - `frontend/src/app/page.tsx` : écran « Calendrier des sessions », fetch relatif `/api/v1/sessions`, affichage badge — critère 1.
    - `frontend/nginx.conf` : en-têtes de sécurité repris du gabarit de la plateforme (CSP réduite à `connect-src 'self'`) — contrat de déployabilité / sécurité.
    - `api/Dockerfile`, `frontend/Dockerfile` : images de base qualifiées en `docker.io/library/...` — recette de déploiement du serveur.
    - `.env.example`, `DEPLOIEMENT.md` : posés à la racine — contrat de déployabilité (règles 2 et 8).
    - `podman-compose.yml` : écrit pour le déploiement (réseau `core-network`, ports 8080/8081) — recette de déploiement du serveur.
    - `e2e/demo.spec.ts` : étape « Je vois le calendrier des sessions avec leur badge » ajoutée à la démo.

## ⚠️ Temps restant au moment de replanifier : 15 minutes (2026-11-18)

15 minutes restantes et un tour de test de 10 minutes ne laissent plus de marge pour une fonctionnalité nouvelle : codage + ~5 min de publication + 10 min de test atteignent déjà 15 minutes sans filet. Décision prise avec le développeur : **l'itération 2 n'ajoute rien au périmètre métier**, elle stabilise ce qui est déjà en ligne pour le pitch. « Composition de l'équipe », initialement en tête de « À venir », est donc reportée sans être entamée — ⚠️ à confirmer par les cadreurs si le temps du build venait à être prolongé après cette itération.

## Itération 2 : l'écran montré au pitch est propre, sans régression

- **Dans le périmètre** :
  - le titre et la description de la page (actuellement les valeurs par défaut « Create Next App » du gabarit Next.js, jamais changées depuis l'itération 1) deviennent ceux de l'application (« Calendrier des sessions — La Cloche ») ;
  - relecture rapide du rendu (écran chargement/erreur/liste) et de `./scripts/verifier-deployabilite.sh` pour confirmer l'absence de nouvelle borne avant le dernier signal.
- **Hors périmètre** : toute fonctionnalité de la liste « À venir » (composition d'équipe en premier) — aucune n'est entamée dans cette itération.
- **Critères d'acceptation** (3 au plus) :
  - Étant donné l'application déployée, quand on regarde l'onglet du navigateur, alors le titre affiche le nom de l'application et non « Create Next App ».
  - Étant donné l'API momentanément indisponible, quand l'écran se charge, alors un message d'erreur lisible s'affiche (pas d'écran blanc, pas de crash).
  - Étant donné le build final, quand on relance `./scripts/verifier-deployabilite.sh`, alors aucune borne n'est signalée.
- **Hypothèse de l'équipe couverte** : aucune — itération de stabilisation, pas de nouvelle hypothèse testée.
- **Codage estimé** : 3 minutes.
- **Fichiers prévus** : `frontend/src/app/layout.tsx` (titre/description/langue).
- **Tests unitaires prévus** : aucun — aucune logique métier nouvelle, uniquement du balisage/métadonnées (exclu par la DoD).
- **Étapes ajoutées à la démo** : aucune — le script existant couvre déjà l'écran stabilisé.
- **Bilan** : _à remplir en fin d'itération (durée de codage réelle, dépassement éventuel, fait, reporté, modifications fichier par fichier)._

## À venir (ordre de priorité, à détailler au fil de l'eau)

1. Composition de l'équipe : afficher qui anime déjà ce jour-là et permettre de sélectionner les salarié·es disponibles pour une session ; le badge se met à jour dès que l'équipe est complète.
2. Appel aux bénévoles : si aucun·e bénévole n'est disponible, déclencher l'envoi d'un mail avec un lien de réponse (équivalent Fillout) ; la réponse met à jour le badge.
3. Écran « Qui êtes-vous ? » : choix du persona (responsable d'antenne, coordinatrice, salarié·e, bénévole, commerçant·e) au démarrage, sans connexion ni mot de passe, avec un bouton pour en changer.
4. Tableau de bord responsable d'antenne : vue de toutes les sessions avec leurs badges, sans ouvrir les fiches ; alerte listant les sessions encore incomplètes à J-7.
5. Création de session de bout en bout : choix du module, de la date, du type ; affichage automatique de la règle d'équipe selon la durée.
6. Confirmation commerce : mail de confirmation avec bouton « Je confirme » pour le contact privilégié ; rappel automatique à J-5 pour connaître le nombre de participants.
