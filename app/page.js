import RaceGame from '../components/RaceGame';
import Scoreboard from '../components/Scoreboard';

export default function Home() {
  return (
    <main className="container">
      <div className="grid">
        <section className="card">
          <h1 className="title">Cars Races</h1>
          <p className="subtitle">A cheerful racing game for kids. Tap boost and zoom!</p>
          <RaceGame />
          <div className="footer">Made with ?? for little racers</div>
        </section>
        <aside className="card">
          <Scoreboard />
        </aside>
      </div>
    </main>
  );
}

