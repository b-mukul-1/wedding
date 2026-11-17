import React, { useState } from 'react';
import { WEDDING } from '../data.js';
import { Sparkles, Heart, Crown, Award } from 'lucide-react';

export default function RoyalCoupleShowcase() {
  const [activePerson, setActivePerson] = useState('both'); // 'bride', 'groom', 'both'

  return (
    <div className="royal-couple-showcase-section">
      <div className="showcase-header">
        <span className="showcase-kicker">✦ TWO DESTINIES · ONE FOREVER ✦</span>
        <h2 className="showcase-title">
          The Bride <em>&amp;</em> The Groom
        </h2>
        <p className="showcase-subtitle">
          Two beautiful lives nurtured by the unconditional love of their families, now uniting to write the most magical chapter of their lives.
        </p>

        <div className="showcase-tabs">
          <button
            type="button"
            className={`tab-btn ${activePerson === 'both' ? 'active' : ''}`}
            onClick={() => setActivePerson('both')}
          >
            Together
          </button>
          <button
            type="button"
            className={`tab-btn ${activePerson === 'bride' ? 'active' : ''}`}
            onClick={() => setActivePerson('bride')}
          >
            The Bride (Vidhi)
          </button>
          <button
            type="button"
            className={`tab-btn ${activePerson === 'groom' ? 'active' : ''}`}
            onClick={() => setActivePerson('groom')}
          >
            The Groom (Yash)
          </button>
        </div>
      </div>

      <div className={`showcase-gallery mode-${activePerson}`}>
        {/* Bride Card */}
        <div className="royal-portrait-frame bride-frame">
          <div className="frame-arch-ornament">
            <span>✧ ✦ ✧</span>
          </div>
          <div className="frame-image-wrapper">
            <div className="frame-glow-backlight" />
            <img
              src="/art/bride.png"
              alt="Artistic portrait illustration of bride Vidhi in a royal lehenga"
              className="portrait-img"
              loading="lazy"
            />
            <div className="frame-vignette" />
          </div>

          <div className="frame-details">
            <div className="frame-role-tag">
              <Crown size={14} /> THE BRIDE
            </div>
            <h3 className="frame-name">Vidhi</h3>
            <div className="frame-family">
              <span className="family-relation">Daughter of</span>
              <strong className="family-parents">Smt. Babita</strong>
              <span className="family-and">&amp; Late Shri Rajesh Kumar</span>
            </div>
            <p className="frame-poetic-quote">
              "With grace in her footsteps and a heart full of warmth, ready to begin her forever."
            </p>
          </div>
        </div>

        {/* Center Interlocking Emblem */}
        <div className="showcase-center-emblem">
          <div className="center-ring-orbit">
            <span className="orbit-sparkle s1">✦</span>
            <span className="orbit-sparkle s2">✧</span>
          </div>
          <div className="center-monogram">
            V <span>&amp;</span> Y
          </div>
          <span className="center-date">25.11.2026</span>
        </div>

        {/* Groom Card */}
        <div className="royal-portrait-frame groom-frame">
          <div className="frame-arch-ornament">
            <span>✧ ✦ ✧</span>
          </div>
          <div className="frame-image-wrapper">
            <div className="frame-glow-backlight" />
            <img
              src="/art/groom.png"
              alt="Artistic portrait illustration of groom Yash in a royal sherwani"
              className="portrait-img"
              loading="lazy"
            />
            <div className="frame-vignette" />
          </div>

          <div className="frame-details">
            <div className="frame-role-tag">
              <Award size={14} /> THE GROOM
            </div>
            <h3 className="frame-name">Yash</h3>
            <div className="frame-family">
              <span className="family-relation">Son of</span>
              <strong className="family-parents">Smt. Sumitra Devi</strong>
              <span className="family-and">&amp; Shri Tula Ram</span>
            </div>
            <p className="frame-poetic-quote">
              "Guided by strength, wisdom, and an unwavering devotion to the one who holds his heart."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
