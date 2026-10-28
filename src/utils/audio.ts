// Web Audio API 기반 오디오 합성 엔진 (외부 음원 파일 없이 순수 브라우저 오디오 생성)

class AudioManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private bgmGain: GainNode | null = null;
  private isBgmPlaying: boolean = false;
  private bgmIntervalId: number | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.bgmGain) {
      this.bgmGain.gain.value = this.isMuted ? 0 : 0.12;
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // 남강 물결 & 감성 펜타토닉 피아노 잔향 BGM
  public startBGM() {
    if (this.isBgmPlaying) return;
    this.initContext();
    if (!this.ctx) return;

    this.isBgmPlaying = true;
    this.bgmGain = this.ctx.createGain();
    this.bgmGain.gain.value = this.isMuted ? 0 : 0.12;
    this.bgmGain.connect(this.ctx.destination);

    // 잔잔한 남강 물결 핑크 노이즈 (저역 필터링)
    this.startWaterStream();

    // 펜타토닉 음계 (C minor pentatonic / 한국 전통 평조 느낌)
    const notes = [
      130.81, 146.83, 164.81, 196.00, 220.00, // C3, D3, E3, G3, A3
      261.63, 293.66, 329.63, 392.00, 440.00, // C4, D4, E4, G4, A4
      523.25, 587.33, 659.25                  // C5, D5, E5
    ];

    const playRandomChord = () => {
      if (!this.isBgmPlaying || !this.ctx || !this.bgmGain) return;
      
      const noteCount = 1 + Math.floor(Math.random() * 2);
      for (let i = 0; i < noteCount; i++) {
        const freq = notes[Math.floor(Math.random() * notes.length)];
        this.playPianoTone(freq, 2.8 + Math.random() * 2.0);
      }

      const nextDelay = 3500 + Math.random() * 4500;
      this.bgmIntervalId = window.setTimeout(playRandomChord, nextDelay);
    };

    playRandomChord();
  }

  private startWaterStream() {
    if (!this.ctx || !this.bgmGain) return;
    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 320; // 둔탁하고 평온한 남강 물결 소리

      const waterGain = this.ctx.createGain();
      waterGain.gain.value = 0.25;

      noise.connect(filter);
      filter.connect(waterGain);
      waterGain.connect(this.bgmGain);
      noise.start();
    } catch {
      // 오디오 컨텍스트 제한 시 조용히 무시
    }
  }

  private playPianoTone(freq: number, duration: number) {
    if (!this.ctx || !this.bgmGain || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    // 피아노 건반 타격 및 남강 잔향 엔벨로프
    gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.35, this.ctx.currentTime + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.bgmGain);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  // 선택지 클릭 효과음 (영롱한 물방울)
  public playClickSound() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880.00, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.16);
  }

  // 중요한 삶의 갈림길 등장 효과음 (유등 종소리)
  public playChimeSound() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const freqs = [523.25, 659.25, 783.99, 1046.50];
    freqs.forEach((f, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, this.ctx.currentTime + idx * 0.08);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0005, this.ctx.currentTime + idx * 0.08 + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + idx * 0.08);
      osc.stop(this.ctx.currentTime + idx * 0.08 + 1.3);
    });
  }

  public stopBGM() {
    this.isBgmPlaying = false;
    if (this.bgmIntervalId) {
      clearTimeout(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
  }
}

export const audioManager = new AudioManager();
