import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Github, Linkedin, FileText, Mail } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const socialLinks = [
  { label: 'GITHUB', href: 'https://github.com/LoopingOutLaw', icon: Github },
  { label: 'LINKEDIN', href: 'https://www.linkedin.com/in/aditya-arora-1528542a1/', icon: Linkedin },
  { label: 'RESUME', href: '/Aditya_Arora_Resume.docx', icon: FileText },
];

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 70%',
        toggleActions: 'play none none reverse',
      },
    });

    tl.fromTo(
      titleRef.current,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
    ).fromTo(
      linksRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
      '-=0.5'
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative w-full flex flex-col justify-between"
      style={{
        minHeight: '80vh',
        backgroundColor: 'var(--void)',
        padding: '160px 5vw 60px',
      }}
    >
      <div>
        <p
          className="text-label font-mono mb-8"
          style={{ color: 'var(--subtle)' }}
        >
          GET IN TOUCH
        </p>

        <div ref={titleRef}>
          <h2
            className="font-display font-medium"
            style={{
              fontSize: 'clamp(48px, 10vw, 140px)',
              lineHeight: 0.95,
              letterSpacing: '-0.02em',
              color: 'var(--surface)',
              textTransform: 'uppercase',
            }}
          >
            OPEN TO
            <br />
            <span style={{ color: 'var(--highlight)' }}>COLLABORATION.</span>
          </h2>
        </div>

        <div className="mt-12" ref={linksRef}>
          <a
            href="mailto:aditya.arora.emails@gmail.com"
            className="inline-flex items-center gap-3 font-display text-xl link-underline group"
            style={{ color: 'var(--surface)' }}
          >
            <Mail
              size={20}
              className="text-highlight"
              strokeWidth={1.5}
            />
            aditya.arora.emails@gmail.com
          </a>
        </div>

        <div className="mt-16 flex flex-wrap gap-8">
          {socialLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-mono text-sm tracking-widest link-underline"
                style={{ color: 'var(--subtle)' }}
              >
                <Icon size={16} strokeWidth={1.5} />
                {link.label}
              </a>
            );
          })}
        </div>
      </div>

      <div
        className="mt-24 pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}
      >
        <p
          className="font-mono text-xs"
          style={{ color: 'var(--subtle)' }}
        >
          &copy; {new Date().getFullYear()} ADITYA ARORA. ALL RIGHTS RESERVED.
        </p>
        <p
          className="font-mono text-xs"
          style={{ color: 'var(--subtle)' }}
        >
          BUILT WITH REACT + GSAP + LENIS + THREE.JS
        </p>
      </div>
    </section>
  );
}
