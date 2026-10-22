// App.js  (v2 — no Font Awesome needed, icons are built-in SVG)
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import axios from 'axios';

import image1 from './images/tullu.PNG';
import magic from './images/magic.png';
import port from './images/port.png';
import bg from './images/bg.png';
import cvPdf from './assets/daniel-sheleme-cv.pdf';

/* -------------------------------------------------------------------------- */
/*  Content (edit everything here)                                            */
/* -------------------------------------------------------------------------- */

const PROFILE = {
  name: 'Daniel Sheleme',
  firstName: 'Daniel',
  location: 'Addis Ababa, Ethiopia',
  email: 'danid93575@gmail.com',
  phone: '+251 921 225 887',
  roles: ['Full-Stack Developer', 'React Specialist', 'ERP Developer', 'Problem Solver'],
};

const NAV = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'process', label: 'Process' },
  { id: 'projects', label: 'Work' },
  { id: 'contact', label: 'Contact' },
];

const STATS = [
  { value: 3, suffix: '+', label: 'Years of experience' },
  { value: 20, suffix: '+', label: 'Projects delivered' },
  { value: 15, suffix: '+', label: 'Technologies' },
];

const SKILL_GROUPS = [
  {
    key: 'frontend',
    title: 'Frontend',
    icon: 'layout',
    blurb: 'Interfaces that are fast, accessible and a pleasure to use.',
    skills: ['React', 'JavaScript', 'TypeScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'Bootstrap'],
  },
  {
    key: 'backend',
    title: 'Backend',
    icon: 'server',
    blurb: 'Reliable APIs and data layers that scale with your product.',
    skills: ['Node.js', 'Express.js', 'Next.js', 'REST APIs', 'MongoDB', 'MySQL'],
  },
  {
    key: 'tools',
    title: 'Tools & Design',
    icon: 'tools',
    blurb: 'A workflow that keeps design and code in sync.',
    skills: ['Git', 'GitHub', 'Figma', 'Photoshop', 'Webpack', 'Linux', 'VS Code'],
  },
];

const PROCESS = [
  { icon: 'search', title: 'Discover', desc: 'We clarify goals, audience and scope so the build starts on solid ground.' },
  { icon: 'pen', title: 'Design', desc: 'Wireframes and UI that are clean, consistent and ready for real content.' },
  { icon: 'code', title: 'Build', desc: 'Clean, tested, responsive code with regular progress you can review.' },
  { icon: 'rocket', title: 'Launch', desc: 'Deployment, performance checks and support after the site goes live.' },
];

// NOTE: please double-check these descriptions and tags match the real projects.
const PROJECTS = [
  {
    title: 'Tullu Dimtu School ERP System',
    description:
      'An enterprise resource planning system for Tullu Dimtu School to manage academic records, student information, and administrative tasks.',
    image: image1,
        tags: ['React', 'Tailwind CSS', 'Node.js', 'Rest APIs', 'Authentication'],
    liveLink: 'https://tuludimtuschool.com',
    githubLink: 'https://github.com/danidan902/Tullu-dimtu-school-frontend',
  },
  {
    title: 'Web Chatting Platform',
    description:
      'A web-based chat application that lets people sign in and exchange messages through a clean, responsive interface.',
    image: magic,
    tags: ['React', 'Node.js', 'Tailwind CSS', 'Socket.io', 'Authentication'],
    liveLink: 'https://danichatting.vercel.app/',
    githubLink: 'https://github.com/danidan902/Dani-Frontend-Chatting',
  },
  {
    title: 'Portfolio Website',
    description:
      'A modern, responsive portfolio website to showcase my work, skills, and contact information.',
    image: port,
    tags: ['React', 'Tailwind CSS', 'Node.js', ],
    liveLink: 'https://danidanportfolio.vercel.app/',
    githubLink: 'https://github.com/danidan902',
  },
];

const SOCIALS = [
  { label: 'GitHub', icon: 'github', href: 'https://github.com/danidan902' },
  { label: 'X', icon: 'x', href: 'https://x.com/DaniDan43961658' },
  { label: 'Instagram', icon: 'instagram', href: 'https://www.instagram.com/dan2122n/' },
  { label: 'TikTok', icon: 'tiktok', href: 'https://www.tiktok.com/@dani.dan195' },
  { label: 'LinkedIn', icon: 'linkedin', href: 'https://www.linkedin.com/in/dani-dan-872b87373/' },
];

// Accent palettes — visitors can switch between them with the color button.
const ACCENTS = [
  { id: 'ember', name: 'Ember', a1: '#fb923c', a2: '#f43f5e', rgb: '251,146,60' },
  { id: 'emerald', name: 'Emerald', a1: '#34d399', a2: '#a3e635', rgb: '52,211,153' },
  { id: 'violet', name: 'Violet', a1: '#a78bfa', a2: '#f472b6', rgb: '167,139,250' },
  { id: 'ocean', name: 'Ocean', a1: '#38bdf8', a2: '#22d3ee', rgb: '56,189,248' },
];

const CONTACT_API =
  process.env.REACT_APP_CONTACT_API || 'https://api-node-backend.onrender.com/api/contact';

/* -------------------------------------------------------------------------- */
/*  Global styles (animations + accent helpers, no Tailwind config needed)    */
/* -------------------------------------------------------------------------- */

const GLOBAL_CSS = `
html { scroll-behavior: smooth; }
.grad-text { background: linear-gradient(90deg, var(--a1), var(--a2)); -webkit-background-clip: text; background-clip: text; color: transparent; }
.grad-bg { background: linear-gradient(135deg, var(--a1), var(--a2)); }
.accent { color: var(--a1); }
.accent-soft { background: rgba(var(--rgb), 0.12); color: var(--a1); }
.accent-ring:hover { border-color: rgba(var(--rgb), 0.55) !important; }
.accent-glow:hover { box-shadow: 0 18px 50px -20px rgba(var(--rgb), 0.55); }
.btn-glow { box-shadow: 0 10px 30px -10px rgba(var(--rgb), 0.7); }
.btn-glow:hover { box-shadow: 0 14px 40px -8px rgba(var(--rgb), 0.9); transform: translateY(-1px); }
.spotlight { background: radial-gradient(600px circle at var(--mx, 50%) var(--my, 30%), rgba(var(--rgb), 0.16), transparent 60%); }
.reveal { opacity: 0; transform: translateY(24px); transition: opacity .7s cubic-bezier(.2,.7,.2,1), transform .7s cubic-bezier(.2,.7,.2,1); }
.reveal.is-visible { opacity: 1; transform: none; }
.caret { display: inline-block; width: 3px; height: 1em; margin-left: 4px; background: var(--a1); vertical-align: -0.12em; animation: blink 1s steps(1) infinite; }
.ring-spin { background: conic-gradient(from 0deg, var(--a1), var(--a2), transparent 55%, var(--a1)); animation: spin 8s linear infinite; }
.marquee-track { display: flex; width: max-content; animation: marquee 32s linear infinite; }
.marquee:hover .marquee-track { animation-play-state: paused; }
.float-slow { animation: float 6s ease-in-out infinite; }
@keyframes blink { 50% { opacity: 0; } }
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes marquee { to { transform: translateX(-50%); } }
@keyframes float { 50% { transform: translateY(-10px); } }
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .reveal { opacity: 1; transform: none; transition: none; }
  .ring-spin, .marquee-track, .float-slow, .caret { animation: none; }
}
`;

/* -------------------------------------------------------------------------- */
/*  Icons (inline SVG — no external font/CSS package required)                */
/* -------------------------------------------------------------------------- */

const STROKE_ICONS = {
  arrowRight: 'M5 12h14M12 5l7 7-7 7',
  up: 'M12 19V5M5 12l7-7 7 7',
  download: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3',
  mail: 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6',
  phone:
    'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z',
  pin: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  external: 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3',
  code: 'M16 18l6-6-6-6M8 6l-6 6 6 6',
  layout: 'M3 3h18v18H3zM3 9h18M9 21V9',
  server: 'M2 3h20v7H2zM2 14h20v7H2zM6 6.5h.01M6 17.5h.01',
  tools:
    'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z',
  menu: 'M3 12h18M3 6h18M3 18h18',
  close: 'M18 6L6 18M6 6l12 12',
  send: 'M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z',
  check: 'M20 6L9 17l-5-5',
  copy: 'M9 9h11v11H9zM5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1',
  palette:
    'M12 2a10 10 0 1 0 0 20 2 2 0 0 0 2-2v-1.5a2 2 0 0 1 2-2H18a4 4 0 0 0 4-4A10 10 0 0 0 12 2zM7.5 11.5h.01M10 7.5h.01M15 7.5h.01',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35',
  pen: 'M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z',
  rocket:
    'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09zM12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2zM9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5',
  spinner: 'M21 12a9 9 0 1 1-6.22-8.56',
  github:
    'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22',
  instagram:
    'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zM16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01',
    linkedin:
  'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z',
};

const FILL_ICONS = {
  x: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  tiktok:
    'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z',
};

const Icon = ({ name, size = 18, className = '' }) => {
  const filled = Boolean(FILL_ICONS[name]);
  const d = filled ? FILL_ICONS[name] : STROKE_ICONS[name];
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
};

/* -------------------------------------------------------------------------- */
/*  Hooks & small helpers                                                     */
/* -------------------------------------------------------------------------- */

const useInView = (options = { threshold: 0.15 }) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, options);
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [ref, inView];
};

