import React, { useRef, useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDown, Mail, Heart, Flower2, MapPin, Sparkles, Check, Calendar, Share2, Copy } from 'lucide-react';
import { CHAPTERS, WEDDING, calendarFile, daysToWedding } from '../data.js';
import { StoryChrome, useStoryScene, useStoryProgress, ScrollHint, Eyebrow, FlowerBurst } from '../components/StoryUtils.jsx';
import { GaneshaMark, LotusMark, ActionBar, Countdown } from '../components/Details.jsx';
import { useSound } from '../components/AudioDirector.jsx';
import confetti from 'canvas-confetti';

const ids = CHAPTERS.minimal.map((_, i) => `letter-${String(i + 1).padStart(2, '0')}`);

function Folio({ id, index, children, className = '' }) {
  return (
    <section id={id} data-chapter className={`letter-folio letter-folio-${index} ${className}`}>
      <div className="folio-watermark">VIDHI &amp; YASH · COUTURE INVITATION</div>
      <div className="letter-page-number">
        FOLIO {String(index + 1).padStart(2, '0')} <span>/ {CHAPTERS.minimal.length}</span>
      </div>
      <div className="folio-deckle-edge top" />
      <div className="folio-inner">{children}</div>
      <div className="folio-deckle-edge bottom" />
    </section>
  );
}

