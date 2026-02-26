import { KokoroTTS } from './kokoro.web.min.js';
import { Mp3Encoder } from './lame.min.js';

let tts = null;

self.onmessage = async (e) => {
  const { type, data } = e.data;

  if (type === 'loadModel') {
    try {
      const model_id = 'onnx-community/Kokoro-82M-ONNX';
      const dtype = data?.dtype || 'q4f16';
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
      const { text, voice, sampleRate, format } = data;

      self.postMessage({ type: 'progress', message: 'Synthesizing...' });

      const audio = await tts.generate(text, { voice });
      const sr = audio.sampling_rate || sampleRate;

      self.postMessage({ type: 'progress', message: `Encoding ${format === 'mp3' ? 'MP3' : 'WAV'}...` });

      if (format === 'mp3') {
        const mp3Buffer = encodeMp3(audio.audio, sr);
        self.postMessage({ type: 'complete', buffer: mp3Buffer, format: 'mp3' }, [mp3Buffer]);
      } else {
        const wavBuffer = createWavBuffer(audio.audio, sr);
        self.postMessage({ type: 'complete', buffer: wavBuffer.buffer, format: 'wav' }, [wavBuffer.buffer]);
      }
    } catch (error) {
      self.postMessage({ type: 'error', message: error.message });
    }
  }
};

function encodeMp3(audioData, sampleRate) {
  const encoder = new Mp3Encoder(1, sampleRate, 128);
  const blockSize = 1152;
  const samples = new Int16Array(audioData.length);
  for (let i = 0; i < audioData.length; i++) {
    const s = Math.max(-1, Math.min(1, audioData[i]));
    samples[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }

  const chunks = [];
  for (let i = 0; i < samples.length; i += blockSize) {
    const block = samples.subarray(i, i + blockSize);
    const encoded = encoder.encodeBuffer(block);
    if (encoded.length > 0) chunks.push(new Uint8Array(encoded));
  }
  const flushed = encoder.flush();
  if (flushed.length > 0) chunks.push(new Uint8Array(flushed));

  const totalLength = chunks.reduce((sum, c) => sum + c.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  return result.buffer;
}

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
