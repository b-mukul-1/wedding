import React, { useEffect, useState } from 'react';
import { ArrowUpRight, Music, Sparkles, Volume2, VolumeX, Heart, Crown, Feather, Flower2 } from 'lucide-react';
import Royal from './pages/Royal.jsx';
import Minimal from './pages/Minimal.jsx';
import Floral from './pages/Floral.jsx';
import { AudioDirector, SoundButton, useSound } from './components/AudioDirector.jsx';
import FairyDustCursor from './components/FairyDustCursor.jsx';
import SmoothScroll from './components/SmoothScroll.jsx';
import { WEDDING, daysToWedding } from './data.js';

const EXPERIENCES = [
  {
    path: '/royal',
    num: 'ACT 01',
    label: 'The Royal Film',
    kicker: 'AN IMMERSIVE PALACE CELEBRATION',
    desc: 'Golden gates part to reveal an illuminated palace, 3D sacred mandap, the 7 vows diya ceremony, and a galaxy of floating Tangled sky lanterns.',
    music: 'Acoustic Sitar (Raga Yaman)',
    img: '/art/palace-night.webp',
    icon: Crown,
    theme: 'royal',
    badge: 'FLAGSHIP 3D FILM',
  },
  {
    path: '/minimal',
    num: 'ACT 02',
    label: 'The Living Letter',
    kicker: 'A COUTURE EDITORIAL INVITATION',
    desc: 'A physical 3D wax seal to break, unfolding Italian cotton rag parchment, hand-drawn calligraphy, and couture magazine-style portrait folios.',
    music: 'Bass Bansuri Flute',
    img: '/art/paper.webp',
    icon: Feather,
    theme: 'minimal',
    badge: 'COUTURE STATIONERY',
  },
  {
    path: '/floral',
    num: 'ACT 03',
    label: 'The Enchanted Garden',
    kicker: 'A FAIRYTALE BOTANICAL JOURNEY',
    desc: 'Golden hour morning sunbeams, monarch butterflies, cascading rose petals, and a blooming floral mandap in an enchanted garden paradise.',
    music: 'Acoustic Classical Strings',
    img: '/art/floral-resort.webp',
    icon: Flower2,
    theme: 'floral',
    badge: 'DISNEY BOTANICAL',
  },
];

function StudioIndex() {
  const [intro, setIntro] = useState(false);
  const [days, setDays] = useState(daysToWedding());
  const { enabled, toggle } = useSound();

  useEffect(() => {
    const id = requestAnimationFrame(() => setIntro(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className={`studio-index ${intro ? 'studio-in' : ''}`}>
      <FairyDustCursor />

      {/* Top Navigation */}
      <header className="studio-top">
        <a className="studio-monogram" href="/">
          V<span>✦</span>Y
        </a>
        <div className="studio-top-center">
          <span>THE WEDDING CELEBRATION OF VIDHI &amp; YASH</span>
        </div>
        <div className="studio-top-right">
          <SoundButton />
          <span className="studio-top-date">25.11.2026</span>
        </div>
      </header>

      {/* Ambient background glows */}
      <div className="studio-ambient" aria-hidden="true" />
      <div className="studio-lines" aria-hidden="true" />

      {/* Hero Header */}
      <section className="studio-intro">
        <div className="studio-sacred-badge">
          <span>॥ श्री गणेशाय नमः ॥</span>
        </div>
        <p className="studio-overline">DIRECTOR'S CUT SPECIAL EDITION · THREE CINEMATIC WORLDS</p>
        <h1 className="studio-main-title">
          Three worlds.
          <br />
          <em>One forever.</em>
        </h1>
        <p className="studio-lead">
          Experience the sacred union of <strong>Vidhi &amp; Yash</strong> through three uniquely authored, scroll-driven interactive films. Choose an experience below to enter.
        </p>

        <div className="studio-countdown-pill">
          <Sparkles size={15} />
          <span>{days} DAYS UNTIL WEDNESDAY, 25 NOVEMBER 2026</span>
          <Sparkles size={15} />
        </div>
      </section>

      {/* The 3 Film Cards Gallery */}
      <div className="studio-grid">
        {EXPERIENCES.map((c) => {
          const Icon = c.icon;
          return (
            <a key={c.path} href={c.path} className={`studio-tile tile-${c.theme}`}>
              <div className="tile-image-wrap">
                <img src={c.img} alt={`${c.label} scenery`} loading="lazy" />
                <div className="tile-shade" />
              </div>

              <div className="tile-top-meta">
                <span className="tile-number">{c.num}</span>
                <span className="tile-badge">{c.badge}</span>
              </div>

              <div className="tile-content">
                <span className="tile-tag">{c.kicker}</span>
                <h2 className="tile-title">
                  <Icon size={22} className="tile-icon" />
                  {c.label}
                </h2>
                <p className="tile-desc">{c.desc}</p>

                <div className="tile-sound-pill">
                  <Music size={13} />
                  <span>{c.music}</span>
                </div>

                <div className="tile-enter-btn">
                  <span>ENTER THE EXPERIENCE</span>
                  <ArrowUpRight size={17} />
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {/* Footer Info */}
      <footer className="studio-index-footer">
        <div className="studio-footer-monogram">V <span>✦</span> Y</div>
        <p className="studio-footer-names">VIDHI &amp; YASH</p>
        <p className="studio-footer-meta">
          WEDNESDAY, 25 NOVEMBER 2026 · SHRI SHYAM FARM, GURUGRAM
        </p>
        <p className="studio-footer-families">
          Daughter of Smt. Babita &amp; Late Shri Rajesh Kumar · Son of Smt. Sumitra Devi &amp; Shri Tula Ram
        </p>
      </footer>
    </div>
  );
}

export default function App() {
  const [pathname, setPathname] = useState(
    window.location.pathname.toLowerCase().replace(/\/$/, '') || '/'
  );

  useEffect(() => {
    function pop() {
      setPathname(location.pathname.toLowerCase().replace(/\/$/, '') || '/');
    }
    window.addEventListener('popstate', pop);

    const handleLinkClick = (e) => {
      const anchor = e.target.closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href) return;
      if (['/', '/royal', '/minimal', '/floral'].includes(href)) {
        e.preventDefault();
        window.history.pushState({}, '', href);
        setPathname(href);
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    };
    document.addEventListener('click', handleLinkClick);

    return () => {
      window.removeEventListener('popstate', pop);
      document.removeEventListener('click', handleLinkClick);
    };
  }, []);

  useEffect(() => {
    document.title =
      pathname === '/royal'
        ? 'Vidhi & Yash · The Royal Film'
        : pathname === '/minimal'
        ? 'Vidhi & Yash · The Living Letter'
        : pathname === '/floral'
        ? 'Vidhi & Yash · The Enchanted Garden'
        : 'Vidhi & Yash · Three Cinematic Wedding Films';
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  const activeTheme =
    pathname === '/royal' ? 'royal' : pathname === '/minimal' ? 'minimal' : pathname === '/floral' ? 'floral' : 'royal';

  return (
    <AudioDirector defaultTheme={activeTheme}>
      <SmoothScroll>
        {pathname === '/royal' ? (
          <Royal />
        ) : pathname === '/minimal' ? (
          <Minimal />
        ) : pathname === '/floral' ? (
          <Floral />
        ) : (
          <StudioIndex />
        )}
      </SmoothScroll>
    </AudioDirector>
  );
}
