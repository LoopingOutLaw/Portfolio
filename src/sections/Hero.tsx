import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import BaymaxHeroAnimation from '../components/BaymaxHeroAnimation';

export default function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 });

    tl.fromTo(
      lineRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 1.2, ease: 'power3.inOut' }
    )
      .fromTo(
        titleRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out' },
        '-=0.6'
      )
      .fromTo(
        labelRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
        '-=0.5'
      );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative w-full bg-surface overflow-hidden"
      style={{ height: '100vh' }}
    >
      <BaymaxHeroAnimation />

      <div
        className="absolute bottom-0 left-0 w-full z-10"
        style={{ padding: '0 5vw 8vh' }}
      >
        <div
          ref={lineRef}
          className="w-full origin-left"
          style={{
            height: '1px',
            backgroundColor: 'var(--void)',
            marginBottom: '32px',
          }}
        />

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div>
            <h1
              ref={titleRef}
              className="text-hero font-display text-void"
              style={{ maxWidth: '900px' }}
            >
              ROBOTICS
              <br />
              WITH CARE
            </h1>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href="#projects"
                className="hero-action z-0 inline-flex items-center px-5 py-3 font-mono text-xs tracking-widest"
                style={{ color: 'var(--void)' }}
              >
                <span>VIEW PROJECTS</span>
              </a>
              <a
                href="mailto:aditya.arora.emails@gmail.com"
                className="inline-flex items-center px-5 py-3 font-mono text-xs tracking-widest transition-colors hover:text-highlight"
                style={{ color: 'var(--void)' }}
              >
                START A BUILD
              </a>
            </div>
          </div>

          <div ref={labelRef} className="flex-shrink-0">
            <p
              className="text-label font-mono"
              style={{ color: 'var(--void)', opacity: 0.6, maxWidth: '300px' }}
            >
              ADITYA ARORA / IIITDM JABALPUR / ROBOTICS / AI / EMBEDDED
              SYSTEMS
            </p>
          </div>
        </div>
      </div>

      <div
        className="absolute right-[5vw] top-1/2 z-10 hidden -translate-y-1/2 md:flex flex-col items-center gap-3"
        aria-hidden="true"
      >
        <span
          className="font-mono text-[10px] tracking-[0.32em] [writing-mode:vertical-rl]"
          style={{ color: 'rgba(5, 5, 5, 0.42)' }}
        >
          SCROLL
        </span>
        <span
          className="block h-16 w-px"
          style={{ backgroundColor: 'rgba(5, 5, 5, 0.2)' }}
        >
          <span
            className="block h-5 w-px"
            style={{
              backgroundColor: 'var(--highlight)',
              animation: 'scroll-cue 1.5s ease-in-out infinite',
            }}
          />
        </span>
      </div>
    </section>
  );
}
