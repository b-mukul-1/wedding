import React, { useState } from 'react';
import { Flame, Sparkles, Check, Heart } from 'lucide-react';
import { useAudioEngine } from './AudioEngine.jsx';
import confetti from 'canvas-confetti';

const VOWS = [
  {
    step: '1st Vow',
    sanskrit: 'प्रथमं पदे',
    title: 'Nourishment & Health',
    promise: 'We promise to nourish each other’s life, dreams, health, and spirit with pure devotion.',
    icon: '🌱',
  },
  {
    step: '2nd Vow',
    sanskrit: 'द्वितीयं पदे',
    title: 'Strength & Courage',
    promise: 'Together, we will stand as an unbreakable anchor through all of life’s seasons.',
    icon: '🛡️',
  },
  {
    step: '3rd Vow',
    sanskrit: 'तृतीयं पदे',
    title: 'Prosperity & Wisdom',
    promise: 'We pledge to build a home grounded in wisdom, shared prosperity, and mutual respect.',
    icon: '✨',
  },
  {
    step: '4th Vow',
    sanskrit: 'चतुर्थं पदे',
    title: 'Joy & Music',
    promise: 'We vow to fill our days with laughter, warmth, spontaneous dance, and boundless joy.',
    icon: '🎶',
  },
  {
    step: '5th Vow',
    sanskrit: 'पञ्चमं पदे',
    title: 'Family & Harmony',
    promise: 'We honor the families who raised us and promise boundless love to our elders and kin.',
    icon: '🕊️',
  },
  {
    step: '6th Vow',
    sanskrit: 'षष्ठं पदे',
    title: 'Everlasting Devotion',
    promise: 'In every phase of life, across every tomorrow, we choose to stand side by side as one.',
    icon: '♾️',
  },
  {
    step: '7th Vow',
    sanskrit: 'सप्तमं पदे',
    title: 'Eternal Friendship',
    promise: 'Above all titles, we vow to be best friends, companions, and soulmates for eternity.',
    icon: '🤍',
  },
];

export default function InteractiveSevenVows({ litState, onToggleDiya, onLightAll }) {
  const { playDiyaIgnite, playConfetti } = useAudioEngine();
  const [activeTab, setActiveTab] = useState(0);

  const litCount = litState.filter(Boolean).length;
  const allLit = litCount === 7;

  const handleLight = (index) => {
    playDiyaIgnite();
    onToggleDiya(index);
    setActiveTab(index);

    if (litCount === 6 && !litState[index]) {
      // Just completed the 7th
      setTimeout(() => {
        playConfetti();
        confetti({
          particleCount: 75,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#ffd700', '#ffaa33', '#e056fd', '#ff7675'],
        });
      }, 300);
    }
  };

  const handleLightAll = () => {
    playDiyaIgnite();
    playConfetti();
    onLightAll();
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#ffd700', '#ffffff', '#ff9f43', '#ff6b81'],
    });
  };

  return (
    <div className="vows-interactive-section">
      <div className="vows-header">
        <span className="vows-kicker">✦ THE SACRED SEVEN STEPS · SAAT PHERE ✦</span>
        <h2 className="vows-title">
          Seven Sacred <em>Promises.</em>
        </h2>
        <p className="vows-desc">
          Around the sacred Agni fire, seven holy rounds bind two souls. Tap each lamp to ignite the flame and reveal our eternal promises.
        </p>

        <div className="vows-counter-bar">
          <div className="counter-pill">
            <Flame size={16} className={allLit ? 'flame-golden' : ''} />
            <span>
              {litCount} of 7 Vows Illuminated
            </span>
          </div>
          {!allLit && (
            <button type="button" className="btn-light-all" onClick={handleLightAll}>
              <Sparkles size={15} /> Light All Seven Lamps
            </button>
          )}
        </div>
      </div>

      {/* 7 Diya Lamp Selector Controls */}
      <div className="vows-lamps-selector" role="tablist">
        {VOWS.map((vow, i) => {
          const isLit = litState[i];
          const isSelected = activeTab === i;

          return (
            <button
              key={vow.step}
              type="button"
              role="tab"
              aria-selected={isSelected}
              className={`diya-lamp-btn ${isLit ? 'is-lit' : ''} ${isSelected ? 'is-selected' : ''}`}
              onClick={() => handleLight(i)}
            >
              <div className="diya-lamp-graphic">
                <span className={`lamp-flame ${isLit ? 'active' : ''}`} />
                <span className="lamp-brass-bowl" />
              </div>
              <span className="diya-step-num">{i + 1}</span>
              <span className="diya-step-name">{vow.title}</span>
            </button>
          );
        })}
      </div>

      {/* Active Vow Spotlight Card */}
      <div className="vow-spotlight-card">
        <div className="vow-card-glow" />
        <div className="vow-card-inner">
          <div className="vow-badge">
            <span>{VOWS[activeTab].sanskrit}</span>
            <span className="badge-dot">✦</span>
            <span>{VOWS[activeTab].step}</span>
          </div>

          <h3 className="vow-active-title">
            <span className="vow-icon">{VOWS[activeTab].icon}</span>
            {VOWS[activeTab].title}
          </h3>

          <p className="vow-active-promise">
            "{VOWS[activeTab].promise}"
          </p>

          <div className="vow-action-status">
            {litState[activeTab] ? (
              <span className="status-lit">
                <Check size={16} /> Blessed &amp; Illuminated
              </span>
            ) : (
              <button
                type="button"
                className="btn-ignite-active"
                onClick={() => handleLight(activeTab)}
              >
                <Flame size={16} /> Ignite This Lamp
              </button>
            )}
          </div>
        </div>
      </div>

      {allLit && (
        <div className="vows-completed-banner">
          <Heart size={18} className="heart-pulse" />
          <span>॥ सप्तपदे सप्त वचनानि सदा रक्षन्तु ॥ · With every step, our forever begins.</span>
        </div>
      )}
    </div>
  );
}
