// Routage de l'API, sans dépendance : une fonction pure, testable sans démarrer de serveur.
// Le proxy d'entrée envoie /api/... à ce service sans retirer le préfixe : les routes métier
// se déclarent donc sous /api/v1/... ; /health et /sante restent à la racine (port 8081).

export type Reponse = { statut: number; corps?: unknown };

export type TypeSession = "demi-journee" | "journee";

export type Session = {
  id: string;
  module: string;
  date: string;
  type: TypeSession;
  salariesAssignes: number;
  benevolesAssignes: number;
};

// Règle de l'association (passation/cadrage/7-prd.md) : moins d'une demi-journée →
// 1 salarié·e + 1 bénévole ; journée entière → 2 salarié·es + 1 bénévole.
export function effectifRequis(type: TypeSession): { salaries: number; benevoles: number } {
  return type === "journee" ? { salaries: 2, benevoles: 1 } : { salaries: 1, benevoles: 1 };
}

export function calculerBadge(session: Session): "complete" | "incomplete" {
  const requis = effectifRequis(session.type);
  const complete =
    session.salariesAssignes >= requis.salaries && session.benevolesAssignes >= requis.benevoles;
  return complete ? "complete" : "incomplete";
}

// Données en dur pour l'itération 1 : fictives, aucun nom ni contact réel.
const sessionsEnDur: Session[] = [
  {
    id: "s1",
    module: "Fresque de la précarité",
    date: "2026-11-24",
    type: "journee",
    salariesAssignes: 1,
    benevolesAssignes: 0,
  },
  {
    id: "s2",
    module: "Form'Action commerces — Le Carillon",
    date: "2026-11-25",
    type: "demi-journee",
    salariesAssignes: 1,
    benevolesAssignes: 1,
  },
  {
    id: "s3",
    module: "Sensibilisation grand public",
    date: "2026-11-26",
    type: "journee",
    salariesAssignes: 2,
    benevolesAssignes: 1,
  },
];

export function router(methode: string, url: string): Reponse {
  const chemin = new URL(url, "http://api").pathname;
  if (methode === "GET" && (chemin === "/health" || chemin === "/sante")) {
    return { statut: 200, corps: { status: "ok" } };
  }
  if (methode === "GET" && chemin === "/api/v1/sessions") {
    const sessions = sessionsEnDur.map((session) => ({ ...session, badge: calculerBadge(session) }));
    return { statut: 200, corps: { sessions } };
  }
  return { statut: 404 };
}
