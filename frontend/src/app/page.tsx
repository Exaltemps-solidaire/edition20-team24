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

  useEffect(() => {
    let annule = false;
    fetch("/api/v1/sessions")
      .then((reponse) => {
        if (!reponse.ok) throw new Error(`statut ${reponse.status}`);
        return reponse.json();
      })
      .then((donnees: { sessions: Session[] }) => {
        if (!annule) setEtat({ statut: "pret", sessions: donnees.sessions });
      })
      .catch(() => {
        if (!annule) setEtat({ statut: "erreur" });
      });
    return () => {
      annule = true;
    };
  }, []);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.titre}>Calendrier des sessions</h1>
        {etat.statut === "chargement" && <p>Chargement des sessions…</p>}
        {etat.statut === "erreur" && (
          <p>Impossible de charger les sessions pour le moment.</p>
        )}
        {etat.statut === "pret" && (
          <ul className={styles.liste}>
            {etat.sessions.map((session) => (
              <li key={session.id} className={styles.session}>
                <strong>{session.module}</strong> — {session.date} (
                {session.type === "journee" ? "journée entière" : "demi-journée"})
                <span
                  data-testid="badge"
                  className={`${styles.badge} ${
                    session.badge === "complete" ? styles.badgeComplete : styles.badgeIncomplete
                  }`}
                >
                  {session.badge === "complete" ? "équipe complète" : "équipe incomplète"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
