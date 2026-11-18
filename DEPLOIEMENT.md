# Déploiement

Planning des formations pour **La Cloche** : donne aux coordinatrices de terrain et à la
responsable d'antenne une vue commune des sessions prévues et de leurs équipes d'animation
(complètes ou incomplètes).

## Services

- `frontend/` : export statique de Next.js servi par nginx (port 80 du conteneur, publié sur
  **8080**). C'est le seul service exposé au public ; sert aussi `/health` et `/sante`.
- `api/` : serveur Node sans dépendance (port 8081 du conteneur, publié sur **8081**). Le proxy
  d'entrée lui envoie `/api/*` sans retirer le préfixe ; routes métier sous `/api/v1/...`.

## Services externes

Aucun pour l'instant : les sessions de l'écran « Calendrier des sessions » sont des données en
dur dans `api/src/routes.ts`. Rien ne casse si un service externe tombe, puisqu'aucun n'est
encore appelé.

## Connu comme fragile ou inachevé

- Données en dur, pas encore de base de données : un redémarrage ne perd rien, mais rien n'est
  non plus modifiable (pas de création de session).
- Pas de persona ni de rôle : tout le monde voit le même écran, en lecture seule.
- Composition d'équipe, appel aux bénévoles, tableau de bord responsable et rappels commerce ne
  sont pas encore construits (voir `ITERATIONS.md`, section « À venir »).

## Contact

- Équipe : Équipe 24 (eXaltemps Solidaire).
- Association : La Cloche.
