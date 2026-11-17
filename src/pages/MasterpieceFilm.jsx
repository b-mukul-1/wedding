import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { WEDDING, CHAPTERS } from '../data.js';
import ThreeCinemaStage from '../components/ThreeCinemaStage.jsx';
import SmoothScroll from '../components/SmoothScroll.jsx';
import FairyDustCursor from '../components/FairyDustCursor.jsx';
import { FloatingSoundDock, useAudioEngine } from '../components/AudioEngine.jsx';
import RoyalCoupleShowcase from '../components/RoyalCoupleShowcase.jsx';
import InteractiveSevenVows from '../components/InteractiveSevenVows.jsx';
import InteractiveLanternBlessings from '../components/InteractiveLanternBlessings.jsx';
import GrandCelebrationHub from '../components/GrandCelebrationHub.jsx';
import { GaneshaMark } from '../components/Details.jsx';
import { ChevronDown, ArrowUpRight, Sparkles, Heart } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function MasterpieceFilm() {
  const stageRef = useRef(null);
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [litDiyas, setLitDiyas] = useState([false, false, false, false, false, false, false]);
  const { playChime } = useAudioEngine();

  // Scroll Progress listener to feed ThreeCinemaStage camera
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll <= 0) return;
      const progress = Math.min(1, Math.max(0, window.scrollY / totalScroll));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // GSAP Entrance Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Gates Parting
      gsap.fromTo(
        '.palace-gate-left',
        { xPercent: 0 },
        { xPercent: -105, duration: 2.4, ease: 'power3.inOut', delay: 0.3 }
      );
      gsap.fromTo(
        '.palace-gate-right',
        { xPercent: 0 },
        { xPercent: 105, duration: 2.4, ease: 'power3.inOut', delay: 0.3 }
      );

      // 2. Hero Title Reveal
      gsap.fromTo(
        '.hero-cinematic-content',
        { autoAlpha: 0, y: 60, scale: 0.94 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 1.8, delay: 1.0, ease: 'power3.out' }
      );

      // 3. Scroll reveal for each act
      gsap.utils.toArray('.cinematic-act').forEach((act, idx) => {
        if (idx === 0) return;
        gsap.fromTo(
          act,
          { autoAlpha: 0, y: 70 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.4,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: act,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleToggleDiya = (index) => {
    setLitDiyas((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const handleLightAllDiyas = () => {
    setLitDiyas([true, true, true, true, true, true, true]);
  };

  const handleSpawnGuestLantern = (name, blessing) => {
    if (stageRef.current?.spawnGuestLantern) {
      stageRef.current.spawnGuestLantern(name, blessing);
    }
  };

  return (
    <SmoothScroll>
      <div className="masterpiece-film-root" ref={containerRef}>
        {/* Fairy Dust Cursor */}
        <FairyDustCursor />

        {/* Floating Ambient Sound Dock */}
        <FloatingSoundDock />

        {/* 3D WebGL Cinema Canvas */}
        <ThreeCinemaStage
          ref={stageRef}
          scrollProgress={scrollProgress}
          litDiyas={litDiyas}
        />

        {/* Cinematic Header Bar */}
        <header className="film-top-bar">
          <a href="/" className="film-brand">
            <span className="brand-monogram">V<span>✦</span>Y</span>
            <span className="brand-title">THE WEDDING CELEBRATION</span>
          </a>
          <div className="film-date-badge">25 NOVEMBER 2026</div>
          <a href="#blessings" className="btn-top-wish">
            <Sparkles size={14} /> SEND BLESSING
          </a>
        </header>

        {/* ========================================================
            ACT I: THE GOLDEN GATES & AUSPICIOUS INVOCATION
            ======================================================== */}
        <section className="cinematic-act act-hero" id="prologue">
          {/* Palace Gates */}
          <div className="palace-gate palace-gate-left" aria-hidden="true">
            <div className="gate-pattern" />
            <span className="gate-symbol">✦</span>
          </div>
          <div className="palace-gate palace-gate-right" aria-hidden="true">
            <div className="gate-pattern" />
            <span className="gate-symbol">✦</span>
          </div>

          <div className="hero-cinematic-content">
            <div className="sacred-ganesha-badge">
              <GaneshaMark size={68} />
              <p className="sanskrit-shloka">॥ श्री गणेशाय नमः ॥</p>
              <span className="shloka-sub">वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ · निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा</span>
            </div>

            <div className="hero-kicker-rule">
              <span className="kicker-line" />
              <span className="kicker-text">AN ETERNAL FAIRYTALE OF TWO SOULS</span>
              <span className="kicker-line" />
            </div>

            <h1 className="hero-royal-title">
              <span className="name-bride">Vidhi</span>
              <span className="name-amp">&amp;</span>
              <span className="name-groom">Yash</span>
            </h1>

            <p className="hero-cinematic-sub">
              Two hearts intertwined by destiny, blessed by tradition, and celebrated in eternal light.
            </p>

            <div className="hero-royal-date">
              <span>WEDNESDAY</span>
              <span className="date-dot">✹</span>
              <strong>25 NOVEMBER 2026</strong>
              <span className="date-dot">✹</span>
              <span>GURUGRAM</span>
            </div>

            <div className="hero-scroll-indicator">
              <span>SCROLL TO ENTER OUR WORLD</span>
              <ChevronDown size={18} className="bounce-arrow" />
            </div>
          </div>
        </section>

        {/* ========================================================
            ACT II: THE SACRED ROOTS & PARENTAL BLESSINGS
            ======================================================== */}
        <section className="cinematic-act act-heritage" id="families">
          <div className="act-container">
            <span className="section-eyebrow">✦ ACT II · WITH REVERENCE &amp; GRATITUDE ✦</span>
            <h2 className="section-title">
              Two Families. <em>One Bond.</em>
            </h2>
            <p className="section-subtitle">
              With the sacred blessings of our revered ancestors and parents, we invite you to witness our celebration of togetherness.
            </p>

            <div className="heritage-grid">
              <div className="heritage-card">
                <div className="heritage-card-glow" />
                <span className="heritage-side">BRIDE'S FAMILY</span>
                <h3 className="heritage-person">Vidhi</h3>
                <div className="heritage-divider">❖</div>
                <div className="heritage-parents">
                  <span className="role-lbl">Daughter of</span>
                  <strong>Smt. Babita</strong>
                  <span>&amp; Late Shri Rajesh Kumar</span>
                </div>
              </div>

              <div className="heritage-center-crest">
                <div className="crest-ring">
                  <span>✦</span>
                </div>
                <span className="crest-label">SHUBH VIVAH</span>
              </div>

              <div className="heritage-card">
                <div className="heritage-card-glow" />
                <span className="heritage-side">GROOM'S FAMILY</span>
                <h3 className="heritage-person">Yash</h3>
                <div className="heritage-divider">❖</div>
                <div className="heritage-parents">
                  <span className="role-lbl">Son of</span>
                  <strong>Smt. Sumitra Devi</strong>
                  <span>&amp; Shri Tula Ram</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            ACT III: THE ROYAL COUPLE SHOWCASE
            ======================================================== */}
        <section className="cinematic-act act-couple" id="couple">
          <div className="act-container">
            <RoyalCoupleShowcase />
          </div>
        </section>

        {/* ========================================================
            ACT IV: THE SACRED MANDAP & SEVEN SACRED PROMISES
            ======================================================== */}
        <section className="cinematic-act act-vows" id="vows">
          <div className="act-container">
            <InteractiveSevenVows
              litState={litDiyas}
              onToggleDiya={handleToggleDiya}
              onLightAll={handleLightAllDiyas}
            />
          </div>
        </section>

        {/* ========================================================
            ACT V: THE TANGLED SKY LANTERN BLESSING CEREMONY
            ======================================================== */}
        <section className="cinematic-act act-lanterns" id="blessings">
          <div className="act-container">
            <InteractiveLanternBlessings onSpawnLantern={handleSpawnGuestLantern} />
          </div>
        </section>

        {/* ========================================================
            ACT VI: THE AUSPICIOUS DATE & VENUE CELEBRATION HUB
            ======================================================== */}
        <section className="cinematic-act act-hub" id="venue">
          <div className="act-container">
            <GrandCelebrationHub />
          </div>
        </section>

        {/* ========================================================
            ACT VII: GRAND EPILOGUE & CREDITS
            ======================================================== */}
        <footer className="film-grand-footer">
          <div className="footer-monogram">V<span>✦</span>Y</div>
          <h2 className="footer-title">Vidhi <em>&amp;</em> Yash</h2>
          <p className="footer-closing">
            "Together is our favorite place to be."
          </p>
          <div className="footer-meta">
            <span>WEDNESDAY, 25 NOVEMBER 2026</span>
            <span>•</span>
            <span>SHRI SHYAM FARM, GURUGRAM</span>
          </div>

          <div className="footer-sub-links">
            <span className="style-note">DIRECTOR'S CUT SPECIAL EDITION</span>
            <div className="style-switch-row">
              <a href="/royal" className="link-pill">Royal Film</a>
              <a href="/minimal" className="link-pill">Living Letter</a>
              <a href="/floral" className="link-pill">Enchanted Garden</a>
              <a href="/" className="link-pill active">Director's Masterpiece</a>
            </div>
          </div>
        </footer>
      </div>
    </SmoothScroll>
  );
}
