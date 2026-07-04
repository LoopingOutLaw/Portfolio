import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import StatusPanel from '../components/StatusPanel';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const line3Ref = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);
  const dashRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const baymaxRef = useRef<HTMLImageElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const headline = [line1Ref.current, line2Ref.current, line3Ref.current];
      const tl = gsap.timeline({ delay: 0.2 });

      tl.fromTo(section, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power2.out' })
        .fromTo(
          markerRef.current,
          { x: -10, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
          0.2
        );

      headline.forEach((line, index) => {
        tl.fromTo(
          line,
          { y: 64, opacity: 0, clipPath: 'inset(100% 0 0 0)' },
          {
            y: 0,
            opacity: 1,
            clipPath: 'inset(0% 0 0 0)',
            duration: 0.85,
            ease: 'power3.out',
          },
          0.55 + index * 0.13
        );
      });

      tl.fromTo(
        dashRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.45, ease: 'power2.out' },
        1.15
      )
      .fromTo(
        copyRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
        1.25
      )
      .fromTo(
        ctaRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
        1.35
      );

      tl.fromTo(
        baymaxRef.current,
        { y: 24, scale: 0.92, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 0.9, ease: 'power3.out' },
        0.65
      )
        .fromTo(
          statusRef.current,
          { x: 32, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.7, ease: 'power2.out' },
          0.95
        )
        .fromTo(scrollRef.current, { opacity: 0 }, { opacity: 1, duration: 0.45 }, 1.75);

      if (!reduceMotion) {
        gsap.to(baymaxRef.current, {
          y: '-18vh',
          scale: 0.82,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.8,
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="hero-section relative flex w-full items-center overflow-hidden bg-surface opacity-0"
    >
      <div className="hero-grid relative z-10 mx-auto grid w-full items-center">
        <div className="hero-copy">
          <div ref={markerRef} className="hero-marker opacity-0">
            <span />
            <p>01</p>
          </div>

          <h1 className="hero-heading" aria-label="Robotics with care">
            <span ref={line1Ref}>ROBOTICS</span>
            <span ref={line2Ref}>WITH</span>
            <span ref={line3Ref} className="hero-heading__accent">
              CARE
            </span>
          </h1>

          <div ref={dashRef} className="hero-dash origin-left" />

          <div ref={copyRef} className="hero-intro opacity-0">
            <p>
              Designing intelligent systems that improve lives, from ROS 2 arms to
              assistive embedded robotics.
            </p>
          </div>

          <div ref={ctaRef} className="mt-7 flex flex-wrap items-center gap-3 opacity-0">
            <a href="#projects" className="hero-action inline-flex items-center px-5 py-3">
              <span>VIEW PROJECTS</span>
            </a>
            <a
              href="mailto:aditya.arora.emails@gmail.com"
              className="hero-secondary-action inline-flex items-center px-5 py-3"
            >
              START A BUILD
            </a>
          </div>
        </div>

        <div className="hero-baymax-wrap" aria-hidden="true">
          <div className="hero-baymax-shadow" />
          <img
            ref={baymaxRef}
            src="/assets/baymax-hero.png"
            alt=""
            className="hero-baymax baymax-float"
          />
        </div>

        <div ref={statusRef} className="hero-status opacity-0">
          <StatusPanel />
        </div>
      </div>

      <div ref={scrollRef} className="hero-scroll opacity-0" aria-hidden="true">
        <div className="hero-scroll__circle">
          <span />
        </div>
        <p>SCROLL TO EXPLORE</p>
      </div>
    </section>
  );
}
