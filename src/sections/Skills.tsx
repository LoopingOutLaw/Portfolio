import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const skillCategories = [
  {
    label: 'LANGUAGES',
    items: ['PYTHON', 'C++', 'C'],
    direction: 'left' as const,
  },
  {
    label: 'ROBOTICS',
    items: ['ROS 2', 'MOVEIT 2', 'GAZEBO', 'RVIZ', 'PX4', 'ARDUPILOT', 'MAVLINK', 'MAVSDK'],
    direction: 'right' as const,
  },
  {
    label: 'ML / AI',
    items: ['PYTORCH', 'YOLOV8', 'OPENCV', 'TRANSFORMERS', 'FLOW MATCHING', 'VLA', 'SCIKIT-LEARN'],
    direction: 'left' as const,
  },
  {
    label: 'TOOLS',
    items: ['FUSION 360', 'SOLIDWORKS', 'EASYEDA', 'KICAD', 'GIT', 'FASTAPI', 'FLASK', 'REACT'],
    direction: 'right' as const,
  },
  {
    label: 'HARDWARE',
    items: ['RASPBERRY PI', 'JETSON NANO', 'ESP32', 'ESP8266', 'ARDUINO', 'PCB FABRICATION'],
    direction: 'left' as const,
  },
];

export default function Skills() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    });

    tl.fromTo(
      titleRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative w-full"
      style={{
        backgroundColor: 'var(--surface)',
        padding: '160px 0',
      }}
    >
      <div style={{ padding: '0 5vw', marginBottom: '80px' }}>
        <p className="text-label font-mono mb-4" style={{ color: 'var(--subtle)' }}>
          TECHNICAL SKILLS
        </p>
        <h2
          ref={titleRef}
          className="text-section font-mono"
          style={{ color: 'var(--void)' }}
        >
          TOOLKIT
        </h2>
      </div>

      <div className="flex flex-col gap-0">
        {skillCategories.map((category, catIdx) => (
          <div
            key={category.label}
            className="relative overflow-hidden"
            style={{
              borderTop: '1px solid var(--void)',
              borderBottom: catIdx === skillCategories.length - 1 ? '1px solid var(--void)' : 'none',
              padding: '24px 0',
            }}
          >
            <div
              className="absolute top-2 left-5vw font-mono text-label"
              style={{ color: 'var(--subtle)', zIndex: 10, padding: '0 5vw' }}
            >
              {category.label}
            </div>

            <div
              className={
                category.direction === 'left'
                  ? 'marquee-track'
                  : 'marquee-track-reverse'
              }
              style={{ marginTop: '20px' }}
            >
              {/* Repeat items for seamless loop */}
              {[...category.items, ...category.items, ...category.items, ...category.items].map(
                (skill, idx) => (
                  <span
                    key={`${skill}-${idx}`}
                    className="font-mono font-bold whitespace-nowrap"
                    style={{
                      fontSize: 'clamp(36px, 5vw, 72px)',
                      color: 'var(--void)',
                      paddingRight: '60px',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {skill}
                  </span>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
