import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

export const TRACKS = {
  royal: {
    title: 'Raga Yaman on Sitar',
    src: '/audio/sitar.mp3',
    fallback: '/audio/sitar.ogg',
    mood: 'Majestic & Sacred',
  },
  minimal: {
    title: 'Bhairav Alap on Bansuri',
    src: '/audio/bansuri.mp3',
    fallback: '/audio/bansuri.ogg',
    mood: 'Intimate & Poetic',
  },
  floral: {
    title: 'Acoustic Classical Strings',
    src: '/audio/floral.mp3',
    fallback: '/audio/bansuri.mp3',
    mood: 'Romantic & Enchanting',
  },
};

const AudioContext = createContext({
  enabled: false,
  isPlaying: false,
  currentTheme: 'royal',
  currentTrack: TRACKS.royal,
  trackInfo: TRACKS.royal,
  toggle: () => {},
  toggleSound: () => {},
  setTrackTheme: () => {},
  setTheme: () => {},
  play: () => {},
  playChime: () => {},
  playDiyaIgnite: () => {},
  playLanternRelease: () => {},
  playConfetti: () => {},
});

export function AudioDirector({ children, defaultTheme = 'royal' }) {
  const [enabled, setEnabled] = useState(false);
  const [userMuted, setUserMuted] = useState(false);
  const [theme, setTheme] = useState(defaultTheme);
  const bgAudioRef = useRef(null);
  const fadeRef = useRef(null);

  // Initialize main background soundtrack audio element
  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audio.volume = 0.45;
    bgAudioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
      if (fadeRef.current) clearInterval(fadeRef.current);
    };
  }, []);

  // Update track when theme changes
  useEffect(() => {
    const track = TRACKS[theme] || TRACKS.royal;
    const audio = bgAudioRef.current;
    if (!audio) return;

    const wasPlaying = enabled;
    audio.src = track.src;
    audio.load();

    if (wasPlaying) {
      audio.play().catch(() => setEnabled(false));
    }
  }, [theme]);

  // Smooth play soundtrack function
  const playSoundtrack = useCallback(() => {
    const audio = bgAudioRef.current;
    if (!audio) return;

    const track = TRACKS[theme] || TRACKS.royal;
    if (!audio.src || !audio.src.includes(track.src.replace(/^\//, ''))) {
      audio.src = track.src;
    }

    audio.volume = 0.45;
    audio
      .play()
      .then(() => {
        setEnabled(true);
        setUserMuted(false);
      })
      .catch((e) => {
        // Handled silently if autoplay restricted
      });
  }, [theme]);

  const toggle = useCallback(() => {
    const audio = bgAudioRef.current;
    if (!audio) return;

    if (enabled) {
      // User explicitly requested mute
      setUserMuted(true);
      let vol = audio.volume;
      if (fadeRef.current) clearInterval(fadeRef.current);
      fadeRef.current = setInterval(() => {
        vol -= 0.05;
        if (vol <= 0) {
          clearInterval(fadeRef.current);
          audio.pause();
          setEnabled(false);
          audio.volume = 0.45;
        } else {
          audio.volume = Math.max(0, vol);
        }
      }, 40);
    } else {
      // User requested unmute
      setUserMuted(false);
      if (!audio.src) {
        const track = TRACKS[theme] || TRACKS.royal;
        audio.src = track.src;
      }
      audio.volume = 0.05;
      audio
        .play()
        .then(() => {
          setEnabled(true);
          let vol = 0.05;
          if (fadeRef.current) clearInterval(fadeRef.current);
          fadeRef.current = setInterval(() => {
            vol += 0.05;
            if (vol >= 0.45) {
              clearInterval(fadeRef.current);
              audio.volume = 0.45;
            } else {
              audio.volume = vol;
            }
          }, 50);
        })
        .catch((e) => {
          console.warn('Audio play blocked by browser policy:', e);
        });
    }
  }, [enabled, theme]);

  // On tapping anywhere on the screen: smoothly start the 3 new main soundtracks unless user explicitly muted!
  useEffect(() => {
    const handleTapAnywhere = (e) => {
      // Never interfere when tapping the explicit mute/unmute buttons
      if (e.target && e.target.closest && e.target.closest('.sound-button, .floating-audio-dock, .dock-toggle-btn')) {
        return;
      }
      if (!userMuted && !enabled) {
        playSoundtrack();
      }
    };

    window.addEventListener('pointerdown', handleTapAnywhere, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', handleTapAnywhere);
    };
  }, [enabled, userMuted, playSoundtrack]);

  // For deliberate interactions (lighting diyas, releasing lanterns, unsealing letter):
  // Ensure the authentic classical soundtrack is playing without any random bad sounds!
  const onInteraction = useCallback(() => {
    if (!userMuted && !enabled) {
      playSoundtrack();
    }
  }, [userMuted, enabled, playSoundtrack]);

  const currentTrack = TRACKS[theme] || TRACKS.royal;

  const value = {
    enabled,
    isPlaying: enabled,
    currentTheme: theme,
    currentTrack,
    trackInfo: currentTrack,
    toggle,
    toggleSound: toggle,
    setTrackTheme: setTheme,
    setTheme,
    play: onInteraction,
    playChime: onInteraction,
    playDiyaIgnite: onInteraction,
    playLanternRelease: onInteraction,
    playConfetti: onInteraction,
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
}

// Aliases for unified imports
export const AudioEngineProvider = AudioDirector;
export const useSound = () => useContext(AudioContext);
export const useAudioEngine = useSound;

/**
 * Standard Sound Button with equalizer wave animation.
 */
export function SoundButton({ className = '' }) {
  const { enabled, toggle, currentTrack } = useSound();

  return (
    <button
      type="button"
      className={`sound-button ${className} ${enabled ? 'is-playing' : ''}`}
      aria-label={enabled ? 'Mute soundtrack' : 'Play authentic Indian classical music'}
      aria-pressed={enabled}
      title={enabled ? `Mute ${currentTrack.title}` : `Play ${currentTrack.title}`}
      onClick={toggle}
    >
      {enabled ? <Music size={15} className="sound-icon-pulse" /> : <VolumeX size={15} />}
      <span className="sound-label">
        {enabled ? currentTrack.title : 'SOUND OFF'}
      </span>
      {enabled && (
        <span className="sound-eq-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      )}
    </button>
  );
}

/**
 * Floating Sound Dock featuring track name, mood, and dancing visualizer.
 */
export function FloatingSoundDock() {
  const { isPlaying, toggleSound, trackInfo } = useAudioEngine();

  return (
    <div className={`floating-audio-dock ${isPlaying ? 'is-active' : ''}`}>
      <button
        type="button"
        className="dock-toggle-btn"
        onClick={toggleSound}
        aria-label={isPlaying ? 'Mute soundtrack' : 'Play soundtrack'}
        title={isPlaying ? 'Mute music' : 'Play authentic Indian classical music'}
      >
        <div className="audio-dock-icon">
          {isPlaying ? <Music size={16} /> : <VolumeX size={16} />}
        </div>
        <div className="audio-dock-text">
          <span className="audio-label">
            {isPlaying ? trackInfo.title : 'PLAY SOUNDTRACK'}
          </span>
          <span className="audio-sub">
            {isPlaying ? trackInfo.mood : 'Authentic Indian Classical Music'}
          </span>
        </div>
        <div className={`audio-equalizer ${isPlaying ? 'is-dancing' : ''}`} aria-hidden="true">
          <span className="eq-bar bar-1" />
          <span className="eq-bar bar-2" />
          <span className="eq-bar bar-3" />
          <span className="eq-bar bar-4" />
        </div>
      </button>
    </div>
  );
}
