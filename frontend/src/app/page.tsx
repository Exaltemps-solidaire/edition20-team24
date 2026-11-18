"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

type Session = {
  id: string;
  module: string;
  date: string;
  type: "demi-journee" | "journee";
  badge: "complete" | "incomplete";
};

type EtatSessions =
  | { statut: "chargement" }
  | { statut: "erreur" }
  | { statut: "pret"; sessions: Session[] };

export default function Home() {
  const [etat, setEtat] = useState<EtatSessions>({ statut: "chargement" });

  const chargerSessions = () => {
    fetch("/api/v1/sessions")
      .then((reponse) => {
        if (!reponse.ok) throw new Error(`statut ${reponse.status}`);
        return reponse.json();
      })
      .then((donnees: { sessions: Session[] }) => {
        setEtat({ statut: "pret", sessions: donnees.sessions });
      })
      .catch(() => {
        setEtat({ statut: "erreur" });
      });
  };

  useEffect(() => {
    chargerSessions();
  }, []);

  const assigner = (sessionId: string, type: "salarie" | "benevole") => {
    fetch(`/api/v1/sessions/${sessionId}/assigner`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    }).then(() => chargerSessions());
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Calendrier des sessions</h1>
        {etat.statut === "chargement" && <p>Chargement des sessions…</p>}
        {etat.statut === "erreur" && (
          <p>Impossible de charger les sessions pour le moment.</p>
        )}
        {etat.statut === "pret" && (
          <ul>
            {etat.sessions.map((session) => (
              <li key={session.id}>
                <strong>{session.module}</strong> — {session.date} (
                {session.type === "journee" ? "journée entière" : "demi-journée"}) —{" "}
                <span data-testid="badge">
                  {session.badge === "complete" ? "équipe complète" : "équipe incomplète"}
                </span>
                {session.badge === "incomplete" && (
                  <>
                    {" "}
                    <button onClick={() => assigner(session.id, "salarie")}>+ salarié·e</button>{" "}
                    <button onClick={() => assigner(session.id, "benevole")}>+ bénévole</button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
