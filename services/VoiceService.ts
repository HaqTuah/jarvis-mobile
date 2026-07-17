/**
 * Jarvis Voice Service
 * Handles text-to-speech and speech-to-text for mobile.
 * Uses expo-speech for TTS and expo-audio for recording.
 */

import * as Speech from 'expo-speech';
import { Audio } from 'expo-audio';

class VoiceService {
  constructor() {
    this.isSpeaking = false;
    this.isListening = false;
    this.voice = null;
    this.availableVoices = [];
    this.onSpeechStart = null;
    this.onSpeechEnd = null;
    this.onSpeechError = null;
  }

  async init() {
    try {
      this.availableVoices = await Speech.getAvailableVoicesAsync();
      // Prefer a high-quality English voice
      const preferredVoice = this.availableVoices.find(
        v => v.language && v.language.startsWith('en') && v.quality === 'Enhanced'
      );
      this.voice = preferredVoice?.identifier || null;
    } catch (error) {
      console.warn('Voice init error:', error);
    }
  }

  /**
   * Speak text aloud
   */
  async speak(text, options = {}) {
    if (this.isSpeaking) {
      await Speech.stop();
    }

    this.isSpeaking = true;

    return new Promise((resolve) => {
      Speech.speak(text, {
        voice: this.voice || undefined,
        rate: options.rate || 0.9,
        pitch: options.pitch || 1.0,
        volume: options.volume || 1.0,
        language: options.language || 'en',
        onStart: () => {
          this.isSpeaking = true;
          if (this.onSpeechStart) this.onSpeechStart();
        },
        onDone: () => {
          this.isSpeaking = false;
          if (this.onSpeechEnd) this.onSpeechEnd();
          resolve();
        },
        onError: (error) => {
          this.isSpeaking = false;
          if (this.onSpeechError) this.onSpeechError(error);
          resolve();
        },
        onStopped: () => {
          this.isSpeaking = false;
          resolve();
        },
      });
    });
  }

  /**
   * Stop speaking
   */
  async stop() {
    if (this.isSpeaking) {
      await Speech.stop();
      this.isSpeaking = false;
    }
  }

  /**
   * Check if currently speaking
   */
  async isCurrentlySpeaking() {
    return Speech.isSpeakingAsync();
  }

  /**
   * Get available voices
   */
  getVoices() {
    return this.availableVoices;
  }

  /**
   * Set voice by identifier
   */
  setVoice(voiceId) {
    this.voice = voiceId;
  }
}

export const voiceService = new VoiceService();
export default VoiceService;