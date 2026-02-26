import { KokoroTTS } from './kokoro.web.min.js';

let tts = null;

self.onmessage = async (e) => {
  const { type, data } = e.data;

  if (type === 'loadModel') {
    try {
      const model_id = "onnx-community/Kokoro-82M-ONNX";
      const dtype = data?.dtype || 'q8';
      tts = await KokoroTTS.from_pretrained(model_id, {
        dtype,
        progress_callback: (progress) => {
          if (progress.status === 'progress') {
            self.postMessage({ type: 'modelProgress', progress: progress.progress });
          }
        }
      });
      self.postMessage({ type: 'modelLoaded' });
    } catch (error) {
      self.postMessage({ type: 'error', message: error.message });
    }
  }

  if (type === 'generate') {
    try {
      const { speakers, pauseSeconds, sampleRate } = data;
      const pauseSamples = Math.floor(pauseSeconds * sampleRate);
      const audioParts = [];
      const total = speakers.length;

      for (let i = 0; i < total; i++) {
        const speaker = speakers[i];
        self.postMessage({ 
          type: 'progress', 
          current: i + 1, 
          total, 
          message: `Generating speaker ${i + 1}/${total}...`
        });

        const audio = await tts.generate(speaker.text, { voice: speaker.voice });
        audioParts.push(audio.audio);

        if (i < total - 1) {
          const silence = new Float32Array(pauseSamples);
          audioParts.push(silence);
        }
      }

      self.postMessage({ type: 'progress', message: 'Stitching audio...' });

      const totalLength = audioParts.reduce((sum, arr) => sum + arr.length, 0);
      const combined = new Float32Array(totalLength);
      let offset = 0;
      for (const part of audioParts) {
        combined.set(part, offset);
        offset += part.length;
      }

      self.postMessage({ type: 'progress', message: 'Creating WAV file...' });

      const wavBuffer = createWavBuffer(combined, sampleRate);
      
      self.postMessage({ 
        type: 'complete', 
        wavBuffer: wavBuffer.buffer,
        sampleRate
      }, [wavBuffer.buffer]);

    } catch (error) {
      self.postMessage({ type: 'error', message: error.message });
    }
  }
};

function createWavBuffer(audioData, sampleRate) {
  const intData = new Int16Array(audioData.length);
  for (let i = 0; i < audioData.length; i++) {
    const s = Math.max(-1, Math.min(1, audioData[i]));
    intData[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }

  const wavBuffer = new ArrayBuffer(44 + intData.length * 2);
  const view = new DataView(wavBuffer);

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + intData.length * 2, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, intData.length * 2, true);

  const bytes = new Uint8Array(wavBuffer, 44);
  for (let i = 0; i < intData.length; i++) {
    bytes[i * 2] = intData[i] & 0xFF;
    bytes[i * 2 + 1] = (intData[i] >> 8) & 0xFF;
  }

  return new Uint8Array(wavBuffer);
}

function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}
