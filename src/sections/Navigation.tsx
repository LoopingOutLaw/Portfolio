import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'ABOUT', href: '#about' },
  { label: 'PROJECTS', href: '#projects' },
  { label: 'SKILLS', href: '#skills' },
  { label: 'CONTACT', href: '#contact' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      const sections = ['hero', 'about', 'projects', 'skills', 'achievements', 'contact'];
      const current = sections.reduce((active, id) => {
        const section = document.getElementById(id);
        if (!section) return active;
        const rect = section.getBoundingClientRect();
        return rect.top <= window.innerHeight * 0.38 ? id : active;
      }, 'hero');

      setScrolled(window.scrollY > 50);
      setScrollProgress(progress);
      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav
        className="fixed top-0 left-0 w-full z-50 transition-all duration-500"
        style={{ padding: scrolled ? '14px 5vw' : '24px 5vw' }}
      >
        <div className="mission-panel flex items-center justify-between gap-5 px-4 py-3 md:px-5">
          <a
            href="#hero"
            className="font-display text-sm md:text-base font-medium tracking-tight"
            style={{ color: 'var(--surface)' }}
            onClick={() => setMenuOpen(false)}
          >
            ADITYA ARORA
          </a>

          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => {
              const sectionId = link.href.replace('#', '');
              return (
                <a
                  key={link.label}
                  href={link.href}
                  data-active={activeSection === sectionId}
                  className="mission-link font-mono text-xs tracking-widest"
                  style={{
                    color:
                      activeSection === sectionId
                        ? 'var(--wireframe)'
                        : 'rgba(255, 255, 255, 0.72)',
                  }}
                >
                  {link.label}
                </a>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <span
              className="font-mono text-[10px] tracking-widest"
              style={{ color: 'rgba(255, 255, 255, 0.55)' }}
            >
              MISSION {Math.round(scrollProgress * 100).toString().padStart(2, '0')}%
            </span>
            <a
              href="/Aditya_Arora_Resume.docx"
              className="font-mono text-xs tracking-widest px-3 py-2"
              style={{
                color: 'var(--surface)',
                border: '1px solid rgba(255, 255, 255, 0.22)',
              }}
            >
              RESUME
            </a>
          </div>

          <button
            type="button"
            className="md:hidden inline-flex h-9 w-9 items-center justify-center"
            style={{ color: 'var(--surface)' }}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <div
          className="mt-2 h-px origin-left transition-transform duration-200"
          style={{
            transform: `scaleX(${scrollProgress})`,
            background: 'linear-gradient(90deg, var(--highlight), var(--wireframe))',
          }}
        />

        {menuOpen && (
          <div className="mission-panel mt-3 p-4 md:hidden">
            <div className="grid gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="font-mono text-sm tracking-widest"
                  style={{ color: 'var(--surface)' }}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/Aditya_Arora_Resume.docx"
                className="font-mono text-sm tracking-widest"
                style={{ color: 'var(--wireframe)' }}
                onClick={() => setMenuOpen(false)}
              >
                RESUME
              </a>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
