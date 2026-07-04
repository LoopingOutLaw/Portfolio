import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Wormhole from '../components/Wormhole';
import { Github, ExternalLink } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: 'agribot',
    title: 'AgriBot',
    subtitle: 'Autonomous Agricultural Drones',
    description:
      'A heterogeneous Scout + Treatment drone system for automated crop management across 225-crop simulated fields. Combines HSV detection, multi-frame voting, and LogisticRegression disease classification with camera ray-projection geotagging.',
    tech: ['ROS 2', 'ArduPilot', 'MAVSDK', 'YOLOv8', 'Gazebo', 'OpenCV'],
    github: 'https://github.com/LoopingOutLaw/AgriBot',
    position: 0.15,
  },
  {
    id: 'dexter',
    title: 'Dexter',
    subtitle: '3-DOF Multi-Modal Robotic Arm',
    description:
      'A full-stack ROS 2 arm with URDF/Xacro, Gazebo simulation, and a custom C++ ros2_control hardware interface bridging MoveIt 2 to Arduino servo control. Features multi-modal control via Flask web interface with voice commands and ESP32 gesture glove.',
    tech: ['ROS 2', 'MoveIt 2', 'Gazebo', 'Flask', 'Arduino', 'ESP32'],
    github: 'https://github.com/LoopingOutLaw/Dexter',
    position: 0.4,
  },
  {
    id: 'bude',
    title: 'BUD-E',
    subtitle: '22M-Parameter VLA Model',
    description:
      'Re-implemented a 22M-parameter Vision-Language-Action model from scratch using soft-prompted flow matching for cross-embodiment robot policy learning. Fuses camera (ViT-S), text (BPE), and proprioceptive state embeddings via domain-specific soft prompts.',
    tech: ['PyTorch', 'Transformer', 'Flow Matching', 'ViT-S', 'BPE Tokenizer'],
    github: 'https://github.com/LoopingOutLaw/BUD-E',
    position: 0.65,
  },
  {
    id: 'braille',
    title: 'Braille Glove',
    subtitle: 'Wearable Haptic Interface',
    description:
      'A custom two-board PCB (ESP32-WROOM-32, MOSFET drivers, buck converter) enabling bidirectional Telegram messaging via six solenoid-driven Grade-1 Braille fingers. Patent filed (EDP-26).',
    tech: ['ESP32', 'EasyEDA', 'PCB', 'BLE', 'FastAPI', 'React'],
    github: 'https://github.com/LoopingOutLaw/Braille-Glove',
    position: 0.9,
  },
];

