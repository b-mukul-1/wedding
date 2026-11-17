import React, { useState, useEffect } from 'react';
import { WEDDING, calendarFile } from '../data.js';
import { Calendar, MapPin, Share2, Copy, Check, Navigation, Sparkles, Heart, Flower2 } from 'lucide-react';
import { useAudioEngine } from './AudioEngine.jsx';
import confetti from 'canvas-confetti';

export default function GrandCelebrationHub() {
  const { playConfetti, playChime } = useAudioEngine();
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    function updateCountdown() {
      const target = new Date(WEDDING.start).getTime();
      const now = Date.now();
      const diff = Math.max(0, target - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    }

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleDownloadIcs = () => {
    playChime(880);
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

  const handleCopyAddress = async () => {
    playChime(660);
    const fullAddress = `${WEDDING.venue}, ${WEDDING.address}`;
    try {
      await navigator.clipboard.writeText(fullAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {}
  };

  const handleShare = async () => {
    playChime(784);
    const shareData = {
      title: 'Wedding of Vidhi & Yash',
      text: `You are cordially invited to celebrate the wedding of Vidhi & Yash on 25 November 2026 at Shri Shyam Farm, Gurugram.`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      }
    } catch {}
  };

  const handleShowerBlessings = () => {
    playConfetti();
    confetti({
      particleCount: 120,
      spread: 110,
      origin: { y: 0.7 },
      colors: ['#ffd700', '#ff9f43', '#e84118', '#f368e0', '#ffffff'],
    });
  };

  return (
    <div className="grand-hub-section">
      <div className="grand-hub-header">
        <span className="hub-kicker">✦ SAVE THE AUSPICIOUS DATE ✦</span>
        <h2 className="hub-title">
          Wednesday, 25 November <em>2026</em>
        </h2>
        <p className="hub-subtitle">
          Under the canopy of starlight, we invite you to stand beside us as our two families unite in sacred celebration.
        </p>

        {/* Live Countdown Clock */}
        <div className="countdown-clock-grid">
          <div className="clock-cell">
            <span className="clock-val">{timeLeft.days}</span>
            <span className="clock-label">DAYS</span>
          </div>
          <div className="clock-separator">:</div>
          <div className="clock-cell">
            <span className="clock-val">{String(timeLeft.hours).padStart(2, '0')}</span>
            <span className="clock-label">HOURS</span>
          </div>
          <div className="clock-separator">:</div>
          <div className="clock-cell">
            <span className="clock-val">{String(timeLeft.minutes).padStart(2, '0')}</span>
            <span className="clock-label">MINUTES</span>
          </div>
          <div className="clock-separator">:</div>
          <div className="clock-cell">
            <span className="clock-val">{String(timeLeft.seconds).padStart(2, '0')}</span>
            <span className="clock-label">SECONDS</span>
          </div>
        </div>
      </div>

      {/* Royal Venue Card & Action Matrix */}
      <div className="grand-venue-card">
        <div className="venue-card-border" />
        <div className="venue-content">
          <div className="venue-badge">
            <MapPin size={16} /> THE WEDDING VENUE
          </div>
          <h3 className="venue-name">{WEDDING.venue}</h3>
          <p className="venue-address">{WEDDING.address}</p>

          <div className="venue-actions-row">
            <a
              href={WEDDING.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-action-primary"
            >
              <Navigation size={17} />
              <span>GET GOOGLE MAPS DIRECTIONS</span>
            </a>

            <button type="button" className="btn-action-secondary" onClick={handleDownloadIcs}>
              <Calendar size={17} />
              <span>ADD TO CALENDAR (.ICS)</span>
            </button>

            <button type="button" className="btn-action-secondary" onClick={handleShare}>
              <Share2 size={17} />
              <span>SHARE INVITATION</span>
            </button>

            <button type="button" className="btn-action-secondary" onClick={handleCopyAddress}>
              {copied ? <Check size={17} /> : <Copy size={17} />}
              <span>{copied ? 'ADDRESS COPIED!' : 'COPY ADDRESS'}</span>
            </button>
          </div>

          <div className="venue-shower-blessing">
            <button type="button" className="btn-shower-blessing" onClick={handleShowerBlessings}>
              <Flower2 size={18} className="flower-spin" />
              <span>SHOWER GOLDEN BLESSINGS</span>
              <Sparkles size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
