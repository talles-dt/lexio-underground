"use client";

import React, { useEffect, useState, useRef, useCallback, ReactNode } from "react";

/* ------------------------------------------------------------------ */
/*  Grain Texture Overlay                                              */
/* ------------------------------------------------------------------ */

export function GrainOverlay() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: "-50%",
        left: "-50%",
        right: "-50%",
        bottom: "-50%",
        width: "200%",
        height: "200%",
        pointerEvents: "none",
        zIndex: 9999,
        opacity: 0.035,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        animation: "grain-shift 8s steps(10) infinite",
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Kinetic Text Reveal                                                */
/* ------------------------------------------------------------------ */

interface KineticTextProps {
  text: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  stagger?: number;
  revealDirection?: "up" | "left" | "scale";
}

export function KineticText({
  text,
  style,
  delay = 0,
  stagger = 0.03,
  revealDirection = "up",
}: Omit<KineticTextProps, "as">) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  const transforms: Record<string, { hidden: string; visible: string }> = {
    up: { hidden: "translateY(110%)", visible: "translateY(0%)" },
    left: { hidden: "translateX(-100%)", visible: "translateX(0%)" },
    scale: { hidden: "scale(0.8)", visible: "scale(1)" },
  };

  const t = transforms[revealDirection];

  return (
    <div
      ref={ref}
      style={{ display: "inline-block", overflow: "hidden", ...style }}
    >
      {text.split("").map((char, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            transform: visible ? t.visible : t.hidden,
            opacity: visible ? 1 : 0,
            transition: `transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${i * stagger}s, opacity 0.6s ease ${i * stagger}s`,
            whiteSpace: char === " " ? "pre" : undefined,
          }}
        >
          {char}
        </span>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Magnetic Hover                                                     */
/* ------------------------------------------------------------------ */

interface MagneticProps {
  children: ReactNode;
  strength?: number;
  style?: React.CSSProperties;
  className?: string;
}

export function Magnetic({
  children,
  strength = 0.2,
  style,
  className,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      ref.current.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    },
    [strength]
  );

  const onMouseLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = "translate(0px, 0px)";
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ transition: "transform 0.5s cubic-bezier(0.33, 1, 0.68, 1)", ...style }}
      className={className}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Scroll Counter                                                     */
/* ------------------------------------------------------------------ */

interface CounterProps {
  target: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  style?: React.CSSProperties;
}

export function Counter({
  target,
  duration = 2,
  prefix = "",
  suffix = "",
  style,
}: CounterProps) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [started, target, duration]);

  return (
    <span ref={ref} style={style}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Parallax Layer                                                     */
/* ------------------------------------------------------------------ */

interface ParallaxLayerProps {
  children: ReactNode;
  speed?: number; // 0 = fixed, 1 = normal, >1 = faster, <1 = slower
  style?: React.CSSProperties;
}

export function ParallaxLayer({
  children,
  speed = 0.5,
  style,
}: ParallaxLayerProps) {
  const [offset, setOffset] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2;
      const viewportCenter = window.innerHeight / 2;
      setOffset((centerY - viewportCenter) * speed * -0.1);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return (
    <div
      ref={ref}
      style={{
        transform: `translate3d(0, ${offset}px, 0)`,
        transition: "transform 0.1s linear",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page Transition Wrapper                                            */
/* ------------------------------------------------------------------ */

interface PageTransitionProps {
  children: ReactNode;
  pathname: string;
}

export function PageTransition({ children, pathname }: PageTransitionProps) {
  const [visible, setVisible] = useState(false);
  const [displayedPath, setDisplayedPath] = useState(pathname);

  useEffect(() => {
    if (pathname !== displayedPath) {
      setVisible(false);
      const timer = setTimeout(() => {
        setDisplayedPath(pathname);
        setVisible(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setVisible(true);
    }
  }, [pathname, displayedPath]);

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0px)" : "translateY(12px)",
        transition: "opacity 0.4s ease-out, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Image Reveal                                                       */
/* ------------------------------------------------------------------ */

interface ImageRevealProps {
  children: ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}

export function ImageReveal({ children, delay = 0, style }: ImageRevealProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      style={{
        overflow: "hidden",
        ...style,
      }}
    >
      <div
        style={{
          transform: visible ? "scale(1)" : "scale(1.15)",
          clipPath: visible ? "inset(0% 0 0 0)" : "inset(100% 0 0 0)",
          transition: "transform 1.2s cubic-bezier(0.16, 1, 0.3, 1), clip-path 1s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Styles to inject globally                                         */
/* ------------------------------------------------------------------ */

export const stitchGlobalStyles = `
@keyframes grain-shift {
  0%, 100% { transform: translate(0, 0); }
  10% { transform: translate(-5%, -10%); }
  20% { transform: translate(-15%, 5%); }
  30% { transform: translate(7%, -25%); }
  40% { transform: translate(-5%, 25%); }
  50% { transform: translate(-15%, 10%); }
  60% { transform: translate(15%, 0%); }
  70% { transform: translate(0%, 15%); }
  85% { transform: translate(-10%, 10%); }
  90% { transform: translate(10%, -5%); }
}

/* Smooth scroll for the whole page */
html {
  scroll-behavior: smooth;
}

/* Selection color */
::selection {
  background: rgba(0, 255, 136, 0.25);
  color: #f5f0e8;
}

/* Focus visible */
:focus-visible {
  outline: 1px solid #00ff88;
  outline-offset: 2px;
  border-radius: 4px;
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 6px;
  background: #0d0d0f;
}
::-webkit-scrollbar-thumb {
  background: #27272a;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #71717a;
}
`;
