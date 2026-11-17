import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, ArrowDown, Flower2, Sparkles, Crown, Award, MapPin } from 'lucide-react';
import { CHAPTERS, WEDDING } from '../data.js';
import { StoryChrome, useStoryScene, useStoryProgress, PetalField, MagicParticles, FlowerBurst, ScrollHint, Eyebrow } from '../components/StoryUtils.jsx';
import { GaneshaMark, LotusMark, ActionBar, Countdown } from '../components/Details.jsx';
import { useSound } from '../components/AudioDirector.jsx';
import PetalCinema from '../components/PetalCinema.jsx';
import ThreeCinemaStage from '../components/ThreeCinemaStage.jsx';
import RoyalCoupleShowcase from '../components/RoyalCoupleShowcase.jsx';
import InteractiveSevenVows from '../components/InteractiveSevenVows.jsx';
import InteractiveLanternBlessings from '../components/InteractiveLanternBlessings.jsx';
import GrandCelebrationHub from '../components/GrandCelebrationHub.jsx';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const IDs = CHAPTERS.royal.map((_, i) => `royal-${String(i + 1).padStart(2, '0')}`);

export default function Royal() {
  const root = useRef(null);
  const stageRef = useRef(null);
  const [burst, setBurst] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [litDiyas, setLitDiyas] = useState([true, true, true, true, true, true, true]);
  const { play, setTrackTheme } = useSound();
  const active = useStoryProgress(root, CHAPTERS.royal);

  useEffect(() => {
    setTrackTheme('royal');
  }, [setTrackTheme]);

  // Track scroll progress for 3D camera
  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total <= 0) return;
      setScrollProgress(Math.min(1, Math.max(0, window.scrollY / total)));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useStoryScene(root, ({ gsap, ScrollTrigger, reduced }) => {
    if (reduced) return;

    // 1. Gates Parting
    gsap.fromTo(
      '.royal-gate-left',
      { xPercent: 0 },
      { xPercent: -108, duration: 2.3, ease: 'power3.inOut', delay: 0.3 }
    );
    gsap.fromTo(
      '.royal-gate-right',
      { xPercent: 0 },
      { xPercent: 108, duration: 2.3, ease: 'power3.inOut', delay: 0.3 }
    );

    // 2. Hero Copy Reveal
    gsap.fromTo(
      '.royal-hero-copy',
      { autoAlpha: 0, y: 60, filter: 'blur(10px)' },
      { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 1.6, delay: 0.9, ease: 'power3.out' }
    );

    // 3. Parallax Scenery
    gsap.to('.royal-palace-bg', {
      scale: 1.18,
      yPercent: 6,
      ease: 'none',
      scrollTrigger: { trigger: '#royal-01', start: 'top top', end: 'bottom bottom', scrub: 1 },
    });

    // 4. Section Reveals
    gsap.utils.toArray('.royal-scene').forEach((section, index) => {
      if (index === 0) return;
      const copy = section.querySelector('.royal-copy');
      if (copy) {
        gsap.fromTo(
          copy,
          { autoAlpha: 0, y: 70, filter: 'blur(8px)' },
          { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: section, start: 'top 65%', toggleActions: 'play none none reverse' } }
        );
      }
    });

    // 5. Greeters & Procession
    gsap.fromTo(
      '.royal-greeter.left',
      { xPercent: -50, rotate: -4 },
      { xPercent: 0, rotate: 0, ease: 'none', scrollTrigger: { trigger: '#royal-03', start: 'top bottom', end: '45% center', scrub: 1.1 } }
    );
    gsap.fromTo(
      '.royal-greeter.right',
      { xPercent: 50, rotate: 4 },
      { xPercent: 0, rotate: 0, ease: 'none', scrollTrigger: { trigger: '#royal-03', start: 'top bottom', end: '45% center', scrub: 1.1 } }
    );
    gsap.fromTo(
      '.royal-procession-elephant',
      { xPercent: -120 },
      { xPercent: 240, ease: 'none', scrollTrigger: { trigger: '#royal-04', start: 'top bottom', end: 'bottom top', scrub: 1.2 } }
    );
  }, []);

  const bless = () => {
    setBurst((n) => n + 1);
    play('sparkle', 0.35);
  };

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
    <div className="royal-world" ref={root}>
      {/* 3D WebGL Cinema Stage */}
      <ThreeCinemaStage ref={stageRef} scrollProgress={scrollProgress} litDiyas={litDiyas} />

      {/* Navigation Rail & Header */}
      <StoryChrome theme="royal" active={active} chapters={CHAPTERS.royal} chapterIds={IDs} />

      <main>
        {/* ACT 1: THE INVITATION */}
        <section className="royal-scene royal-hero" id={IDs[0]} data-chapter>
          <div className="royal-stage royal-hero-stage">
            <div className="royal-palace-bg" />
            <div className="royal-hero-shade" />

            {/* Palace Gates */}
            <div className="royal-gate royal-gate-left">
              <div className="gate-filagree" />
              <span>✦</span>
            </div>
            <div className="royal-gate royal-gate-right">
              <div className="gate-filagree" />
              <span>✦</span>
            </div>

            <MagicParticles count={40} />
            <PetalField count={22} />

            <div className="royal-hero-copy">
              <span className="royal-chapter-no">A ROYAL INVITATION · MMXXVI</span>
              <GaneshaMark size={70} />
              <p className="royal-sanskrit">॥ श्री गणेशाय नमः ॥</p>
              <div className="royal-hero-rule">✧ &nbsp; THE WEDDING CELEBRATION OF &nbsp; ✧</div>
              <h1 className="royal-script-title">
                Vidhi <em>&amp;</em> Yash
              </h1>
              <p className="royal-hero-intro">
                A celebration of eternal love, auspicious tradition, and everything that lasts forever.
              </p>
              <div className="royal-hero-date">
                WEDNESDAY <span>✹</span> 25 NOVEMBER 2026 <span>✹</span> GURUGRAM
              </div>
            </div>

            <ScrollHint text="SCROLL TO ENTER OUR WORLD" />
          </div>
        </section>

        {/* ACT 2: AN AUSPICIOUS BEGINNING */}
        <section className="royal-scene royal-blessing" id={IDs[1]} data-chapter>
          <div className="royal-stage">
            <div className="royal-sanctum-arches" />
            <div className="royal-sacred-icon">
              <GaneshaMark size={148} />
            </div>
            <div className="royal-copy royal-blessing-copy">
              <Eyebrow>CHAPTER II · AN AUSPICIOUS BEGINNING</Eyebrow>
              <h2>With divine blessings,<br /><em>our story begins.</em></h2>
              <p className="royal-devanagari">वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।<br />निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥</p>
              <p>May every step of this sacred journey be filled with happiness, light, and togetherness.</p>
            </div>
          </div>
        </section>

        {/* ACT 3: PHOOLON KI BAARISH */}
        <section className="royal-scene royal-welcome" id={IDs[2]} data-chapter>
          <div className="royal-stage">
            <div className="royal-greeter left">
              <img src="/art/attendant-rose.png" alt="Flower welcome attendant" />
              <div className="royal-petal-stream">✿ ❀ ✿ ✦</div>
            </div>
            <div className="royal-greeter right">
              <img src="/art/attendant-saffron.png" alt="Flower welcome attendant" />
              <div className="royal-petal-stream">✦ ✿ ❀ ✿</div>
            </div>
            <PetalCinema density={1.6} />

            <div className="royal-copy royal-welcome-copy">
              <Eyebrow>CHAPTER III · A WELCOME OF FLOWERS</Eyebrow>
              <h2>Phoolon ki<br /><em>baarish.</em></h2>
              <p>In our palace, every esteemed guest arrives beneath a celestial shower of fragrant rose blessings.</p>
              <div className="royal-hindi">आपका हार्दिक स्वागत है</div>
            </div>
          </div>
        </section>

        {/* ACT 4: ROYAL PROCESSION */}
        <section className="royal-scene royal-procession" id={IDs[3]} data-chapter>
          <div className="royal-stage">
            <div className="royal-night-horizon" />
            <div className="royal-procession-lights" />
            <div className="royal-procession-elephant">
              <img src="/art/royal-elephant.svg" alt="Ceremonial Royal Elephant" />
            </div>

            <div className="royal-copy royal-procession-copy">
              <Eyebrow>CHAPTER IV · THE NIGHT COMES ALIVE</Eyebrow>
              <h2>A thousand lights.<br /><em>One grand celebration.</em></h2>
              <p>Imagine the music of the shehnai, the laughter of family, and the warmth of everyone we love.</p>
            </div>
          </div>
        </section>

        {/* ACT 5: THE BRIDE */}
        <section className="royal-scene royal-bride-intro" id={IDs[4]} data-chapter>
          <div className="royal-stage">
            <div className="royal-portrait-arch" />
            <div className="royal-portrait-bride">
              <img src="/art/bride.png" alt="Bride Vidhi in royal maroon lehenga" />
            </div>

            <div className="royal-copy royal-portrait-copy bride">
              <Eyebrow>CHAPTER V · THE BRIDE</Eyebrow>
              <h2>Meet <em>Vidhi.</em></h2>
              <p className="royal-role">THE RADIANT BRIDE</p>
              <div className="royal-portrait-divider" />
              <p>
                Daughter of<br />
                <strong>Smt. Babita</strong><br />
                and Late Shri Rajesh Kumar
              </p>
              <span className="royal-portrait-sign">grace, joy &amp; a heart of gold</span>
            </div>
          </div>
        </section>

        {/* ACT 6: THE GROOM */}
        <section className="royal-scene royal-groom-intro" id={IDs[5]} data-chapter>
          <div className="royal-stage">
            <div className="royal-portrait-arch" />
            <div className="royal-portrait-groom">
              <img src="/art/groom.png" alt="Groom Yash in ivory sherwani" />
            </div>

            <div className="royal-copy royal-portrait-copy groom">
              <Eyebrow>CHAPTER VI · THE GROOM</Eyebrow>
              <h2>Meet <em>Yash.</em></h2>
              <p className="royal-role">THE CHARMING GROOM</p>
              <div className="royal-portrait-divider" />
              <p>
                Son of<br />
                <strong>Smt. Sumitra Devi</strong><br />
                and Shri Tula Ram
              </p>
              <span className="royal-portrait-sign">warmth, strength &amp; devotion</span>
            </div>
          </div>
        </section>

        {/* ACT 7: TWO DESTINIES */}
        <section className="royal-scene royal-union royal-interactive-scene" id={IDs[6]} data-chapter>
          <div className="royal-stage royal-interactive-stage">
            <div className="royal-couple-showcase-container">
              <RoyalCoupleShowcase />
            </div>
            <PetalField count={20} />
          </div>
        </section>

        {/* ACT 8: THE MANDAP */}
        <section className="royal-scene royal-mandap-scene" id={IDs[7]} data-chapter>
          <div className="royal-stage">
            <MagicParticles count={30} />
            <div className="royal-copy royal-mandap-copy">
              <Eyebrow>CHAPTER VIII · UNDER THE SACRED MANDAP</Eyebrow>
              <h2>Where forever<br /><em>takes its first step.</em></h2>
              <p>Beneath golden arches and sacred fire, surrounded by the warmth and blessings of our families.</p>
            </div>
          </div>
        </section>

        {/* ACT 9: SEVEN BLESSINGS (SAAT PHERE) */}
        <section className="royal-scene royal-vows royal-interactive-scene" id={IDs[8]} data-chapter>
          <div className="royal-stage royal-interactive-stage">
            <div className="royal-vows-wrapper">
              <InteractiveSevenVows
                litState={litDiyas}
                onToggleDiya={handleToggleDiya}
                onLightAll={handleLightAllDiyas}
              />
            </div>
          </div>
        </section>

        {/* ACT 10: THE GRAND DATE & LANTERNS */}
        <section className="royal-scene royal-date royal-interactive-scene" id={IDs[9]} data-chapter>
          <div className="royal-stage royal-interactive-stage">
            <div className="royal-lanterns-wrapper">
              <InteractiveLanternBlessings onSpawnLantern={handleSpawnGuestLantern} />
            </div>
          </div>
        </section>

        {/* ACT 11: YOUR ARRIVAL (VENUE & CTA) */}
        <section className="royal-scene royal-last royal-interactive-scene" id={IDs[10]} data-chapter>
          <div className="royal-stage royal-interactive-stage">
            <div className="royal-hub-wrapper">
              <GrandCelebrationHub />
            </div>
            <FlowerBurst trigger={burst} />
          </div>
        </section>
      </main>

      <footer className="royal-footer">
        VIDHI <span>✶</span> YASH
        <small>WITH LOVE, FROM OUR FAMILIES · 25.11.2026</small>
        <a href="/">EXPLORE OTHER EXPERIENCES <ArrowUpRight size={15} /></a>
      </footer>
    </div>
  );
}
