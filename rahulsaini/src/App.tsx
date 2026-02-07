import Stars from './components/Stars';
import NebulaGlow from './components/NebulaGlow';
import Hero from './components/Hero';
import About from './components/About';
import TechGalaxy from './components/TechGalaxy';
import Projects from './components/Projects';
import Footer from './components/Footer';

function App() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh', width: '100%' }}>
      {/* Background Effects */}
      <Stars />
      <NebulaGlow />

      {/* Main Content */}
      <main style={{ position: 'relative' }}>
        <Hero />
        <About />
        <TechGalaxy />
        <Projects />
      </main>

      <Footer />
    </div>
  );
}

export default App;