export default function Minimal() {
  const root = useRef(null);
  const [sealBroken, setSealBroken] = useState(false);
  const [burst, setBurst] = useState(0);
  const [copied, setCopied] = useState(false);
  const { play, setTrackTheme } = useSound();
  const active = useStoryProgress(root, CHAPTERS.minimal);

  useEffect(() => {
    setTrackTheme('minimal');
  }, [setTrackTheme]);

  useStoryScene(root, ({ gsap, ScrollTrigger, reduced }) => {
    if (reduced) return;

    // Grain texture parallax
    gsap.to('.letter-canvas-grain', {
      backgroundPosition: '-200px 300px',
      scrollTrigger: { trigger: '.letter-world', start: 'top top', end: 'bottom bottom', scrub: true },
    });

    // 1. Envelope Arrival
    gsap.fromTo(
      '.couture-envelope',
      { y: 140, rotate: -4, opacity: 0, scale: 0.92 },
      { y: 0, rotate: 0, opacity: 1, scale: 1, duration: 2.0, ease: 'power3.out', delay: 0.25 }
    );

    // 2. Wax Seal Entrance
    gsap.fromTo(
      '.wax-seal-3d',
      { scale: 0, rotate: -180 },
      { scale: 1, rotate: 0, duration: 1.4, delay: 0.9, ease: 'back.out(2)' }
    );

    // 3. Flap Opening on scroll
    gsap.fromTo(
      '.envelope-flap-3d',
      { rotateX: 0 },
      { rotateX: -175, transformOrigin: '50% 0%', ease: 'none', scrollTrigger: { trigger: '#letter-02', start: 'top 85%', end: 'bottom 20%', scrub: 1 } }
    );

    // 4. Folio Staggered Reveals
    gsap.utils.toArray('.letter-folio').forEach((el, i) => {
      if (i === 0) return;
      const targets = el.querySelectorAll('.letter-reveal');
      if (targets.length) {
        gsap.fromTo(
          targets,
          { y: 70, autoAlpha: 0, filter: 'blur(8px)' },
          { y: 0, autoAlpha: 1, filter: 'blur(0px)', stagger: 0.18, duration: 1.4, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 75%', toggleActions: 'play none none reverse' } }
        );
      }
    });

    // 5. Red Thread of Destiny
    gsap.fromTo(
      '.destiny-thread-svg path',
      { strokeDasharray: 2400, strokeDashoffset: 2400 },
      { strokeDashoffset: 0, scrollTrigger: { trigger: '#letter-05', start: 'top 70%', end: 'bottom 25%', scrub: 1.2 } }
    );

    // 6. Bride & Groom Editorial Images
    gsap.fromTo(
      '.editorial-portrait-bride',
      { scale: 1.15, yPercent: 15 },
      { scale: 1, yPercent: 0, scrollTrigger: { trigger: '#letter-05', start: 'top bottom', end: 'bottom 40%', scrub: 1 } }
    );
    gsap.fromTo(
      '.editorial-portrait-groom',
      { scale: 1.15, yPercent: 15 },
      { scale: 1, yPercent: 0, scrollTrigger: { trigger: '#letter-06', start: 'top bottom', end: 'bottom 40%', scrub: 1 } }
    );

    // 7. Large Number 25
    gsap.fromTo(
      '.editorial-giant-num',
      { scale: 1.6, opacity: 0.15 },
      { scale: 1, opacity: 1, scrollTrigger: { trigger: '#letter-08', start: 'top 85%', end: '70% 45%', scrub: 1 } }
    );
  }, []);

  const handleBreakSeal = () => {
    setSealBroken(true);
    play('bell', 0.4);
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.45 },
      colors: ['#a8203c', '#d4a359', '#fff3c4', '#6b1124'],
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

  const handleBlessing = () => {
    setBurst((v) => v + 1);
    play('bell', 0.4);
    confetti({
      particleCount: 90,
      spread: 85,
      origin: { y: 0.6 },
      colors: ['#e17055', '#d63031', '#ffd700', '#ffeaa7'],
    });
  };

  return (
    <div className="letter-world" ref={root}>
      {/* Parchment Grain Overlay */}
      <div className="letter-canvas-grain" aria-hidden="true" />

      {/* Navigation Chrome */}
      <StoryChrome theme="minimal" active={active} chapters={CHAPTERS.minimal} chapterIds={ids} />

      <main>
        {/* FOLIO 1: THE COUTURE ENVELOPE */}
        <Folio id={ids[0]} index={0} className="letter-first">
          <div className="letter-deck letter-reveal">
            <span className="deck-line" />
            <span className="deck-tag">A COUTURE EDITORIAL INVITATION</span>
            <span className="deck-line" />
          </div>

          <div className="letter-hero-type letter-reveal">
            <p className="letter-salutation">Dearest family &amp; friends,</p>
            <h1 className="letter-hero-title">
              Some stories are written in the stars.
              <br />
              <em>This one was written for you.</em>
            </h1>
          </div>

          {/* Luxury 3D Envelope & Wax Seal */}
          <div className="envelope-stage-container">
            <div className={`couture-envelope ${sealBroken ? 'seal-broken' : ''}`}>
              <div className="envelope-back" />
              <div className="envelope-address-plate">
                <span className="address-pre">EXCLUSIVELY ADDRESSED TO</span>
                <strong className="address-guest">SOMEONE VERY SPECIAL</strong>
                <span className="address-rsvp">YOU ARE CORDIALLY INVITED</span>
              </div>
              <div className="envelope-flap-3d" />

              {/* Realistic Oxblood & Gold Wax Seal */}
              <button
                type="button"
                className={`wax-seal-3d ${sealBroken ? 'broken' : ''}`}
                onClick={handleBreakSeal}
                title={sealBroken ? 'Seal Opened' : 'Click to break the wax seal'}
                aria-label="Break wedding invitation wax seal"
              >
                <div className="wax-rim" />
                <div className="wax-center">
                  <span className="wax-monogram">V<span>✦</span>Y</span>
                  <span className="wax-date">2026</span>
                </div>
                {!sealBroken && <span className="seal-tap-hint">TAP TO UNSEAL</span>}
              </button>
            </div>
          </div>

          <ScrollHint text="SCROLL TO UNFOLD THE LETTER" />
        </Folio>

        {/* FOLIO 2: THE AUSPICIOUS BLESSING */}
        <Folio id={ids[1]} index={1} className="letter-seal-scene">
          <div className="sacred-parchment-sheet letter-reveal">
            <div className="sheet-flourish">✦ ✧ ✦</div>
            <GaneshaMark size={105} />
            <p className="sheet-shloka">॥ श्री गणेशाय नमः ॥</p>
            <h2 className="sheet-heading">
              With the grace<br />of the divine.
            </h2>
            <p className="sheet-text">
              May our new beginning be illuminated by wisdom, eternal togetherness, and the unconditional love of our elders.
            </p>
            <div className="sheet-seal-stamp">V &amp; Y · WEDNESDAY · 25.11.2026</div>
          </div>
        </Folio>

        {/* FOLIO 3: THE PERSONAL INVITATION */}
        <Folio id={ids[2]} index={2} className="letter-intro-scene">
          <span className="letter-decor-initial" aria-hidden="true">&amp;</span>
          <div className="letter-intro-grid">
            <div className="letter-intro-roman">I.</div>
            <div className="letter-reveal">
              <span className="letter-mini-label">A HEARTFELT REQUEST</span>
              <h2 className="editorial-h2">
                We request the honor of<br />
                <em>your gracious presence.</em>
              </h2>
              <p className="editorial-lead">
                Two families come together to witness a sacred bond of love and friendship. Our celebration would be incomplete without your blessings.
              </p>
              <div className="editorial-rule">
                <span className="rule-dot">✧</span>
              </div>
            </div>
          </div>
        </Folio>

        {/* FOLIO 4: THE NAMES */}
        <Folio id={ids[3]} index={3} className="letter-name-scene">
          <p className="letter-reveal letter-name-kicker">THE WEDDING CELEBRATION OF</p>
          <div className="letter-giant-name letter-reveal">
            <span className="letter-word name-v">Vidhi</span>
            <span className="letter-amp">&amp;</span>
            <span className="letter-word name-y">Yash</span>
          </div>
          <div className="letter-reveal letter-name-caption">
            An eternal chapter, written hand in hand.
            <span>WEDNESDAY, 25 NOVEMBER 2026 · GURUGRAM</span>
          </div>
        </Folio>

        {/* FOLIO 5: THE BRIDE'S PORTRAIT */}
        <Folio id={ids[4]} index={4} className="letter-bride-scene">
          <div className="editorial-figure-card letter-figure-bride">
            <div className="figure-mat-border">
              <img
                className="editorial-portrait-bride"
                src="/art/bride-editorial.webp"
                alt="Portrait illustration of Vidhi, the bride"
              />
            </div>
            <span className="figure-caption-tag">PLATE NO. 01 — THE BRIDE</span>
          </div>

          <div className="letter-figure-caption letter-reveal">
            <span className="letter-mini-label">THE FIRST PORTRAIT</span>
            <h2 className="editorial-name">Our <em>Vidhi.</em></h2>
            <div className="editorial-lineage">
              <span>Daughter of</span>
              <strong>Smt. Babita</strong>
              <span>&amp; Late Shri Rajesh Kumar</span>
            </div>
            <p className="editorial-quote">
              "Radiant with hope, gentle with grace, stepping toward her forever."
            </p>

            {/* Sacred Red Thread of Destiny */}
            <div className="destiny-thread-svg" aria-hidden="true">
              <svg viewBox="0 0 500 240">
                <path d="M-30 90C180 -70 160 260 340 110S630 180 530 40" fill="none" stroke="#a8203c" strokeWidth="2.5" />
              </svg>
            </div>
          </div>
        </Folio>

        {/* FOLIO 6: THE GROOM'S PORTRAIT */}
        <Folio id={ids[5]} index={5} className="letter-groom-scene">
          <div className="letter-figure-caption letter-reveal">
            <span className="letter-mini-label">THE SECOND PORTRAIT</span>
            <h2 className="editorial-name">Our <em>Yash.</em></h2>
            <div className="editorial-lineage">
              <span>Son of</span>
              <strong>Smt. Sumitra Devi</strong>
              <span>&amp; Shri Tula Ram</span>
            </div>
            <p className="editorial-quote">
              "Grounded in warmth, guided by love, welcoming his other half."
            </p>
            <div className="editorial-signature">with love &amp; respect, from our families</div>
          </div>

          <div className="editorial-figure-card letter-figure-groom">
            <div className="figure-mat-border">
              <img
                className="editorial-portrait-groom"
                src="/art/groom-editorial.webp"
                alt="Portrait illustration of Yash, the groom"
              />
            </div>
            <span className="figure-caption-tag">PLATE NO. 02 — THE GROOM</span>
          </div>
        </Folio>

        {/* FOLIO 7: THE FAMILIES */}
        <Folio id={ids[6]} index={6} className="letter-families">
          <div className="letter-families-top letter-reveal">
            <span className="letter-mini-label">OUR SACRED FOUNDATION</span>
            <h2 className="editorial-h2">Two families, <em>one home.</em></h2>
          </div>

          <div className="letter-family-strip">
            <article className="family-box">
              <span className="box-role">THE BRIDE'S FAMILY</span>
              <h3 className="box-name">Vidhi</h3>
              <p className="box-parents">
                D/O Smt. Babita
                <br />
                &amp; Lt. Sh. Rajesh Kumar
              </p>
            </article>

            <div className="family-strip-seal">
              <span>✦</span>
            </div>

            <article className="family-box">
              <span className="box-role">THE GROOM'S FAMILY</span>
              <h3 className="box-name">Yash</h3>
              <p className="box-parents">
                S/O Smt. Sumitra Devi
                <br />
                &amp; Sh. Tula Ram
              </p>
            </article>
          </div>

          <p className="letter-families-end letter-reveal">
            With their blessings and eternal love, our journey unfolds.
          </p>
        </Folio>

        {/* FOLIO 8: THE DATE */}
        <Folio id={ids[7]} index={7} className="letter-date-scene">
          <div className="letter-reveal letter-date-kicker">MARK YOUR CALENDAR</div>
          <div className="editorial-giant-num">25</div>
          <div className="letter-date-description letter-reveal">
            <span className="weekday-text">WEDNESDAY</span>
            <h2 className="month-text">November <em>2026.</em></h2>
            <p className="date-sub">A day to celebrate togetherness, joy, and new beginnings.</p>
            <Countdown />
          </div>
        </Folio>

        {/* FOLIO 9: THE PROMISE */}
        <Folio id={ids[8]} index={8} className="letter-promise-scene">
          <div className="letter-promise-top">
            <span className="letter-mini-label">AN INTIMATE NOTE</span>
            <span className="letter-promise-number">IX</span>
          </div>
          <div className="letter-promise-main letter-reveal">
            <h2>
              For the laughter.
              <br />
              For the lifelong memories.
              <br />
              <em>For the people who matter most.</em>
            </h2>
            <p>
              Your warmth, stories, and blessings will make our wedding day truly unforgettable.
            </p>
          </div>
          <div className="letter-small-star">✦</div>
        </Folio>

        {/* FOLIO 10: THE VENUE */}
        <Folio id={ids[9]} index={9} className="letter-venue-scene">
          <div className="letter-venue-head letter-reveal">
            <span className="letter-mini-label">THE RENDEZVOUS</span>
            <h2>Somewhere <em>beautiful.</em></h2>
          </div>

          <div className="letter-venue-drawing">
            <img src="/art/palace-line.svg" alt="Line drawing of palace facade" />
          </div>

          <div className="letter-venue-info letter-reveal">
            <span className="venue-meta">WEDNESDAY, 25 NOVEMBER 2026</span>
            <h3 className="venue-place">{WEDDING.venue}</h3>
            <p className="venue-addr">{WEDDING.address}</p>

            <div className="editorial-venue-actions">
              <a href={WEDDING.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-couture-primary">
                <MapPin size={16} /> GOOGLE MAPS DIRECTIONS <ArrowUpRight size={15} />
              </a>
              <button type="button" onClick={handleDownloadIcs} className="btn-couture-secondary">
                <Calendar size={16} /> ADD TO CALENDAR (.ICS)
              </button>
              <button type="button" onClick={handleCopy} className="btn-couture-secondary">
                {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? 'ADDRESS COPIED' : 'COPY ADDRESS'}
              </button>
            </div>
          </div>
        </Folio>

        {/* FOLIO 11: FINAL PERSONAL NOTE & BLESSINGS */}
        <Folio id={ids[10]} index={10} className="letter-final-scene">
          <div className="letter-end-sheet letter-reveal">
            <div className="letter-end-stamp">
              <LotusMark size={90} />
            </div>
            <p className="letter-mini-label">WITH OUR WHOLE HEARTS</p>
            <h2>See you on <em>the 25th.</em></h2>
            <p className="closing-quote">
              Our favorite moments are the ones shared with the people who make life extraordinary.
            </p>
            <strong className="closing-couple">Vidhi <span>&amp;</span> Yash</strong>

            <button type="button" onClick={handleBlessing} className="letter-blessing-button">
              <Heart size={18} /> SEND YOUR LOVE &amp; BLESSINGS
            </button>
            <FlowerBurst trigger={burst} />
          </div>

          <a className="letter-replay" href="/">
            EXPLORE THE OTHER TWO INVITATIONS <ArrowUpRight size={15} />
          </a>
        </Folio>
      </main>
    </div>
  );
}
