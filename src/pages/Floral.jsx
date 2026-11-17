import React, { useRef, useState, useEffect } from 'react';
import { ArrowUpRight, Flower2, Heart, MapPin, Sparkles, Navigation, Calendar, Share2, Copy, Check } from 'lucide-react';
import { CHAPTERS, WEDDING, calendarFile } from '../data.js';
import { StoryChrome, useStoryScene, useStoryProgress, PetalField, MagicParticles, FlowerBurst, ScrollHint, Eyebrow } from '../components/StoryUtils.jsx';
import { GaneshaMark, LotusMark, ActionBar, Countdown } from '../components/Details.jsx';
import { useSound } from '../components/AudioDirector.jsx';
import PetalCinema from '../components/PetalCinema.jsx';
import confetti from 'canvas-confetti';

const ids = CHAPTERS.floral.map((_, i) => `floral-${String(i + 1).padStart(2, '0')}`);

/**
 * Realistic Dual-Wing Monarch Butterfly with organic flapping physics.
 */
function MonarchButterfly({ n = 1, style = {} }) {
  return (
    <div className={`monarch-butterfly-unit butterfly-${n}`} style={style} aria-hidden="true">
      <div className="butterfly-body" />
      <div className="wing wing-left" />
      <div className="wing wing-right" />
    </div>
  );
}

