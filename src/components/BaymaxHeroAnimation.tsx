import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function BaymaxHeroAnimation() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<SVGGElement>(null);
  const eyesRef = useRef<SVGGElement>(null);
  const armRef = useRef<SVGGElement>(null);
  const bodyRef = useRef<SVGGElement>(null);
  const shadowRef = useRef<SVGEllipseElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    const head = headRef.current;
    const eyes = eyesRef.current;
    const arm = armRef.current;
    const body = bodyRef.current;
    const shadow = shadowRef.current;

    if (!scene || !head || !eyes || !arm || !body || !shadow) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      gsap.set(scene, { autoAlpha: 0, xPercent: -50, y: 36, scale: 0.96 });
      gsap.set(arm, { transformOrigin: '100px 126px', rotate: 0 });
      gsap.set(head, { transformOrigin: '130px 78px' });
      gsap.set(body, { transformOrigin: '130px 158px' });

      if (reduceMotion) {
        gsap.set(scene, { autoAlpha: 1, xPercent: -50, y: 0, scale: 1 });
        return;
      }

      const intro = gsap.timeline({ delay: 0.15 });
      intro
        .to(scene, { autoAlpha: 1, y: 0, scale: 1, duration: 0.9, ease: 'power3.out' })
        .to(arm, { rotate: -34, duration: 0.45, ease: 'back.out(2)' }, '-=0.2')
        .to(arm, { rotate: -12, duration: 0.28, repeat: 3, yoyo: true, ease: 'sine.inOut' })
        .to(arm, { rotate: 0, duration: 0.55, ease: 'power3.out' })
        .to(head, { rotate: -3, y: 2, duration: 0.7, ease: 'sine.inOut' }, '-=0.3')
        .to(head, { rotate: 0, y: 0, duration: 0.7, ease: 'sine.inOut' });

      gsap.to(body, {
        y: -4,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to(shadow, {
        scaleX: 0.88,
        opacity: 0.18,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        transformOrigin: 'center',
        ease: 'sine.inOut',
      });

      gsap.to(scene, {
        y: '-36vh',
        scale: 0.72,
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8,
        },
      });
    }, scene);

    const moveHead = (event: MouseEvent) => {
      if (reduceMotion) return;
      const bounds = scene.getBoundingClientRect();
      const relX = (event.clientX - bounds.left) / bounds.width - 0.5;
      const relY = (event.clientY - bounds.top) / bounds.height - 0.5;
      const clampedX = gsap.utils.clamp(-0.5, 0.5, relX);
      const clampedY = gsap.utils.clamp(-0.5, 0.5, relY);

      gsap.to(head, {
        rotate: clampedX * 10,
        x: clampedX * 8,
        y: clampedY * 7,
        duration: 0.45,
        ease: 'power3.out',
      });

      gsap.to(eyes, {
        x: clampedX * 4,
        y: clampedY * 3,
        duration: 0.35,
        ease: 'power3.out',
      });
    };

    window.addEventListener('mousemove', moveHead, { passive: true });

    return () => {
      window.removeEventListener('mousemove', moveHead);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={sceneRef} className="baymax-hero" aria-hidden="true">
      <div className="baymax-peek-rail" />
      <svg className="baymax-svg" viewBox="0 0 260 260" role="img" focusable="false">
        <defs>
          <linearGradient id="baymaxBody" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="56%" stopColor="#f4f4f4" />
            <stop offset="100%" stopColor="#dcdcdc" />
          </linearGradient>
          <radialGradient id="baymaxGlow" cx="42%" cy="25%" r="70%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#e4e4e4" stopOpacity="0.2" />
          </radialGradient>
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="160%">
            <feDropShadow dx="0" dy="18" stdDeviation="14" floodColor="#050505" floodOpacity="0.18" />
          </filter>
        </defs>

        <ellipse ref={shadowRef} cx="130" cy="228" rx="60" ry="13" fill="#050505" opacity="0.22" />

        <g ref={bodyRef} filter="url(#softShadow)">
          <path
            d="M74 138C74 96 96 75 130 75C164 75 186 96 186 138V168C186 207 164 224 130 224C96 224 74 207 74 168V138Z"
            fill="url(#baymaxBody)"
          />
          <path
            d="M82 135C84 103 101 85 129 85C158 85 176 104 178 137"
            fill="none"
            stroke="#ffffff"
            strokeWidth="9"
            strokeLinecap="round"
            opacity="0.72"
          />

          <g ref={armRef}>
            <path
              d="M82 128C55 126 36 143 33 172C31 191 40 205 54 204C66 203 70 191 68 177C66 162 73 150 88 146Z"
              fill="url(#baymaxBody)"
            />
            <circle cx="53" cy="200" r="8" fill="#eeeeee" />
          </g>

          <path
            d="M178 128C205 127 225 145 227 174C229 193 220 206 206 204C194 202 190 190 192 176C194 162 187 150 172 146Z"
            fill="url(#baymaxBody)"
          />

          <g ref={headRef}>
            <ellipse cx="130" cy="76" rx="58" ry="38" fill="url(#baymaxBody)" />
            <ellipse cx="118" cy="62" rx="36" ry="17" fill="url(#baymaxGlow)" />
            <g ref={eyesRef}>
              <line x1="109" y1="77" x2="151" y2="77" stroke="#111111" strokeWidth="3" strokeLinecap="round" />
              <circle cx="105" cy="77" r="5.6" fill="#111111" />
              <circle cx="155" cy="77" r="5.6" fill="#111111" />
            </g>
          </g>

          <path
            d="M96 157C113 166 146 166 164 157"
            fill="none"
            stroke="#d2d2d2"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.65"
          />
        </g>
      </svg>
    </div>
  );
}
