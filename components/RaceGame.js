"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Car from "./Car";

const TRACK_PADDING = 16;
const CAR_WIDTH = 120;

const COLORS = ["#ff5c5c", "#4cc9f0", "#ffd166", "#7bd389", "#8f7aea", "#ff8fab", "#ff9f1c"]; 

export default function RaceGame() {
  const trackRef = useRef(null);
  const [running, setRunning] = useState(false);
  const [winner, setWinner] = useState(null); // 1 or 2
  const [pos, setPos] = useState({ c1: 0, c2: 0 });
  const [speed, setSpeed] = useState({ c1: 0, c2: 0 });
  const [baseSpeed, setBaseSpeed] = useState(150); // px/sec
  const [colors, setColors] = useState({ c1: COLORS[0], c2: COLORS[1] });
  const [countdown, setCountdown] = useState(null);
  const animRef = useRef(null);
  const lastTsRef = useRef(0);

  const finishX = useMemo(() => {
    const el = trackRef.current;
    if (!el) return 600;
    const width = el.clientWidth;
    return Math.max(200, width - TRACK_PADDING * 2 - CAR_WIDTH - 20);
  }, [trackRef.current]);

  const reset = useCallback(() => {
    setRunning(false);
    setWinner(null);
    setPos({ c1: 0, c2: 0 });
    setSpeed({ c1: 0, c2: 0 });
    setCountdown(null);
    cancelAnimationFrame(animRef.current);
  }, []);

  const start = useCallback(() => {
    setWinner(null);
    setPos({ c1: 0, c2: 0 });
    setSpeed({ c1: baseSpeed, c2: baseSpeed });
    setCountdown(3);
  }, [baseSpeed]);

  // countdown sequence then run
  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      setRunning(true);
      setCountdown(null);
      lastTsRef.current = 0;
      animRef.current = requestAnimationFrame(loop);
      return;
    }
    const t = setTimeout(() => setCountdown((c) => (c ?? 1) - 1), 600);
    return () => clearTimeout(t);
  }, [countdown]);

  const loop = (ts) => {
    if (!running) return;
    if (!lastTsRef.current) lastTsRef.current = ts;
    const dt = (ts - lastTsRef.current) / 1000;
    lastTsRef.current = ts;
    setPos((p) => {
      const drift1 = (Math.random() - 0.5) * 20; // playful jitter
      const drift2 = (Math.random() - 0.5) * 20;
      const nx1 = Math.min(p.c1 + (speed.c1 + drift1) * dt, finishX);
      const nx2 = Math.min(p.c2 + (speed.c2 + drift2) * dt, finishX);
      if (nx1 >= finishX || nx2 >= finishX) {
        const w = nx1 > nx2 ? 1 : nx2 > nx1 ? 2 : Math.random() < 0.5 ? 1 : 2;
        handleWin(w);
        return { c1: nx1, c2: nx2 };
      }
      return { c1: nx1, c2: nx2 };
    });
    animRef.current = requestAnimationFrame(loop);
  };

  const handleWin = (w) => {
    setRunning(false);
    setWinner(w);
    createConfetti();
    try {
      window.dispatchEvent(new CustomEvent("race-won", { detail: { winner: w } }));
    } catch {}
  };

  const boost = (id) => {
    if (!running) return;
    const key = id === 1 ? "c1" : "c2";
    setSpeed((s) => {
      const boosted = { ...s, [key]: s[key] + 220 };
      setTimeout(() => {
        setSpeed((curr) => ({ ...curr, [key]: Math.max(baseSpeed, curr[key] - 220) }));
      }, 900);
      return boosted;
    });
  };

  const createConfetti = () => {
    const wrapper = trackRef.current?.querySelector(".confetti");
    if (!wrapper) return;
    wrapper.innerHTML = "";
    const pieces = 60;
    for (let i = 0; i < pieces; i++) {
      const el = document.createElement("div");
      el.className = "confetti-piece";
      el.style.left = Math.random() * 90 + 5 + "%";
      el.style.top = Math.random() * 10 + "%";
      el.style.background = COLORS[i % COLORS.length];
      el.style.animationDelay = (Math.random() * 0.6).toFixed(2) + "s";
      wrapper.appendChild(el);
    }
    setTimeout(() => (wrapper.innerHTML = ""), 2200);
  };

  const colorPicker = (who) => (
    <div className="color-picker" aria-label={`Choose color for car ${who === 1 ? "1" : "2"}`}>
      {COLORS.map((c) => (
        <button
          key={c}
          className="swatch"
          onClick={() => setColors((col) => (who === 1 ? { ...col, c1: c } : { ...col, c2: c }))}
          style={{ background: c, outline: (who === 1 ? colors.c1 : colors.c2) === c ? "3px solid #222" : "none" }}
          aria-label={`Set car ${who} color`}
        />
      ))}
    </div>
  );

  return (
    <div>
      <div className="hud">
        <div className="pill">{winner ? `Winner: Car ${winner}!` : running ? "Race on!" : "Ready?"}</div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn" onClick={running || countdown !== null ? undefined : start} disabled={running || countdown !== null}>
            {countdown !== null ? `Starting in ${countdown}?` : "Start Race"}
          </button>
          <button className="btn secondary" onClick={() => boost(1)} disabled={!running}>Boost Car 1</button>
          <button className="btn secondary" onClick={() => boost(2)} disabled={!running}>Boost Car 2</button>
          <button className="btn warning" onClick={reset}>Reset</button>
        </div>
      </div>

      <div className="track" ref={trackRef}>
        <div className="lanes">
          <div className="finish" aria-hidden />
          <div className="confetti" aria-hidden />
          <div
            className="car lane-1"
            style={{ transform: `translate(${pos.c1}px, -50%)` }}
            aria-label="Car 1"
          >
            <Car color={colors.c1} number={1} />
          </div>
          <div
            className="car lane-2"
            style={{ transform: `translate(${pos.c2}px, -50%)` }}
            aria-label="Car 2"
          >
            <Car color={colors.c2} number={2} />
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <div className="pill" style={{ marginBottom: 8 }}>Car 1 Color</div>
          {colorPicker(1)}
        </div>
        <div>
          <div className="pill" style={{ marginBottom: 8 }}>Car 2 Color</div>
          {colorPicker(2)}
        </div>
      </div>
    </div>
  );
}