const Reveal = ({ children, delay = 0, className = '' }) => {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={`reveal ${inView ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const useCountUp = (end, active, duration = 1400) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return undefined;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      setValue(Math.round(end * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [end, active, duration]);
  return value;
};

const useTypewriter = (words, speed = 70, pause = 1400) => {
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIndex % words.length];
    let delay = deleting ? speed / 2 : speed;

    if (!deleting && text === word) delay = pause;
    if (deleting && text === '') delay = 300;

    const t = setTimeout(() => {
      if (!deleting && text === word) return setDeleting(true);
      if (deleting && text === '') {
        setDeleting(false);
        return setWordIndex((i) => i + 1);
      }
      setText(word.slice(0, text.length + (deleting ? -1 : 1)));
    }, delay);

    return () => clearTimeout(t);
  }, [text, deleting, wordIndex, words, speed, pause]);

  return text;
};

const useActiveSection = (ids) => {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);
  return active;
};

/* -------------------------------------------------------------------------- */
/*  Shared UI                                                                 */
/* -------------------------------------------------------------------------- */

const btn =
  'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950';
const btnPrimary = `${btn} grad-bg btn-glow text-neutral-950`;
const btnGhost = `${btn} border border-white/15 text-white hover:border-white/40 hover:bg-white/5`;

const Section = ({ id, eyebrow, title, subtitle, children }) => (
  <section id={id} className="relative scroll-mt-10 py-28">
    <div className="mx-auto max-w-6xl px-6">
      <Reveal>
        <header className="mb-16 max-w-2xl">
          <p className="mb-4 inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] accent">
            <span className="h-px w-8 grad-bg" /> {eyebrow}
          </p>
          <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">{title}</h2>
          {subtitle && <p className="mt-5 text-lg leading-relaxed text-neutral-400">{subtitle}</p>}
        </header>
      </Reveal>
      {children}
    </div>
  </section>
);

const Pill = ({ children }) => (
  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-neutral-300">
    {children}
  </span>
);

const card =
  'rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur transition-all duration-300 accent-ring';

/* -------------------------------------------------------------------------- */
/*  Chrome: progress bar, header, accent picker, back-to-top                  */
/* -------------------------------------------------------------------------- */

const ScrollProgress = () => {
  const barRef = useRef(null);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? window.scrollY / h : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-0.5 bg-transparent">
      <div ref={barRef} className="h-full origin-left grad-bg" style={{ transform: 'scaleX(0)' }} />
    </div>
  );
};

const Header = () => {
  const [open, setOpen] = useState(false);
  const active = useActiveSection(NAV.map((n) => n.id));

  const link = (id) =>
    `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
      active === id ? 'bg-white/10 text-white' : 'text-neutral-400 hover:text-white'
    }`;

  return (
    <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <div className="w-full max-w-3xl">
        <div className="flex items-center justify-between rounded-full border border-white/10 bg-neutral-950/70 py-2 pl-5 pr-2 backdrop-blur-xl">
          <a href="#home" className="text-base font-extrabold tracking-tight text-white">
            {PROFILE.firstName}
            <span className="grad-text">.</span>
          </a>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {NAV.map((n) => (
              <a key={n.id} href={`#${n.id}`} className={link(n.id)}>
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a href={cvPdf} download="Daniel-Sheleme-CV.pdf" className={`${btnPrimary} !px-4 !py-2`}>
              <Icon name="download" size={14} /> CV
            </a>
            <button
              type="button"
              className="rounded-full p-2 text-neutral-300 hover:bg-white/10 md:hidden"
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
            >
              <Icon name={open ? 'close' : 'menu'} size={20} />
            </button>
          </div>
        </div>

        {open && (
          <nav
            className="mt-2 rounded-3xl border border-white/10 bg-neutral-950/90 p-3 backdrop-blur-xl md:hidden"
            aria-label="Mobile"
          >
            {NAV.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                onClick={() => setOpen(false)}
                className={`${link(n.id)} block py-3`}
              >
                {n.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

const AccentPicker = ({ accent, onChange }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-center gap-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Change accent color"
        aria-expanded={open}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-neutral-900/80 text-white backdrop-blur transition-transform hover:scale-105"
      >
        <Icon name="palette" size={20} />
      </button>
      {open && (
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-neutral-900/90 px-3 py-2 backdrop-blur">
          {ACCENTS.map((a) => (
            <button
              key={a.id}
              type="button"
              title={a.name}
              aria-label={`${a.name} theme`}
              onClick={() => onChange(a.id)}
              className={`h-7 w-7 rounded-full transition-transform hover:scale-110 ${
                accent.id === a.id ? 'ring-2 ring-white ring-offset-2 ring-offset-neutral-900' : ''
              }`}
              style={{ background: `linear-gradient(135deg, ${a.a1}, ${a.a2})` }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const BackToTop = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <a
      href="#home"
      aria-label="Back to top"
      className={`fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full grad-bg text-neutral-950 btn-glow transition-all duration-300 ${
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <Icon name="up" size={20} />
    </a>
  );
};

/* -------------------------------------------------------------------------- */
/*  Hero                                                                      */
/* -------------------------------------------------------------------------- */

const Hero = () => {
  const text = useTypewriter(PROFILE.roles);
  const sectionRef = useRef(null);

  const onMove = useCallback((e) => {
    const el = sectionRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  }, []);

  return (
    <section
      id="home"
      ref={sectionRef}
      onMouseMove={onMove}
      className="relative flex min-h-screen items-center overflow-hidden pt-24"
    >
      <div aria-hidden className="spotlight pointer-events-none absolute inset-0" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse at 50% 40%, #000 25%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 40%, #000 25%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-16 px-6 py-16 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-neutral-200">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Open to freelance &amp; full-time work
            </span>
          </Reveal>

          <Reveal delay={100}>
            <h1 className="mt-7 text-5xl font-black leading-[1.02] tracking-tight text-white sm:text-7xl">
              I'm {PROFILE.firstName},
              <br />
              <span className="grad-text">{text}</span>
              <span className="caret" aria-hidden />
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-neutral-400">
             Self-taught Software Developer specializing in ERP systems, web development, and mobile application development. 
            </p>
          </Reveal>

          <Reveal delay={300}>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href="#projects" className={btnPrimary}>
                See my work <Icon name="arrowRight" size={16} />
              </a>
              <a href="#contact" className={btnGhost}>
                Let's talk
              </a>
            </div>
          </Reveal>

          <Reveal delay={400}>
            <div className="mt-12 flex items-center gap-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                Find me
              </span>
              <span className="h-px w-10 bg-white/10" />
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="text-neutral-400 transition-colors hover:text-white"
                >
                  <Icon name={s.icon} size={20} />
                </a>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={200} className="flex justify-center lg:justify-end">
          <div className="relative float-slow">
            <div className="absolute -inset-1.5 rounded-[2.2rem] ring-spin opacity-80 blur-[1px]" />
            <div className="relative rounded-[2rem] bg-neutral-950 p-2">
              <img
                src={bg}
                alt={`Portrait of ${PROFILE.name}`}
                className="h-96 w-80 rounded-[1.6rem] object-cover"
              />
            </div>

            <div className="absolute -left-8 bottom-10 rounded-2xl border border-white/10 bg-neutral-900/90 px-4 py-3 backdrop-blur-xl">
              <p className="text-2xl font-black grad-text">3+ yrs</p>
              {/* <p className="text-xs text-neutral-400">building for the web</p> */}
            </div>
            <div className="absolute -right-6 top-8 flex items-center gap-2 rounded-2xl border border-white/10 bg-neutral-900/90 px-4 py-3 backdrop-blur-xl">
              <span className="accent-soft flex h-8 w-8 items-center justify-center rounded-lg">
                <Icon name="code" size={16} />
              </span>
              {/* <span className="text-sm font-semibold text-white">React · Node</span> */}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

/* -------------------------------------------------------------------------- */
/*  Marquee                                                                   */
/* -------------------------------------------------------------------------- */

const Marquee = () => {
  const items = useMemo(() => SKILL_GROUPS.flatMap((g) => g.skills), []);
  const loop = [...items, ...items];
  return (
    <div className="marquee relative overflow-hidden border-y border-white/10 bg-white/[0.02] py-5" aria-hidden="true">
      <div className="marquee-track">
        {loop.map((s, i) => (
          <span key={`${s}-${i}`} className="mx-6 flex items-center gap-6 text-lg font-bold text-neutral-500">
            {s}
            <span className="h-1.5 w-1.5 rounded-full grad-bg" />
          </span>
        ))}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*  About (bento)                                                             */
/* -------------------------------------------------------------------------- */

const StatCard = ({ value, suffix, label }) => {
  const [ref, inView] = useInView();
  const n = useCountUp(value, inView);
  return (
    <div ref={ref} className={`${card} p-6`}>
      <p className="text-5xl font-black grad-text">
        {n}
        {suffix}
      </p>
      <p className="mt-2 text-sm text-neutral-400">{label}</p>
    </div>
  );
};

const About = () => (
  <Section
    id="about"
    eyebrow="About me"
    title="Code with craft, design with purpose."
    subtitle="A developer who cares as much about how things feel as how they work."
  >
    <div className="grid gap-5 lg:grid-cols-3">
      <Reveal className="lg:col-span-2">
        <div className={`${card} h-full p-8 sm:p-10`}>
          <h3 className="text-2xl font-bold text-white">Hi, I'm {PROFILE.name}.</h3>
          <div className="mt-5 space-y-4 text-lg leading-relaxed text-neutral-400">
           <p>
        

Self-taught Software Developer specializing in ERP systems, web development, mobile application development, and e-commerce solutions. Skilled in React.js, React Native, Tailwind CSS, JavaScript, Node.js, Express.js, and MongoDB. Experienced in developing practical software solutions, including a School Management System (ERP), a web-based chatting platform, and an e-commerce application. Also familiar with Kali Linux, Linux command-line tools, and basic cybersecurity concepts. Passionate about technology, problem-solving, continuous learning, and building secure, scalable, and user-friendly applications.
           </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {['React', 'Node.js', 'Tailwind CSS', 'REST APIs', 'Figma'].map((t) => (
              <Pill key={t}>{t}</Pill>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal delay={100}>
        <div className={`${card} flex h-full flex-col justify-between p-8`}>
          <span className="accent-soft flex h-12 w-12 items-center justify-center rounded-2xl">
            <Icon name="pin" size={22} />
          </span>
          <div className="mt-10">
            <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">Based in</p>
            <p className="mt-1 text-2xl font-bold text-white">{PROFILE.location}</p>
            <p className="mt-2 text-sm text-neutral-400">Working with clients worldwide, remotely.</p>
          </div>
        </div>
      </Reveal>

      {STATS.map((s, i) => (
        <Reveal key={s.label} delay={i * 100}>
          <StatCard {...s} />
        </Reveal>
      ))}
    </div>
  </Section>
);

/* -------------------------------------------------------------------------- */
/*  Skills                                                                    */
/* -------------------------------------------------------------------------- */

const Skills = () => (
  <Section
    id="skills"
    eyebrow="Skills"
    title="The toolkit behind the work"
    subtitle="Modern tools, used deliberately, to ship complete products."
  >
    <div className="grid gap-5 md:grid-cols-3">
      {SKILL_GROUPS.map((g, i) => (
        <Reveal key={g.key} delay={i * 100}>
          <div className={`${card} accent-glow h-full p-8`}>
            <span className="grad-bg flex h-12 w-12 items-center justify-center rounded-2xl text-neutral-950">
              <Icon name={g.icon} size={22} />
            </span>
            <h3 className="mt-6 text-xl font-bold text-white">{g.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-400">{g.blurb}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {g.skills.map((s) => (
                <Pill key={s}>{s}</Pill>
              ))}
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  </Section>
);

/* -------------------------------------------------------------------------- */
/*  Process                                                                   */
/* -------------------------------------------------------------------------- */

const Process = () => (
  <Section
    id="process"
    eyebrow="How I work"
    title="A simple process that delivers"
    subtitle="Clear steps, clear communication, no surprises."
  >
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {PROCESS.map((p, i) => (
        <Reveal key={p.title} delay={i * 100}>
          <div className={`${card} relative h-full p-7`}>
            <span className="absolute right-6 top-5 text-5xl font-black text-white/[0.06]">
              0{i + 1}
            </span>
            <span className="accent-soft flex h-11 w-11 items-center justify-center rounded-xl">
              <Icon name={p.icon} size={20} />
            </span>
            <h3 className="mt-6 text-lg font-bold text-white">{p.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-400">{p.desc}</p>
          </div>
        </Reveal>
      ))}
    </div>
  </Section>
);

/* -------------------------------------------------------------------------- */
/*  Projects                                                                  */
/* -------------------------------------------------------------------------- */

const ProjectCard = ({ project }) => (
  <article className={`${card} accent-glow group flex h-full flex-col overflow-hidden`}>
    <div className="relative h-56 overflow-hidden bg-neutral-900">
      <img
        src={project.image}
        alt={`${project.title} preview`}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent" />
      <a
        href={project.liveLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${project.title}`}
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full grad-bg text-neutral-950 opacity-0 transition-all duration-300 group-hover:opacity-100"
      >
        <Icon name="external" size={16} />
      </a>
    </div>

    <div className="flex flex-1 flex-col p-7">
      <h3 className="text-xl font-bold text-white">{project.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-neutral-400">{project.description}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {project.tags.map((t) => (
          <Pill key={t}>{t}</Pill>
        ))}
      </div>

      <div className="mt-6 flex gap-3">
        <a
          href={project.liveLink}
          target="_blank"
          rel="noopener noreferrer"
          className={`${btnPrimary} flex-1 !py-2.5`}
        >
          Live demo <Icon name="arrowRight" size={14} />
        </a>
        <a
          href={project.githubLink}
          target="_blank"
          rel="noopener noreferrer"
          className={`${btnGhost} flex-1 !py-2.5`}
        >
          <Icon name="github" size={15} /> Code
        </a>
      </div>
    </div>
  </article>
);

const Projects = () => {
  const [filter, setFilter] = useState('All');
  const tags = useMemo(() => ['All', ...new Set(PROJECTS.flatMap((p) => p.tags))], []);
  const visible = PROJECTS.filter((p) => filter === 'All' || p.tags.includes(filter));

  return (
    <Section
      id="projects"
      eyebrow="Selected work"
      title="Projects I'm proud of"
      subtitle="Real products, built end to end."
    >
      <Reveal>
        <div className="mb-10 flex flex-wrap gap-2" role="tablist" aria-label="Filter projects">
          {tags.map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={filter === t}
              onClick={() => setFilter(t)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                filter === t
                  ? 'grad-bg text-neutral-950'
                  : 'border border-white/10 text-neutral-400 hover:border-white/30 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </Reveal>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((p, i) => (
          <Reveal key={p.title} delay={i * 100}>
            <ProjectCard project={p} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
};

/* -------------------------------------------------------------------------- */
/*  Contact                                                                   */
/* -------------------------------------------------------------------------- */

const inputClass =
  'w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-white placeholder-neutral-500 transition-colors focus:border-white/40 focus:outline-none disabled:opacity-60';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null);
  const [copied, setCopied] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (err) {
      window.location.href = `mailto:${PROFILE.email}`;
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus(null);
    try {
      const { data } = await axios.post(CONTACT_API, form, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000,
      });
      setStatus({
        type: 'success',
        message: data?.message || 'Thanks for your message! I will get back to you soon.',
      });
      setForm({ name: '', email: '', message: '' });
    } catch (error) {
      let message = 'Something went wrong. Please try again.';
      if (error.response) {
        message = error.response.data?.message || `Server error (${error.response.status}).`;
      } else if (error.request) {
        message = 'Unable to reach the server. Please try again shortly or email me directly.';
      }
      setStatus({ type: 'error', message });
    } finally {
      setSending(false);
    }
  };

  return (
    <Section
      id="contact"
      eyebrow="Contact"
      title="Let's build something great"
      subtitle="Tell me about your project — I usually reply within a day."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <Reveal>
          <div className={`${card} h-full p-8`}>
            <p className="text-sm font-semibold uppercase tracking-widest text-neutral-500">
              Email me
            </p>
            <button
              type="button"
              onClick={copyEmail}
              className="mt-2 flex items-center gap-3 text-left text-xl font-bold text-white transition-opacity hover:opacity-80 sm:text-2xl"
            >
              <span className="break-all">{PROFILE.email}</span>
              <span className="accent-soft flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
                <Icon name={copied ? 'check' : 'copy'} size={16} />
              </span>
            </button>
            <p className="mt-1 h-5 text-xs accent">{copied ? 'Copied to clipboard' : ''}</p>

            <ul className="mt-8 space-y-5">
              <li>
                <a
                  href={`tel:${PROFILE.phone.replace(/\s/g, '')}`}
                  className="flex items-center gap-4 text-neutral-300 transition-colors hover:text-white"
                >
                  <span className="accent-soft flex h-11 w-11 items-center justify-center rounded-xl">
                    <Icon name="phone" size={18} />
                  </span>
                  {PROFILE.phone}
                </a>
              </li>
              <li className="flex items-center gap-4 text-neutral-300">
                <span className="accent-soft flex h-11 w-11 items-center justify-center rounded-xl">
                  <Icon name="pin" size={18} />
                </span>
                {PROFILE.location}
              </li>
            </ul>

            <div className="mt-10 flex gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-neutral-300 transition-all hover:-translate-y-0.5 hover:border-white/40 hover:text-white"
                >
                  <Icon name={s.icon} size={18} />
                </a>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <form onSubmit={onSubmit} className={`${card} space-y-5 p-8`}>
            {status && (
              <div
                role="status"
                className={`rounded-2xl border px-4 py-3 text-sm ${
                  status.type === 'success'
                    ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300'
                    : 'border-rose-400/30 bg-rose-400/10 text-rose-300'
                }`}
              >
                {status.message}
              </div>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-neutral-300">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={onChange}
                  disabled={sending}
                  placeholder="Your name"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-neutral-300">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={onChange}
                  disabled={sending}
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="mb-2 block text-sm font-medium text-neutral-300">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="6"
                required
                value={form.message}
                onChange={onChange}
                disabled={sending}
                placeholder="Tell me about your project..."
                className={`${inputClass} resize-none`}
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className={`${btnPrimary} w-full !py-4 disabled:cursor-not-allowed disabled:opacity-60`}
            >
              {sending ? (
                <>
                  <Icon name="spinner" size={16} className="animate-spin" /> Sending...
                </>
              ) : (
                <>
                  Send message <Icon name="send" size={16} />
                </>
              )}
            </button>
          </form>
        </Reveal>
      </div>
    </Section>
  );
};

/* -------------------------------------------------------------------------- */
/*  Footer                                                                    */
/* -------------------------------------------------------------------------- */

const Footer = () => (
  <footer className="border-t border-white/10">
    <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 py-10 md:flex-row">
      <a href="#home" className="text-lg font-extrabold text-white">
        {PROFILE.firstName}
        <span className="grad-text">.</span>
      </a>
      <p className="text-sm text-neutral-500">
        &copy; {new Date().getFullYear()} {PROFILE.name}.
      </p>
      <div className="flex gap-5">
        {SOCIALS.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
            className="text-neutral-500 transition-colors hover:text-white"
          >
            <Icon name={s.icon} size={18} />
          </a>
        ))}
      </div>
    </div>
  </footer>
);

/* -------------------------------------------------------------------------- */
/*  App                                                                       */
/* -------------------------------------------------------------------------- */

const STORAGE_KEY = 'portfolio-accent';

function App() {
  const [accentId, setAccentId] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || ACCENTS[0].id;
    } catch (e) {
      return ACCENTS[0].id;
    }
  });

  const accent = ACCENTS.find((a) => a.id === accentId) || ACCENTS[0];

  const changeAccent = (id) => {
    setAccentId(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch (e) {
      /* storage unavailable — ignore */
    }
  };

  return (
    <div
      className="min-h-screen bg-neutral-950 font-sans text-neutral-300 antialiased selection:bg-white/20"
      style={{ '--a1': accent.a1, '--a2': accent.a2, '--rgb': accent.rgb }}
    >
      <style>{GLOBAL_CSS}</style>

      <ScrollProgress />
      <Header />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Skills />
        <Process />
        <Projects />
        <Contact />
      </main>
      <Footer />

      <AccentPicker accent={accent} onChange={changeAccent} />
      <BackToTop />
    </div>
  );
}

export default App;