import IntroSection from './components/IntroSection';
import ProfileSection from './components/ProfileSection';
import SnakeGame from './components/SnakeGame';

function App() {
  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">個人網站作品</p>
          <h1>吳丞恩的 React + TypeScript 網站</h1>
          <p className="hero-copy">
            這個網站包含網站介紹、個人簡介，以及一個可互動的貪吃蛇小遊戲。
          </p>
        </div>
      </header>

      <main>
        <section id="about" className="section-card">
          <IntroSection />
        </section>

        <section id="profile" className="section-card">
          <ProfileSection />
        </section>

        <section id="snake" className="section-card">
          <SnakeGame />
        </section>
      </main>

      <footer className="footer">
        <p>建立於 React + TypeScript，使用 Vite 開發。</p>
      </footer>
    </div>
  );
}

export default App;
