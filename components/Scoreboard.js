"use client";
import { useEffect, useState } from "react";

const STORAGE_KEY = "cars-races-score";

const readScore = () => {
  if (typeof window === "undefined") return { c1: 0, c2: 0, races: 0 };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { c1: 0, c2: 0, races: 0 };
    const parsed = JSON.parse(raw);
    return { c1: parsed.c1 ?? 0, c2: parsed.c2 ?? 0, races: parsed.races ?? 0 };
  } catch {
    return { c1: 0, c2: 0, races: 0 };
  }
};

const writeScore = (score) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(score));
  } catch {}
};

export default function Scoreboard() {
  const [score, setScore] = useState(readScore);

  useEffect(() => {
    const onWin = (e) => {
      const w = e?.detail?.winner;
      if (!w) return;
      setScore((s) => {
        const next = {
          c1: s.c1 + (w === 1 ? 1 : 0),
          c2: s.c2 + (w === 2 ? 1 : 0),
          races: s.races + 1,
        };
        writeScore(next);
        return next;
      });
    };
    window.addEventListener("race-won", onWin);
    return () => window.removeEventListener("race-won", onWin);
  }, []);

  const reset = () => {
    const zero = { c1: 0, c2: 0, races: 0 };
    setScore(zero);
    writeScore(zero);
  };

  return (
    <div>
      <h2 className="title" style={{ fontSize: 28, marginBottom: 8 }}>Scoreboard</h2>
      <p className="subtitle">Who wins the most races?</p>
      <div className="scoreboard">
        <div className="score">?? Car 1 Wins: {score.c1}</div>
        <div className="score">?? Car 2 Wins: {score.c2}</div>
      </div>
      <div className="pill" style={{ marginTop: 12, display: "inline-block" }}>
        Total Races: {score.races}
      </div>
      <div style={{ marginTop: 12 }}>
        <button className="btn ghost" onClick={reset}>Reset Scores</button>
      </div>
      <hr style={{ margin: "16px 0", border: 0, borderTop: "1px solid #e6eefb" }} />
      <div>
        <h3 className="subtitle" style={{ marginBottom: 8 }}>Tips</h3>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          <li>Tap Boost to zoom ahead!</li>
          <li>Choose your favorite car color.</li>
          <li>First to the checkered line wins!</li>
        </ul>
      </div>
    </div>
  );
}

