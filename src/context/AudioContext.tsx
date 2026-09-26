import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

interface AudioContextType {
  isPlaying: boolean;
  togglePlay: () => void;
  play: () => void;
  pause: () => void;
  volume: number;
  setVolume: (v: number) => void;
  isMuted: boolean;
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;
  currentTime: number;
  setCurrentTime: (t: number) => void;
  totalDuration: number;
  trackTitle: string;
  artist: string;
  bpm: number;
  frequencyData: number[]; // 16 normalized values (0 to 1) for waveforms
  analyserRef: React.RefObject<AnalyserNode | null>;
  setAudioTrack: (url: string, title?: string, artist?: string) => void;
}

const AudioPlayerContext = createContext<AudioContextType | null>(null);

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
};

interface AudioProviderProps {
  children: React.ReactNode;
  onNotify?: (msg: string) => void;
}

export const AudioPlayerProvider: React.FC<AudioProviderProps> = ({ children, onNotify }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [totalDuration, setTotalDuration] = useState<number>(242);
  const [frequencyData, setFrequencyData] = useState<number[]>(new Array(24).fill(0.1));
  const [trackTitle, setTrackTitle] = useState<string>('Dream');
  const [artist, setArtist] = useState<string>('');
  const [audioSource, setAudioSource] = useState<string>('/Dream.mp3');

  const bpm = 140;

  // Real HTML5 Audio & Web Audio API Graph
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Initialize Audio Graph connected to HTML5 audio element
  const initAudioGraph = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio(audioSource);
      audio.crossOrigin = 'anonymous';
      audio.loop = true;
      audio.preload = 'auto';

      audio.addEventListener('loadedmetadata', () => {
        if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
          setTotalDuration(Math.floor(audio.duration));
        }
      });

      audio.addEventListener('timeupdate', () => {
        setCurrentTime(Math.floor(audio.currentTime));
      });

      audioRef.current = audio;
    }

    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.65;

      const masterGain = ctx.createGain();
      const effectiveVol = isMuted ? 0 : volume;
      masterGain.gain.setValueAtTime(effectiveVol, ctx.currentTime);

      try {
        if (audioRef.current && !sourceNodeRef.current) {
          const source = ctx.createMediaElementSource(audioRef.current);
          source.connect(analyser);
          analyser.connect(masterGain);
          masterGain.connect(ctx.destination);
          sourceNodeRef.current = source;
        }
      } catch (err) {
        console.warn('MediaElementSource error, using direct connection:', err);
      }

      audioCtxRef.current = ctx;
      analyserRef.current = analyser;
      gainNodeRef.current = masterGain;
    } else if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  }, [audioSource, isMuted, volume]);

  // Play / Pause controls
  const play = useCallback(() => {
    initAudioGraph();
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        if (onNotify) {
          onNotify(`Playing ${trackTitle}`);
        }
      }).catch((e) => {
        console.warn('Playback error:', e);
        setIsPlaying(true); // fall back to UI state
      });
    } else {
      setIsPlaying(true);
    }
  }, [initAudioGraph, onNotify, trackTitle]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, pause, play]);

  // Volume & Mute synchronization
  useEffect(() => {
    const effectiveVol = isMuted ? 0 : volume;
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setTargetAtTime(effectiveVol, audioCtxRef.current.currentTime, 0.04);
    }
    if (audioRef.current) {
      audioRef.current.volume = effectiveVol;
    }
  }, [volume, isMuted]);

  // Seeking
  const handleSetCurrentTime = (newTime: number) => {
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  // Switch audio track dynamically
  const setAudioTrack = useCallback((url: string, newTitle?: string, newArtist?: string) => {
    setAudioSource(url);
    if (newTitle) setTrackTitle(newTitle);
    if (newArtist) setArtist(newArtist);

    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(console.warn);
      }
    }
  }, [isPlaying]);

  // Real-time frequency data loop from analyser node with perceptual weighting
  useEffect(() => {
    let dummyPhase = 0;
    const updateFrequency = () => {
      if (analyserRef.current && isPlaying) {
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);

        const sampleCount = 24;
        const sampled: number[] = [];
        const fMin = 45;
        const fMax = 7800;
        const nyquist = 22050;

        for (let i = 0; i < sampleCount; i++) {
          const lowF = fMin * Math.pow(fMax / fMin, i / sampleCount);
          const highF = fMin * Math.pow(fMax / fMin, (i + 1) / sampleCount);
          const bLow = Math.max(0, Math.floor((lowF / nyquist) * bufferLength));
          const bHigh = Math.min(bufferLength - 1, Math.ceil((highF / nyquist) * bufferLength));

          let sum = 0;
          let count = 0;
          let maxInBand = 0;
          for (let b = bLow; b <= bHigh; b++) {
            sum += dataArray[b];
            if (dataArray[b] > maxInBand) maxInBand = dataArray[b];
            count++;
          }
          const rawAvg = count > 0 ? (sum / count) * 0.6 + maxInBand * 0.4 : 0;
          
          let val = 0.1;
          if (rawAvg > 8) {
            // Perceptual power-law with balanced progressive curve
            const norm = Math.pow(rawAvg / 255, 0.72);
            const balanceCurve = 1.0 + Math.sin((i / (sampleCount - 1)) * Math.PI) * 0.35 + (i / sampleCount) * 0.4;
            // Soft-saturation prevents bars from getting stuck at the ceiling or dying at the bottom
            val = Math.min(0.96, Math.max(0.12, Math.tanh(norm * balanceCurve * 1.45)));
          } else {
            // Organic harmonic wave so bars never freeze or sit dead
            const harmonic = Math.sin(dummyPhase * 2.2 + i * 0.42) * 0.28 + Math.cos(dummyPhase * 1.4 - i * 0.25) * 0.2 + 0.38;
            val = Math.min(0.85, Math.max(0.12, harmonic));
          }
          sampled.push(val);
        }
        setFrequencyData(sampled);
      } else if (isPlaying) {
        // Fallback rhythmic bounce with organic wave motion
        const sampleCount = 24;
        const sampled: number[] = [];
        for (let i = 0; i < sampleCount; i++) {
          const wave = Math.sin(dummyPhase * 2.2 + i * 0.38) * 0.32 + Math.cos(dummyPhase * 1.5 - i * 0.28) * 0.22 + 0.38;
          sampled.push(Math.min(0.88, Math.max(0.12, wave)));
        }
        setFrequencyData(sampled);
      } else {
        // Idle gentle breathing line
        const sampleCount = 24;
        const sampled: number[] = [];
        for (let i = 0; i < sampleCount; i++) {
          sampled.push(0.08 + Math.sin(dummyPhase * 0.2 + i * 0.3) * 0.03);
        }
        setFrequencyData(sampled);
      }
      dummyPhase += 0.12;
      animFrameRef.current = requestAnimationFrame(updateFrequency);
    };

    animFrameRef.current = requestAnimationFrame(updateFrequency);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying]);

  return (
    <AudioPlayerContext.Provider
      value={{
        isPlaying,
        togglePlay,
        play,
        pause,
        volume,
        setVolume,
        isMuted,
        setIsMuted,
        currentTime,
        setCurrentTime: handleSetCurrentTime,
        totalDuration,
        trackTitle,
        artist,
        bpm,
        frequencyData,
        analyserRef,
        setAudioTrack,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};
