import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const typingText =
  'I build robots that combine hardware, control, perception, and AI: from ROS 2 arms and drone swarms to VLA policy research and embedded assistive devices.';

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const typingRef = useRef<HTMLSpanElement>(null);
  const [typedText, setTypedText] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end: 'top 20%',
        toggleActions: 'play none none reverse',
      },
    });

    tl.fromTo(
      titleRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
    );

    tl.call(
      () => {
        setStarted(true);
      },
      undefined,
      '+=0.2'
    );

    return () => {
      tl.kill();
    };
  }, []);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      if (i <= typingText.length) {
        setTypedText(typingText.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [started]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full flex items-center justify-center"
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--void)',
        padding: '0 5vw',
      }}
    >
      <div className="text-center" style={{ maxWidth: '920px' }}>
        <p className="text-label font-mono mb-6" style={{ color: 'var(--subtle)' }}>
          ABOUT ME
        </p>
        <h2
          ref={titleRef}
          className="text-section font-mono mb-8"
          style={{ color: 'var(--surface)' }}
        >
          INITIATING
          <br />
          SEQUENCE...
        </h2>
        <div className="flex justify-center">
          <p
            className="font-display text-lg leading-relaxed"
            style={{ color: 'var(--subtle)', maxWidth: '600px' }}
          >
            <span ref={typingRef}>{typedText}</span>
            <span
              className="inline-block ml-1"
              style={{
                width: '2px',
                height: '1.2em',
                backgroundColor: 'var(--highlight)',
                animation: 'blink 1s step-end infinite',
                verticalAlign: 'text-bottom',
              }}
            />
          </p>
        </div>

        <div
          className="mt-12 flex flex-wrap justify-center gap-6 font-mono text-xs uppercase tracking-widest"
          style={{ color: 'var(--subtle)' }}
        >
          <span>ROS 2</span>
          <span style={{ color: 'var(--highlight)' }}>|</span>
          <span>MOVEIT 2</span>
          <span style={{ color: 'var(--highlight)' }}>|</span>
          <span>FLOW MATCHING</span>
          <span style={{ color: 'var(--highlight)' }}>|</span>
          <span>AUTONOMOUS SYSTEMS</span>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-px sm:grid-cols-3">
          {[
            ['04', 'FLAGSHIP ROBOTICS BUILDS'],
            ['22M', 'PARAMETER VLA MODEL'],
            ['100/100', 'E-YANTRA NATIONAL SCORE'],
          ].map(([value, label]) => (
            <div
              key={label}
              className="px-6 py-5"
              style={{
                border: '1px solid rgba(255, 255, 255, 0.12)',
                backgroundColor: 'rgba(255, 255, 255, 0.035)',
              }}
            >
              <div
                className="font-mono text-3xl font-bold"
                style={{ color: 'var(--surface)' }}
              >
                {value}
              </div>
              <div
                className="mt-2 font-mono text-[10px] uppercase tracking-widest"
                style={{ color: 'var(--subtle)' }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