export default function Projects() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeProject, setActiveProject] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.5,
      pin: false,
      onUpdate: (self) => {
        setScrollProgress(self.progress);

        const progress = self.progress;
        const active = projects.reduce((nearestIdx, project, idx) => {
          const nearestDistance = Math.abs(progress - projects[nearestIdx].position);
          const projectDistance = Math.abs(progress - project.position);
          return projectDistance < nearestDistance ? idx : nearestIdx;
        }, 0);
        setActiveProject(active);
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  useEffect(() => {
    cardRefs.current.forEach((card, idx) => {
      if (!card) return;
      if (activeProject === idx) {
        gsap.to(card, {
          x: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power3.out',
        });
      } else {
        gsap.to(card, {
          x: -60,
          opacity: 0,
          duration: 0.4,
          ease: 'power3.in',
        });
      }
    });
  }, [activeProject]);

  const jumpToProject = (idx: number) => {
    const section = sectionRef.current;
    if (!section) return;

    const sectionScrollableHeight = section.offsetHeight - window.innerHeight;
    const targetY = section.offsetTop + sectionScrollableHeight * projects[idx].position;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative"
      style={{ height: '400vh', backgroundColor: 'var(--void)' }}
    >
      <div
        className="sticky top-0 w-full overflow-hidden"
        style={{ height: '100vh' }}
      >
        <Wormhole scrollProgress={scrollProgress} />

        <div
          className="absolute left-0 top-0 z-10 hidden h-full flex-col justify-center gap-3 md:flex"
          style={{ paddingLeft: '5vw' }}
          aria-label="Project selector"
        >
          {projects.map((project, idx) => (
            <button
              key={project.id}
              type="button"
              className="project-orbit-button flex items-center gap-3 border px-3 py-2 text-left"
              style={{
                borderColor:
                  activeProject === idx
                    ? 'rgba(0, 255, 255, 0.65)'
                    : 'rgba(255, 255, 255, 0.14)',
                backgroundColor:
                  activeProject === idx
                    ? 'rgba(0, 255, 255, 0.08)'
                    : 'rgba(5, 5, 5, 0.42)',
                color: activeProject === idx ? 'var(--wireframe)' : 'var(--subtle)',
              }}
              onClick={() => jumpToProject(idx)}
            >
              <span className="font-mono text-[10px]">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <span className="font-mono text-xs tracking-widest">{project.title}</span>
            </button>
          ))}
        </div>

        {/* Project info labels on the right */}
        <div
          className="absolute top-0 right-0 z-10 hidden h-full flex-col justify-center md:flex"
          style={{ padding: '0 5vw', width: '45%', maxWidth: '520px' }}
        >
          <p
            className="text-label font-mono mb-4"
            style={{ color: 'var(--subtle)' }}
          >
            SELECTED PROJECTS
          </p>

          {projects.map((project, idx) => (
            <div
              key={project.id}
              ref={(el) => { cardRefs.current[idx] = el; }}
              className="absolute"
              style={{
                opacity: 0,
                transform: 'translateX(-60px) translateY(-50%)',
                top: '50%',
                width: '100%',
              }}
            >
              <div
                className="project-card relative p-6"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className="font-mono text-xs"
                    style={{ color: 'var(--highlight)' }}
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <h3
                    className="font-display text-2xl font-medium"
                    style={{ color: 'var(--surface)' }}
                  >
                    {project.title}
                  </h3>
                </div>
                <p
                  className="font-mono text-sm mb-3"
                  style={{ color: 'var(--wireframe)' }}
                >
                  {project.subtitle}
                </p>
                <p
                  className="font-display text-sm leading-relaxed mb-4"
                  style={{ color: 'var(--subtle)' }}
                >
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="font-mono text-xs px-2 py-1"
                      style={{
                        color: 'var(--subtle)',
                        border: '1px solid rgba(189, 189, 189, 0.3)',
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-mono text-sm"
                  style={{ color: 'var(--highlight)' }}
                >
                  <Github size={14} />
                  VIEW SOURCE
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 p-5 md:hidden">
          <div className="project-card relative p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-label font-mono" style={{ color: 'var(--subtle)' }}>
                SELECTED PROJECTS
              </p>
              <span className="font-mono text-xs" style={{ color: 'var(--highlight)' }}>
                {String(activeProject + 1).padStart(2, '0')} / {projects.length}
              </span>
            </div>

            <h3
              className="font-display text-2xl font-medium"
              style={{ color: 'var(--surface)' }}
            >
              {projects[activeProject].title}
            </h3>
            <p className="font-mono text-sm mt-1" style={{ color: 'var(--wireframe)' }}>
              {projects[activeProject].subtitle}
            </p>
            <p
              className="font-display text-sm leading-relaxed mt-3"
              style={{ color: 'var(--subtle)' }}
            >
              {projects[activeProject].description}
            </p>
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
              {projects[activeProject].tech.map((t) => (
                <span
                  key={t}
                  className="shrink-0 font-mono text-[10px] px-2 py-1"
                  style={{
                    color: 'var(--subtle)',
                    border: '1px solid rgba(189, 189, 189, 0.3)',
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Progress indicator */}
        <div
          className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-4 md:flex"
        >
          {projects.map((_, idx) => (
            <div
              key={idx}
              className="transition-all duration-300"
              style={{
                width: activeProject === idx ? '24px' : '8px',
                height: '8px',
                backgroundColor:
                  activeProject === idx
                    ? 'var(--highlight)'
                    : 'rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
