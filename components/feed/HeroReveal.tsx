'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { usePathname } from 'next/navigation';

export function HeroReveal() {
  const [show, setShow] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLHeadingElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Only show on the feed page, and only once per session
    if (pathname !== '/feed') return;
    
    const hasSeenHero = sessionStorage.getItem('hasSeenHero');
    if (hasSeenHero) return;

    sessionStorage.setItem('hasSeenHero', 'true');
    
    // Defer the animation trigger until after React has rendered the DOM
    requestAnimationFrame(() => {
      setShow(true);
      setIsReady(true);
    });
  }, [pathname]);

  useEffect(() => {
    if (!isReady || !containerRef.current || !logoRef.current) return;

    // Make sure we block scroll during animation
    document.body.style.overflow = 'hidden';

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setShow(false);
          document.body.style.overflow = '';
        }
      });

      // 1. Cinematic text reveal (blur to focus, scale down slightly)
      tl.fromTo(
        logoRef.current,
        { opacity: 0, scale: 1.1, filter: 'blur(20px)' },
        {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          duration: 1.5,
          ease: 'power3.out',
        }
      )
      // 2. Hold the logo for a beat
      .to(logoRef.current, {
        opacity: 0,
        scale: 0.95,
        filter: 'blur(10px)',
        duration: 0.8,
        ease: 'power2.in',
        delay: 0.5
      })
      // 3. Reveal the app (slide overlay up)
      .to(containerRef.current, {
        yPercent: -100,
        duration: 1.2,
        ease: 'power4.inOut',
      });
      
    });

    return () => {
      ctx.revert();
      document.body.style.overflow = '';
    };
  }, [isReady]);

  if (!show) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-(--bg-primary) flex items-center justify-center pointer-events-none"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[rgba(108,99,255,0.15)] via-(--bg-primary) to-(--bg-primary) opacity-50" />
      <h1
        ref={logoRef}
        className="text-6xl md:text-8xl font-serif text-(--text-primary) tracking-[0.2em] relative z-10"
      >
        LORE
      </h1>
    </div>
  );
}
