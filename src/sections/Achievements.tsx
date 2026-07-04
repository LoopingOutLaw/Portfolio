import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, Trophy, Medal } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const achievements = [
  {
    icon: Trophy,
    title: '100/100 e-Yantra National Champions',
    description:
      'IIT Bombay e-Yantra "Holo Battalion" national swarm robotics challenge. Designed PCBs and Fusion 360 chassis for a 3-robot swarm, deployed in simulation and physical hardware.',
    year: '2024',
  },
  {
    icon: Award,
    title: 'Semi-Finalist Vishwakarma Awards',
    description:
      'Addverb Industry Track — AI-driven 6-DOF VLA robotic arm integrating LLM-based natural language command parsing with MoveIt 2.',
    year: '2025',
  },
  {
    icon: Medal,
    title: 'Stage 1 Qualifier DD Robocon',
    description:
      'Qualified for DD Robocon in freshman year, demonstrating strong foundational skills in robotics and competitive engineering.',
    year: '2024',
  },
  {
    icon: Award,
    title: 'Patent Filed — Braille Glove',
    description:
      'Wearable haptic communication interface (EDP-26). Custom two-board PCB enabling bidirectional Telegram messaging via six solenoid-driven Grade-1 Braille fingers.',
    year: '2025',
  },
];

export default function Achievements() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const triggers: ScrollTrigger[] = [];

    cardsRef.current.forEach((card, idx) => {
      if (!card) return;
      const anim = gsap.fromTo(
        card,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
          delay: idx * 0.1,
        }
      );
      if (anim.scrollTrigger) triggers.push(anim.scrollTrigger);
    });

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="achievements"
      className="relative w-full"
      style={{
        backgroundColor: 'var(--surface)',
        padding: '160px 5vw',
      }}
    >
      <div style={{ marginBottom: '80px' }}>
        <p className="text-label font-mono mb-4" style={{ color: 'var(--subtle)' }}>
          RECOGNITION
        </p>
        <h2
          className="text-section font-mono"
          style={{ color: 'var(--void)' }}
        >
          ACHIEVEMENTS
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px">
        {achievements.map((achievement, idx) => {
          const Icon = achievement.icon;
          return (
            <div
              key={idx}
              ref={(el) => { cardsRef.current[idx] = el; }}
              className="group relative cursor-pointer overflow-hidden transition-transform duration-300 hover:-translate-y-1"
              style={{
                padding: '48px',
                border: '1px solid rgba(5, 5, 5, 0.1)',
              }}
            >
              <div
                className="absolute inset-0 transition-colors duration-300"
                style={{ backgroundColor: 'transparent' }}
              />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ backgroundColor: 'var(--highlight)' }}
              />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <Icon
                    size={28}
                    strokeWidth={1.5}
                    className="text-void group-hover:text-surface transition-colors duration-300"
                  />
                  <span
                    className="font-mono text-label text-subtle transition-colors duration-300 group-hover:text-surface"
                  >
                    {achievement.year}
                  </span>
                </div>

                <h3
                  className="font-display text-xl font-medium mb-3 text-void transition-colors duration-300 group-hover:text-surface"
                >
                  {achievement.title}
                </h3>

                <p
                  className="font-display text-sm leading-relaxed text-subtle transition-colors duration-300 group-hover:text-surface"
                >
                  {achievement.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
