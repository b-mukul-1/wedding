import React, { useState, useEffect } from 'react';
import { Send, Sparkles, Heart, Feather, Flame, MessageCircleHeart } from 'lucide-react';
import { useAudioEngine } from './AudioEngine.jsx';
import confetti from 'canvas-confetti';

const QUICK_BLESSINGS = [
  'May your journey be filled with endless laughter & adventure! ✦',
  'Wishing you an eternity of peace, love, and understanding! ✻',
  'Two beautiful souls, one magnificent forever! ✧',
  'May every day feel like a fairytale wedding celebration! 💖',
  'Sada Saubhagyavati Bhava & warmest blessings to both families! 🌸',
];

const INITIAL_WISHES = [
  {
    id: 1,
    name: 'Smt. Babita & Rajesh Family',
    message: 'Our dearest Vidhi, may you step into this new home with infinite grace and laughter.',
    time: 'Blessing from Bride’s Family',
  },
  {
    id: 2,
    name: 'Smt. Sumitra Devi & Tula Ram',
    message: 'Dearest Yash & Vidhi, welcome to a lifetime of togetherness and shared dreams.',
    time: 'Blessing from Groom’s Family',
  },
  {
    id: 3,
    name: 'Aarav & Meera',
    message: 'To our favorite couple! Can’t wait to dance at Shri Shyam Farm on the 25th! 💃✨',
    time: 'Family & Friends',
  },
];

export default function InteractiveLanternBlessings({ onSpawnLantern }) {
  const { playLanternRelease, playConfetti } = useAudioEngine();
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [wishes, setWishes] = useState(() => {
    try {
      const saved = localStorage.getItem('vidhi_yash_wishes');
      return saved ? JSON.parse(saved) : INITIAL_WISHES;
    } catch {
      return INITIAL_WISHES;
    }
  });
  const [recentlySent, setRecentlySent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    // 1. Play celestial sound effect
    playLanternRelease();

    // 2. Trigger 3D Lantern in Three.js
    if (onSpawnLantern) {
      onSpawnLantern(name.trim(), message.trim());
    }

    // 3. Fire celebratory Confetti
    setTimeout(() => {
      playConfetti();
      confetti({
        particleCount: 110,
        spread: 100,
        origin: { y: 0.65 },
        colors: ['#ffd700', '#ff9f43', '#ffffff', '#ff6b81', '#f368e0'],
      });
    }, 250);

    // 4. Save to list
    const newWish = {
      id: Date.now(),
      name: name.trim(),
      message: message.trim(),
      time: 'Just now',
    };
    const updated = [newWish, ...wishes];
    setWishes(updated);
    try {
      localStorage.setItem('vidhi_yash_wishes', JSON.stringify(updated.slice(0, 30)));
    } catch {}

    setName('');
    setMessage('');
    setRecentlySent(true);
    setTimeout(() => setRecentlySent(false), 5500);
  };

  const pickQuick = (blessingText) => {
    setMessage(blessingText);
  };

  return (
    <div className="lanterns-interactive-section">
      <div className="lanterns-header">
        <span className="lanterns-kicker">✦ THE GALAXY OF BLESSINGS · TANGLED SKY LANTERNS ✦</span>
        <h2 className="lanterns-title">
          Release a Lantern <em>into the Stars.</em>
        </h2>
        <p className="lanterns-subtitle">
          In ancient folklore, each floating lantern carries a heartfelt wish into the heavens. Type your blessing below to release your personalized glowing lantern into the sky above Vidhi &amp; Yash.
        </p>
      </div>

      <div className="lanterns-compose-box">
        <form onSubmit={handleSubmit} className="lantern-form">
          <div className="form-group">
            <label htmlFor="guest-name">YOUR NAME / FAMILY</label>
            <input
              id="guest-name"
              type="text"
              placeholder="e.g. Priya &amp; Rohan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={45}
            />
          </div>

          <div className="form-group">
            <label htmlFor="guest-message">YOUR BLESSING FOR VIDHI &amp; YASH</label>
            <textarea
              id="guest-message"
              rows={3}
              placeholder="Write your blessing, congratulations or favorite memory..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              maxLength={240}
            />
          </div>

          {/* Quick pick chips */}
          <div className="quick-blessings-chips">
            <span className="chips-label">QUICK BLESSINGS:</span>
            {QUICK_BLESSINGS.map((text, idx) => (
              <button
                key={idx}
                type="button"
                className="chip-btn"
                onClick={() => pickQuick(text)}
              >
                {text}
              </button>
            ))}
          </div>

          <button type="submit" className="btn-release-lantern">
            <Flame size={18} className="flame-icon" />
            <span>RELEASE MY GLOWING LANTERN</span>
            <Sparkles size={18} />
          </button>
        </form>

        {recentlySent && (
          <div className="lantern-sent-toast" role="alert">
            <Sparkles size={20} className="toast-sparkle" />
            <div>
              <strong>Your lantern has ascended into the heavens!</strong>
              <p>Look up into the 3D starry sky to see your warm light joining the constellation.</p>
            </div>
          </div>
        )}
      </div>

      {/* Constellation of Wishes Wall */}
      <div className="wishes-wall">
        <div className="wishes-wall-title">
          <MessageCircleHeart size={18} />
          <span>THE CONSTELLATION OF GUEST WISHES ({wishes.length})</span>
        </div>

        <div className="wishes-grid">
          {wishes.map((w) => (
            <div key={w.id} className="wish-card">
              <div className="wish-glow" />
              <div className="wish-top">
                <span className="wish-sender">{w.name}</span>
                <span className="wish-time">{w.time}</span>
              </div>
              <p className="wish-quote">"{w.message}"</p>
              <div className="wish-lantern-tag">
                <span className="tag-flame">✹</span> Lantern in the Sky
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
