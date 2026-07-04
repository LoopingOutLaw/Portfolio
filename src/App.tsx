import useLenis from './hooks/useLenis';
import Navigation from './sections/Navigation';
import Hero from './sections/Hero';
import About from './sections/About';
import Projects from './sections/Projects';
import Skills from './sections/Skills';
import Achievements from './sections/Achievements';
import Contact from './sections/Contact';

export default function App() {
  useLenis();

  return (
    <div className="relative">
      <Navigation />
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Achievements />
      <Contact />
    </div>
  );
}
