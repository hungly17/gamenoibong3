import { useCallback, useRef } from 'react';

export interface GameAudioController {
  soundEnabled: boolean;
  toggleSound: () => void;
  playBallTouch: () => void;
  playTargetHover: () => void;
  playPairConnected: () => void;
  playGentleMiss: () => void;
  playHintChime: () => void;
  playStarEarned: (starIndex: number) => void;
  playLevelVictory: () => void;
  speakPraiseVi: (text: string) => void;
}

export function useAudio(
  soundEnabled: boolean,
  onToggleSound: () => void
): GameAudioController {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastHoverSoundAtRef = useRef<number>(0);
  const lastSpeechAtRef = useRef<number>(0);

  const ensureAudioContext = useCallback((): AudioContext | null => {
    if (!soundEnabled || typeof window === 'undefined') return null;
    const AudioCtx =
      window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;

    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }
    return audioCtxRef.current;
  }, [soundEnabled]);

  const playTone = useCallback(
    (
      freq: number,
      durationSec: number,
      type: OscillatorType = 'sine',
      maxGain: number = 0.14,
      delaySec: number = 0,
      endFreq?: number
    ) => {
      const ctx = ensureAudioContext();
      if (!ctx) return;

      const startTime = ctx.currentTime + delaySec;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);
      if (endFreq) {
        osc.frequency.exponentialRampToValueAtTime(endFreq, startTime + durationSec);
      }

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(maxGain, startTime + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.0008, startTime + durationSec);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + durationSec + 0.02);
    },
    [ensureAudioContext]
  );

  const playBallTouch = useCallback(() => {
    // Âm thanh bong bóng nhẹ nhàng khi bé chạm bóng
    playTone(440, 0.11, 'sine', 0.13, 0, 587.33);
  }, [playTone]);

  const playTargetHover = useCallback(() => {
    const now = performance.now();
    if (now - lastHoverSoundAtRef.current < 320) return;
    lastHoverSoundAtRef.current = now;
    playTone(659.25, 0.08, 'sine', 0.08, 0, 783.99);
  }, [playTone]);

  const playPairConnected = useCallback(() => {
    // Hợp âm vui tươi Đô - Mi - Sol - Đô cao
    playTone(523.25, 0.14, 'triangle', 0.15, 0);
    playTone(659.25, 0.14, 'triangle', 0.15, 0.07);
    playTone(783.99, 0.22, 'sine', 0.16, 0.14);
  }, [playTone]);

  const playGentleMiss = useCallback(() => {
    // Âm thanh rất nhẹ nhàng khi thả ra ngoài hoặc khác màu (không gây giật mình)
    playTone(330, 0.12, 'sine', 0.06, 0, 280);
  }, [playTone]);

  const playHintChime = useCallback(() => {
    playTone(587.33, 0.15, 'sine', 0.11, 0);
    playTone(880, 0.25, 'sine', 0.11, 0.1);
  }, [playTone]);

  const playStarEarned = useCallback(
    (starIndex: number) => {
      const notes = [587.33, 739.99, 880];
      const freq = notes[starIndex % notes.length];
      playTone(freq, 0.2, 'triangle', 0.14, starIndex * 0.16);
    },
    [playTone]
  );

  const playLevelVictory = useCallback(() => {
    // Giai điệu chiến thắng ấm áp, vui nhộn
    const melody = [
      { f: 523.25, d: 0.14, t: 0 },
      { f: 659.25, d: 0.14, t: 0.12 },
      { f: 783.99, d: 0.14, t: 0.24 },
      { f: 1046.5, d: 0.36, t: 0.36 }
    ];
    for (const note of melody) {
      playTone(note.f, note.d, 'triangle', 0.16, note.t);
    }
  }, [playTone]);

  const speakPraiseVi = useCallback(
    (text: string) => {
      if (!soundEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
        return;
      }
      const now = performance.now();
      if (now - lastSpeechAtRef.current < 3500) return;
      lastSpeechAtRef.current = now;

      try {
        const synth = window.speechSynthesis;
        const voices = synth.getVoices();
        const viVoice = voices.find((v) => v.lang.toLowerCase().includes('vi'));
        if (!viVoice) return; // Chỉ đọc nếu thiết bị có sẵn giọng đọc tiếng Việt chuẩn

        synth.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.voice = viVoice;
        utter.lang = 'vi-VN';
        utter.rate = 0.95;
        utter.pitch = 1.15;
        utter.volume = 0.75;
        synth.speak(utter);
      } catch {
        // Bỏ qua nếu trình duyệt không hỗ trợ giọng đọc
      }
    },
    [soundEnabled]
  );

  return {
    soundEnabled,
    toggleSound: onToggleSound,
    playBallTouch,
    playTargetHover,
    playPairConnected,
    playGentleMiss,
    playHintChime,
    playStarEarned,
    playLevelVictory,
    speakPraiseVi
  };
}
