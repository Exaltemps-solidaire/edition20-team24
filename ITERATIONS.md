# Plan d'itérations — La Cloche, planning formations

**Plan validé le 2026-11-18.**

- **Source du plan** : proposé par l'agent (aucun plan d'itérations trouvé dans la passation : ni fichier `cadrage/*iteration*`, ni clé `iterations` dans `passation.json`).
- **Temps restant annoncé** : 30 minutes, à 2026-11-18 (heure de la question).
- **Durée du tour de test de l'équipe dans PM Lab** : 10 minutes.
- **Temps restant au début de l'itération 1** : ~25-30 minutes, à 2026-11-18.
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
- **Bilan** : _à remplir en fin d'itération (durée de codage réelle, dépassement éventuel, fait, reporté, modifications fichier par fichier)._

## À venir (ordre de priorité, à détailler au fil de l'eau)

1. Composition de l'équipe : afficher qui anime déjà ce jour-là et permettre de sélectionner les salarié·es disponibles pour une session ; le badge se met à jour dès que l'équipe est complète.
2. Appel aux bénévoles : si aucun·e bénévole n'est disponible, déclencher l'envoi d'un mail avec un lien de réponse (équivalent Fillout) ; la réponse met à jour le badge.
3. Écran « Qui êtes-vous ? » : choix du persona (responsable d'antenne, coordinatrice, salarié·e, bénévole, commerçant·e) au démarrage, sans connexion ni mot de passe, avec un bouton pour en changer.
4. Tableau de bord responsable d'antenne : vue de toutes les sessions avec leurs badges, sans ouvrir les fiches ; alerte listant les sessions encore incomplètes à J-7.
5. Création de session de bout en bout : choix du module, de la date, du type ; affichage automatique de la règle d'équipe selon la durée.
6. Confirmation commerce : mail de confirmation avec bouton « Je confirme » pour le contact privilégié ; rappel automatique à J-5 pour connaître le nombre de participants.
