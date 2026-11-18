import { describe, expect, it } from "vitest";
import { calculerBadge, router, type Session } from "./routes.ts";

describe("router", () => {
  it("répond 200 sur les deux routes de santé", () => {
    expect(router("GET", "/health").statut).toBe(200);
    expect(router("GET", "/sante?x=1").statut).toBe(200);
  });

  it("répond 404 sur une route inconnue ou une méthode non prévue", () => {
    expect(router("GET", "/api/v1/inconnue").statut).toBe(404);
    expect(router("POST", "/health").statut).toBe(404);
  });

  it("renvoie la liste des sessions avec leur badge", () => {
    const reponse = router("GET", "/api/v1/sessions");
    expect(reponse.statut).toBe(200);
    const { sessions } = reponse.corps as { sessions: Array<{ badge: string }> };
    expect(sessions.length).toBeGreaterThan(0);
    expect(sessions.every((s) => s.badge === "complete" || s.badge === "incomplete")).toBe(true);
  });
});

describe("calculerBadge", () => {
  const base: Session = {
    id: "x",
    module: "Module test",
    date: "2026-12-01",
    type: "journee",
    salariesAssignes: 0,
    benevolesAssignes: 0,
  };

  it("une journée entière exige 2 salarié·es + 1 bénévole", () => {
    expect(calculerBadge({ ...base, salariesAssignes: 1, benevolesAssignes: 1 })).toBe("incomplete");
    expect(calculerBadge({ ...base, salariesAssignes: 2, benevolesAssignes: 1 })).toBe("complete");
  });

  it("une demi-journée exige 1 salarié·e + 1 bénévole", () => {
    const demiJournee: Session = { ...base, type: "demi-journee" };
    expect(calculerBadge({ ...demiJournee, salariesAssignes: 1, benevolesAssignes: 0 })).toBe(
      "incomplete",
    );
    expect(calculerBadge({ ...demiJournee, salariesAssignes: 1, benevolesAssignes: 1 })).toBe(
      "complete",
    );
  });
});