export default function Floral() {
  const root = useRef(null);
  const [burst, setBurst] = useState(0);
  const [copied, setCopied] = useState(false);
  const { play, setTrackTheme } = useSound();
  const active = useStoryProgress(root, CHAPTERS.floral);

  useEffect(() => {
    setTrackTheme('floral');
  }, [setTrackTheme]);

  useStoryScene(root, ({ gsap, ScrollTrigger, reduced }) => {
    if (reduced) return;

    // 1. Hero Reveal
    gsap.fromTo(
      '.floral-intro-copy',
      { autoAlpha: 0, y: 70, filter: 'blur(10px)' },
      { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 1.8, delay: 0.35, ease: 'power3.out' }
    );

    // 2. Parallax Scenery
    gsap.fromTo(
      '.floral-hero-image',
      { scale: 1.18, yPercent: -4 },
      { scale: 1, yPercent: 4, ease: 'none', scrollTrigger: { trigger: '#floral-01', start: 'top top', end: 'bottom bottom', scrub: 1 } }
    );

    // 3. Staggered section reveals
    gsap.utils.toArray('.floral-section').forEach((section, i) => {
      if (i === 0) return;
      const reveals = section.querySelectorAll('.floral-reveal');
      if (reveals.length) {
        gsap.fromTo(
          reveals,
          { y: 65, autoAlpha: 0, filter: 'blur(8px)' },
          { y: 0, autoAlpha: 1, filter: 'blur(0px)', stagger: 0.16, duration: 1.3, ease: 'power3.out', scrollTrigger: { trigger: section, start: 'top 70%', toggleActions: 'play none none reverse' } }
        );
      }
    });

    // 4. Couple Portraits entrance
    gsap.fromTo(
      '.floral-portrait-bride-wrap',
      { scale: 0.85, x: -140, autoAlpha: 0 },
      { scale: 1, x: 0, autoAlpha: 1, scrollTrigger: { trigger: '#floral-05', start: 'top 80%', end: '60% 45%', scrub: 1 } }
    );
    gsap.fromTo(
      '.floral-portrait-groom-wrap',
      { scale: 0.85, x: 140, autoAlpha: 0 },
      { scale: 1, x: 0, autoAlpha: 1, scrollTrigger: { trigger: '#floral-06', start: 'top 80%', end: '60% 45%', scrub: 1 } }
    );

    // 5. Union stage
    gsap.fromTo(
      '.floral-union-bride',
      { xPercent: -90, rotate: -6 },
      { xPercent: 12, rotate: 0, scrollTrigger: { trigger: '#floral-07', start: 'top 85%', end: '65% 45%', scrub: 1 } }
    );
    gsap.fromTo(
      '.floral-union-groom',
      { xPercent: 90, rotate: 6 },
      { xPercent: -12, rotate: 0, scrollTrigger: { trigger: '#floral-07', start: 'top 85%', end: '65% 45%', scrub: 1 } }
    );

    // 6. Number 25
    gsap.fromTo(
      '.floral-number-25',
      { scale: 1.6, rotate: -10, autoAlpha: 0.2 },
      { scale: 1, rotate: 0, autoAlpha: 1, scrollTrigger: { trigger: '#floral-10', start: 'top 80%', end: '65% center', scrub: 1 } }
    );
  }, []);

  const handleBless = () => {
    setBurst((x) => x + 1);
    play('bell', 0.35);
    confetti({
      particleCount: 110,
      spread: 95,
      origin: { y: 0.65 },
      colors: ['#ff9ff3', '#feca57', '#ff6b6b', '#48dbfb', '#1dd1a1'],
    });
  };

  const handleDownloadIcs = () => {
    play('bell', 0.3);
    const blob = new Blob([calendarFile()], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Vidhi-Yash-Wedding-25Nov2026.ics';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleCopy = async () => {
    play('bell', 0.2);
    try {
      await navigator.clipboard.writeText(`${WEDDING.venue}, ${WEDDING.address}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2800);
    } catch {}
  };

  return (
    <div className="floral-world" ref={root}>
      {/* Navigation Rail & Header */}
      <StoryChrome theme="floral" chapters={CHAPTERS.floral} active={active} chapterIds={ids} />

      <main>
        {/* CHAPTER 1: THE FIRST BLOOM */}
        <section className="floral-section floral-intro" id={ids[0]} data-chapter>
          <div className="floral-stage">
            <div className="floral-hero-image" />
            <div className="floral-sunbeam-rays" />
            <div className="floral-hero-shade" />

            <PetalCinema density={1.4} />
            <MagicParticles count={36} />
            <MonarchButterfly n={1} />
            <MonarchButterfly n={2} />

            <div className="floral-intro-copy floral-hero-copy">
              <div className="floral-ganesh">
                <GaneshaMark size={58} />
                <span>॥ श्री गणेशाय नमः ॥</span>
              </div>
              <p className="floral-overline">THE WEDDING CELEBRATION OF</p>
              <h1 className="floral-title">Vidhi <span>&amp;</span> Yash</h1>
              <p className="floral-subtitle">Step into an enchanted garden where love is in eternal bloom.</p>
              <div className="floral-hero-line">
                <span />✻<span />
              </div>
              <div className="floral-date-badge">WEDNESDAY, 25 NOVEMBER 2026</div>
            </div>

            <ScrollHint text="SCROLL INTO OUR GARDEN" />
          </div>
        </section>

        {/* CHAPTER 2: MORNING LIGHT */}
        <section className="floral-section floral-morning" id={ids[1]} data-chapter>
          <div className="floral-stage">
            <div className="floral-morning-sun" />
            <div className="floral-meadow" />
            <MonarchButterfly n={3} />

            <div className="floral-reveal floral-morning-copy">
              <span className="floral-minilabel">01 · MORNING SUNRISE</span>
              <p className="floral-story-marker">✦</p>
              <h2>A little bit of magic.<br /><em>A lifetime of love.</em></h2>
              <p>Every beautiful story begins with an auspicious blessing and a heart filled with endless hope.</p>
              <GaneshaMark size={84} />
              <p className="floral-shloka">वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ · शुभ विवाह</p>
            </div>
            <PetalField count={20} mode="floral" />
          </div>
        </section>

        {/* CHAPTER 3: THE GARDEN PATH */}
        <section className="floral-section floral-path" id={ids[2]} data-chapter>
          <div className="floral-stage">
            <div className="floral-path-ground" />
            <div className="floral-path-arch" />
            <MonarchButterfly n={4} />

            <div className="floral-reveal floral-path-copy">
              <span className="floral-minilabel">02 · FOLLOW THE BLOSSOMS</span>
              <h2>Every petal<br /><em>leads to us.</em></h2>
              <p>Wander a little further down this enchanted pathway. There is something wonderful waiting just ahead.</p>
              <div className="botanical-divider">❀ ✿ ❀</div>
            </div>
          </div>
        </section>

        {/* CHAPTER 4: A THOUSAND PETALS */}
        <section className="floral-section floral-petal-rain" id={ids[3]} data-chapter>
          <div className="floral-stage">
            <div className="floral-arch-outline" />
            <PetalCinema density={2.2} />
            <MagicParticles count={32} />

            <div className="floral-reveal floral-petal-copy">
              <span className="floral-minilabel">03 · A SHOWER OF BLESSINGS</span>
              <h2>Let love<br /><em>rain down.</em></h2>
              <p>In the joyful company of those we cherish most, every fleeting moment turns into pure celebration.</p>
              <div className="floral-ornament">❀ ✿ ❀</div>
            </div>
          </div>
        </section>

        {/* CHAPTER 5: THE BRIDE */}
        <section className="floral-section floral-bride" id={ids[4]} data-chapter>
          <div className="floral-stage">
            <div className="floral-portrait-circle" />
            <div className="floral-portrait-bride floral-portrait-bride-wrap">
              <div className="wreath-halo" />
              <img src="/art/bride.webp" alt="Illustrated bride Vidhi in floral garden" />
            </div>

            <div className="floral-reveal floral-portrait-text">
              <span className="floral-minilabel">04 · MEET THE BRIDE</span>
              <h2>Beautiful <em>Vidhi.</em></h2>
              <div className="floral-lineage">
                <span>Daughter of</span>
                <strong>Smt. Babita</strong>
                <span>&amp; Late Shri Rajesh Kumar</span>
              </div>
              <p className="floral-portrait-sub">
                "Grace in every step, blooming with boundless joy."
              </p>
            </div>
          </div>
        </section>

        {/* CHAPTER 6: THE GROOM */}
        <section className="floral-section floral-groom" id={ids[5]} data-chapter>
          <div className="floral-stage">
            <div className="floral-portrait-circle" />
            <div className="floral-portrait-groom floral-portrait-groom-wrap">
              <div className="wreath-halo" />
              <img src="/art/groom.webp" alt="Illustrated groom Yash in floral garden" />
            </div>

            <div className="floral-reveal floral-portrait-text">
              <span className="floral-minilabel">05 · MEET THE GROOM</span>
              <h2>Wonderful <em>Yash.</em></h2>
              <div className="floral-lineage">
                <span>Son of</span>
                <strong>Smt. Sumitra Devi</strong>
                <span>&amp; Shri Tula Ram</span>
              </div>
              <p className="floral-portrait-sub">
                "Grounded in strength, ready for a lifetime of laughter."
              </p>
            </div>
          </div>
        </section>

        {/* CHAPTER 7: LOVE IN FULL BLOOM */}
        <section className="floral-section floral-union" id={ids[6]} data-chapter>
          <div className="floral-stage">
            <div className="floral-union-sun" />
            <div className="floral-couple-wrap">
              <div className="floral-union-bride floral-couple-bride">
                <img src="/art/bride.webp" alt="Vidhi" />
              </div>
              <div className="floral-union-groom floral-couple-groom">
                <img src="/art/groom.webp" alt="Yash" />
              </div>
            </div>

            <div className="floral-reveal floral-union-copy">
              <span className="floral-minilabel">06 · TWO HEARTS, ONE GARDEN</span>
              <h2>And suddenly,<br /><em>everything bloomed.</em></h2>
              <p className="union-sub">Two souls creating their own forever paradise.</p>
            </div>
            <PetalField count={28} mode="floral" />
          </div>
        </section>

        {/* CHAPTER 8: THE BLOOMING MANDAP */}
        <section className="floral-section floral-mandap-section" id={ids[7]} data-chapter>
          <div className="floral-stage">
            <div className="floral-mandap-background" />
            <div className="floral-reveal floral-mandap-copy">
              <span className="floral-minilabel">07 · THE SACRED BOTANICAL MANDAP</span>
              <h2>Growing toward <em>forever.</em></h2>
              <p>Under an open canopy of jasmine and marigolds, surrounded by the warmth of our loved ones.</p>
            </div>
          </div>
        </section>

        {/* CHAPTER 9: PARENTAL BLESSINGS */}
        <section className="floral-section floral-family" id={ids[8]} data-chapter>
          <div className="floral-stage">
            <div className="floral-reveal floral-family-heading">
              <span className="floral-minilabel">08 · ROOTED IN LOVE</span>
              <h2>With our families' <em>blessings.</em></h2>
            </div>

            <div className="floral-family-cards">
              <article className="floral-family-card">
                <span>THE BRIDE</span>
                <h3>Vidhi</h3>
                <p>
                  D/O Smt. Babita
                  <br />
                  &amp; Lt. Sh. Rajesh Kumar
                </p>
                <div className="card-botanical-tag">❀ ✿ ❀</div>
              </article>

              <div className="floral-family-bridge">✦</div>

              <article className="floral-family-card">
                <span>THE GROOM</span>
                <h3>Yash</h3>
                <p>
                  S/O Smt. Sumitra Devi
                  <br />
                  &amp; Sh. Tula Ram
                </p>
                <div className="card-botanical-tag">❀ ✿ ❀</div>
              </article>
            </div>

            <p className="floral-family-tail">Our greatest joy will be celebrating this sacred milestone beside you.</p>
          </div>
        </section>

        {/* CHAPTER 10: THE WEDDING DAY */}
        <section className="floral-section floral-wedding-day" id={ids[9]} data-chapter>
          <div className="floral-stage">
            <div className="floral-date-orbit" />
            <div className="floral-number-25">25</div>
            <div className="floral-reveal floral-day-copy">
              <span className="floral-minilabel">09 · SAVE THE DATE</span>
              <h2>November <em>2026</em></h2>
              <p>Wednesday · An auspicious day of union and celebration.</p>
              <Countdown />
            </div>
            <PetalField count={28} mode="floral" />
          </div>
        </section>

        {/* CHAPTER 11: THE RESORT VENUE */}
        <section className="floral-section floral-venue" id={ids[10]} data-chapter>
          <div className="floral-stage">
            <div className="floral-venue-image" />
            <div className="floral-venue-gradient" />
            <MagicParticles count={24} />

            <div className="floral-reveal floral-venue-copy">
              <span className="floral-minilabel">10 · MEET US HERE</span>
              <h2>Come celebrate <em>our forever.</em></h2>
              <p className="floral-venue-date">WEDNESDAY · 25 NOVEMBER 2026</p>
              <h3>{WEDDING.venue}</h3>
              <p className="floral-venue-address">{WEDDING.address}</p>

              <div className="floral-actions-grid">
                <a href={WEDDING.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-floral-primary">
                  <Navigation size={16} /> GOOGLE MAPS DIRECTIONS <ArrowUpRight size={15} />
                </a>
                <button type="button" onClick={handleDownloadIcs} className="btn-floral-secondary">
                  <Calendar size={16} /> ADD TO CALENDAR (.ICS)
                </button>
                <button type="button" onClick={handleCopy} className="btn-floral-secondary">
                  {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? 'COPIED!' : 'COPY ADDRESS'}
                </button>
              </div>

              <button type="button" className="floral-bless-button" onClick={handleBless}>
                <Flower2 size={18} className="flower-spin" /> SHOWER BOTANICAL BLESSINGS
              </button>
            </div>

            <FlowerBurst trigger={burst} color="#ff9ff3" />
          </div>
        </section>
      </main>

      <footer className="floral-footer">
        <span>❀</span> Vidhi &amp; Yash <span>❀</span>
        <small>WITH ALL OUR LOVE · 25.11.2026</small>
        <a href="/">EXPLORE OTHER STORIES <ArrowUpRight size={15} /></a>
      </footer>
    </div>
  );
}
