import { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Square, 
  Wand2, 
  Download, 
  Trash2, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Volume2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

// Voice data with sample URLs
const VOICE_DATA: Record<string, { name: string; region: string; gender: string; sample: string }> = {
  af_heart: { name: 'Heart', region: 'American', gender: 'Female', sample: 'https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/S_9tkA75BT_QHKOzSX6S-.wav' },
  af_alloy: { name: 'Alloy', region: 'American', gender: 'Female', sample: 'https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/wiZ3gvlL--p5pRItO4YRE.wav' },
  af_aoede: { name: 'Aoede', region: 'American', gender: 'Female', sample: 'https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/Nv1xMwzjTdF9MR8v0oEEJ.wav' },
  af_bella: { name: 'Bella', region: 'American', gender: 'Female', sample: 'https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/sWN0rnKU6TlLsVdGqRktF.wav' },
  af_jessica: { name: 'Jessica', region: 'American', gender: 'Female', sample: 'https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/2Oa4wITWAmiCXJ_Q97-7R.wav' },
  af_kore: { name: 'Kore', region: 'American', gender: 'Female', sample: 'https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/AOIgyspzZWDGpn7oQgwtu.wav' },
  af_nicole: { name: 'Nicole', region: 'American', gender: 'Female', sample: 'https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/EY_V2OGr-hzmtTGrTCTyf.wav' },
  af_nova: { name: 'Nova', region: 'American', gender: 'Female', sample: 'https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/X-xdEkx3GPlQG5DK8Gsqd.wav' },
  af_river: { name: 'River', region: 'American', gender: 'Female', sample: 'https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/ZqaV2-xGUZdBQmZAF1Xqy.wav' },
  af_sarah: { name: 'Sarah', region: 'American', gender: 'Female', sample: 'https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/xzoJBl1HCvkE8Fl8Xu2R4.wav' },
  af_sky: { name: 'Sky', region: 'American', gender: 'Female', sample: 'https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/ubebYQoaseyQk-jDLeWX7.wav' },
  am_adam: { name: 'Adam', region: 'American', gender: 'Male', sample: 'https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/tvauhDVRGvGK98I-4wv3H.wav' },
  am_echo: { name: 'Echo', region: 'American', gender: 'Male', sample: 'https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/qy_KuUB0hXsu-u8XaJJ_Z.wav' },
  am_eric: { name: 'Eric', region: 'American', gender: 'Male', sample: 'https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/JhqPjbpMhraUv5nTSPpwD.wav' },
  am_fenrir: { name: 'Fenrir', region: 'American', gender: 'Male', sample: 'https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/c0R9caBdBiNjGUUalI_DQ.wav' },
  am_liam: { name: 'Liam', region: 'American', gender: 'Male', sample: 'https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/DFHvulaLeOjXIDKecvNG3.wav' },
  am_michael: { name: 'Michael', region: 'American', gender: 'Male', sample: 'https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/IPKhsnjq1tPh3JmHH8nEg.wav' },
  am_onyx: { name: 'Onyx', region: 'American', gender: 'Male', sample: 'https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/ov0pFDfE8NNKZ80LqW6Di.wav' },
  am_puck: { name: 'Puck', region: 'American', gender: 'Male', sample: 'https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/MOC654sLMHWI64g8HWesV.wav' },
  am_santa: { name: 'Santa', region: 'American', gender: 'Male', sample: 'https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/LzA6JmHBvQlhOviy8qVfJ.wav' },
  bf_alice: { name: 'Alice', region: 'British', gender: 'Female', sample: 'https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/9mnYZ3JWq7f6U12plXilA.wav' },
  bf_emma: { name: 'Emma', region: 'British', gender: 'Female', sample: 'https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/_fvGtKMttRI0cZVGqxMh8.wav' },
  bf_isabella: { name: 'Isabella', region: 'British', gender: 'Female', sample: 'https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/VzlcJpqGEND_Q3duYnhiu.wav' },
  bf_lily: { name: 'Lily', region: 'British', gender: 'Female', sample: 'https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/qZCoartohiRlVamY8Xpok.wav' },
  bm_daniel: { name: 'Daniel', region: 'British', gender: 'Male', sample: 'https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/Eb0TLnLXHDRYOA3TJQKq3.wav' },
  bm_fable: { name: 'Fable', region: 'British', gender: 'Male', sample: 'https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/NT9XkmvlezQ0FJ6Th5hoZ.wav' },
  bm_george: { name: 'George', region: 'British', gender: 'Male', sample: 'https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/y6VJbCESszLZGupPoqNkF.wav' },
  bm_lewis: { name: 'Lewis', region: 'British', gender: 'Male', sample: 'https://cdn-uploads.huggingface.co/production/uploads/61b253b7ac5ecaae3d1efe0c/RlB5BRvLt-IFvTjzQNxCh.wav' }
};

const voiceGroups = {
  'American Female': Object.entries(VOICE_DATA).filter(([_, v]) => v.region === 'American' && v.gender === 'Female'),
  'American Male': Object.entries(VOICE_DATA).filter(([_, v]) => v.region === 'American' && v.gender === 'Male'),
  'British Female': Object.entries(VOICE_DATA).filter(([_, v]) => v.region === 'British' && v.gender === 'Female'),
  'British Male': Object.entries(VOICE_DATA).filter(([_, v]) => v.region === 'British' && v.gender === 'Male'),
};

import { KokoroTTS } from '@/lib/kokoro.web.min.js';

interface AudioEntry {
  id: number;
  text: string;
  voice: string;
  blob: Blob;
  timestamp: number;
}

interface SingleTTSProps {
  backend: 'WebGPU' | 'CPU';
}

export default function SingleTTS({ backend }: SingleTTSProps) {
  const [text, setText] = useState('');
  const [voice, setVoice] = useState('af_heart');
  const [format, setFormat] = useState<'mp3' | 'wav'>('mp3');
  const [isLoading, setIsLoading] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [audioHistory, setAudioHistory] = useState<AudioEntry[]>([]);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [previewPlaying, setPreviewPlaying] = useState<string | null>(null);
  
  const ttsRef = useRef<any>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlsRef = useRef<Map<number, string>>(new Map());

  // Load cached audio on mount
  useEffect(() => {
    const loadCached = async () => {
      try {
        const db = await openDB();
        const items = await getAllFromDB(db);
        setAudioHistory(items.reverse());
      } catch (e) {
        console.error('Failed to load cached audio:', e);
      }
    };
    loadCached();
  }, []);

  // Cleanup audio URLs on unmount
  useEffect(() => {
    return () => {
      audioUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('kokoro-tts-cache', 1);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (e) => {
        const db = (e.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('audio')) {
          db.createObjectStore('audio', { keyPath: 'id', autoIncrement: true });
        }
      };
    });
  };

  const getAllFromDB = (db: IDBDatabase): Promise<AudioEntry[]> => {
    return new Promise((resolve, reject) => {
      const tx = db.transaction('audio', 'readonly');
      const store = tx.objectStore('audio');
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

  const addToDB = async (entry: Omit<AudioEntry, 'id'>): Promise<number> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('audio', 'readwrite');
      const store = tx.objectStore('audio');
      const request = store.add(entry);
      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  };

  const deleteFromDB = async (id: number) => {
    const db = await openDB();
    return new Promise<void>((resolve, reject) => {
      const tx = db.transaction('audio', 'readwrite');
      const store = tx.objectStore('audio');
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  };

  const clearDB = async () => {
    const db = await openDB();
    return new Promise<void>((resolve, reject) => {
      const tx = db.transaction('audio', 'readwrite');
      const store = tx.objectStore('audio');
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  };

  const loadModel = async () => {
    if (modelLoaded && ttsRef.current) return;

    setProgressText('Initializing...');
    setProgress(10);

    try {
      const model_id = 'onnx-community/Kokoro-82M-ONNX';
      const dtype = backend === 'WebGPU' ? 'q8' : 'q4f16';

      setProgressText('Loading model...');
      setProgress(30);

      ttsRef.current = await KokoroTTS.from_pretrained(model_id, {
        dtype,
        progress_callback: (p: any) => {
          if (p.status === 'progress') {
            const percent = Math.round(p.progress);
            setProgress(30 + percent * 0.6);
            setProgressText(`Loading: ${percent}%`);
          }
        }
      });

      setModelLoaded(true);
      setProgress(100);
      setProgressText('Ready!');
      
      setTimeout(() => {
        setProgress(0);
        setProgressText('');
      }, 500);
    } catch (error: any) {
      console.error('Error loading model:', error);
      setStatus({ type: 'error', message: `Failed to load model: ${error.message}` });
      throw error;
    }
  };

  const createWavBlob = (audioData: Float32Array, sampleRate: number): Blob => {
    const intData = new Int16Array(audioData.length);
    for (let i = 0; i < audioData.length; i++) {
      const s = Math.max(-1, Math.min(1, audioData[i]));
      intData[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }

    const wavBuffer = new ArrayBuffer(44 + intData.length * 2);
    const view = new DataView(wavBuffer);

    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + intData.length * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, intData.length * 2, true);

    const bytes = new Uint8Array(wavBuffer, 44);
    for (let i = 0; i < intData.length; i++) {
      bytes[i * 2] = intData[i] & 0xFF;
      bytes[i * 2 + 1] = (intData[i] >> 8) & 0xFF;
    }

    return new Blob([wavBuffer], { type: 'audio/wav' });
  };

  const generateAudio = async () => {
    if (!text.trim()) {
      setStatus({ type: 'error', message: 'Please enter some text' });
      setTimeout(() => setStatus({ type: null, message: '' }), 3000);
      return;
    }

    setIsLoading(true);
    setProgress(20);
    setProgressText('Starting...');
    setStatus({ type: null, message: '' });

    try {
      await loadModel();

      setProgress(50);
      setProgressText('Synthesizing...');

      const audio = await ttsRef.current.generate(text, { voice });

      setProgress(80);
      setProgressText('Processing...');

      const audioData = audio.audio;
      const sampleRate = audio.sampling_rate || 24000;
      const blob = createWavBlob(audioData, sampleRate);

      const id = await addToDB({ text, voice, blob, timestamp: Date.now() });
      const newEntry: AudioEntry = { id, text, voice, blob, timestamp: Date.now() };
      
      setAudioHistory(prev => [newEntry, ...prev]);

      setProgress(100);
      setProgressText('Done!');
      
      setTimeout(() => {
        setProgress(0);
        setProgressText('');
        setStatus({ type: 'success', message: 'Audio generated successfully!' });
        setTimeout(() => setStatus({ type: null, message: '' }), 2000);
      }, 500);
    } catch (error: any) {
      console.error('Error:', error);
      setStatus({ type: 'error', message: `Error: ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  const playVoicePreview = (voiceId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();

    if (previewPlaying === voiceId) {
      previewAudioRef.current?.pause();
      setPreviewPlaying(null);
      return;
    }

    previewAudioRef.current?.pause();
    const voiceData = VOICE_DATA[voiceId];
    if (!voiceData) return;

    previewAudioRef.current = new Audio(voiceData.sample);
    previewAudioRef.current.onended = () => setPreviewPlaying(null);
    previewAudioRef.current.onerror = () => setPreviewPlaying(null);
    previewAudioRef.current.play().catch(() => setPreviewPlaying(null));
    setPreviewPlaying(voiceId);
  };

  const selectVoice = (voiceId: string) => {
    setVoice(voiceId);
    setShowVoiceModal(false);
  };

  const deleteEntry = async (id: number) => {
    await deleteFromDB(id);
    const url = audioUrlsRef.current.get(id);
    if (url) {
      URL.revokeObjectURL(url);
      audioUrlsRef.current.delete(id);
    }
    setAudioHistory(prev => prev.filter(entry => entry.id !== id));
  };

  const clearAll = async () => {
    await clearDB();
    audioUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
    audioUrlsRef.current.clear();
    setAudioHistory([]);
    setShowClearDialog(false);
    setStatus({ type: 'success', message: 'All audio cleared' });
    setTimeout(() => setStatus({ type: null, message: '' }), 2000);
  };

  const downloadBlob = (blob: Blob, timestamp: number) => {
    const time = new Date(timestamp).toISOString().replace(/[:.]/g, '-');
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kokoro-tts-${time}.wav`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const getAudioUrl = (entry: AudioEntry): string => {
    if (!audioUrlsRef.current.has(entry.id)) {
      const url = URL.createObjectURL(entry.blob);
      audioUrlsRef.current.set(entry.id, url);
    }
    return audioUrlsRef.current.get(entry.id)!;
  };

  const getVoiceDisplayName = (voiceId: string) => {
    const v = VOICE_DATA[voiceId];
    return v ? `${v.name} (${v.region})` : voiceId;
  };

  return (
    <div className="space-y-6">
      {/* Input Card */}
      <div className="glass rounded-2xl p-6 space-y-6">
        {/* Text Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Text to speak</label>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your text here..."
            className="min-h-[140px] resize-y bg-muted/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all duration-200"
          />
        </div>

        {/* Voice & Format Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Voice</label>
            <div className="flex gap-2">
              <button
                onClick={() => setShowVoiceModal(true)}
                className="flex-1 flex items-center justify-between px-4 py-2.5 bg-muted/50 border border-border/50 rounded-xl hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
              >
                <span className="text-sm font-medium">{getVoiceDisplayName(voice)}</span>
              </button>
              <Button
                variant="outline"
                size="icon"
                onClick={(e) => playVoicePreview(voice, e)}
                className="shrink-0 rounded-xl border-border/50 hover:bg-primary/10 hover:text-primary hover:border-primary/30"
              >
                {previewPlaying === voice ? (
                  <Square className="w-3 h-3" />
                ) : (
                  <Play className="w-3 h-3" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Format</label>
            <Select value={format} onValueChange={(v) => setFormat(v as 'mp3' | 'wav')}>
              <SelectTrigger className="bg-muted/50 border-border/50 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mp3">MP3</SelectItem>
                <SelectItem value="wav">WAV</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={generateAudio}
          disabled={isLoading}
          className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-200"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5 mr-2" />
              Generate Audio
            </>
          )}
        </Button>

        {/* Progress */}
        {progress > 0 && (
          <div className="space-y-2 animate-in">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-center text-muted-foreground">{progressText}</p>
          </div>
        )}

        {/* Status */}
        {status.type && (
          <Alert 
            variant={status.type === 'error' ? 'destructive' : 'default'}
            className={`animate-in ${status.type === 'success' ? 'bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] border-[hsl(var(--success))]/20' : ''}`}
          >
            {status.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription>{status.message}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* Audio History */}
      {audioHistory.length > 0 && (
        <div className="glass rounded-2xl p-6 space-y-4 slide-in">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              Generated Audio ({audioHistory.length})
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowClearDialog(true)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg"
            >
              <Trash2 className="w-4 h-4 mr-1.5" />
              Clear All
            </Button>
          </div>

          <div className="space-y-3">
            {audioHistory.map((entry, index) => (
              <div 
                key={entry.id} 
                className="bg-muted/50 rounded-xl p-4 space-y-3 animate-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-sm font-medium text-primary truncate">
                      {getVoiceDisplayName(entry.voice)}
                    </span>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {new Date(entry.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteEntry(entry.id)}
                    className="shrink-0 w-8 h-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {entry.text.length > 120 ? entry.text.substring(0, 120) + '...' : entry.text}
                </p>
                
                <div className="flex items-center gap-3">
                  <audio 
                    controls 
                    src={getAudioUrl(entry)} 
                    className="flex-1 h-10"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => downloadBlob(entry.blob, entry.timestamp)}
                    className="shrink-0 rounded-lg border-border/50 hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Clear Dialog */}
      <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Clear all audio?</DialogTitle>
            <DialogDescription>
              This will permanently delete all {audioHistory.length} generated audio files from your browser.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowClearDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={clearAll}>
              Clear All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Voice Selection Modal */}
      <Dialog open={showVoiceModal} onOpenChange={setShowVoiceModal}>
        <DialogContent className="sm:max-w-md max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Select Voice</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[50vh] -mx-6">
            <div className="px-6 pb-2 space-y-4">
              {Object.entries(voiceGroups).map(([groupName, voices]) => (
                <div key={groupName} className="space-y-2">
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {groupName}
                  </h4>
                  <div className="space-y-1">
                    {voices.map(([voiceId, voiceData]) => (
                      <button
                        key={voiceId}
                        onClick={() => selectVoice(voiceId)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${
                          voice === voiceId
                            ? 'border-primary bg-primary/10'
                            : 'border-border/50 hover:border-primary/30 hover:bg-muted/50'
                        }`}
                      >
                        <span className="text-sm font-medium">{voiceData.name}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => playVoicePreview(voiceId, e)}
                          className="w-7 h-7 rounded-full hover:bg-primary/20"
                        >
                          {previewPlaying === voiceId ? (
                            <Square className="w-3 h-3" />
                          ) : (
                            <Play className="w-3 h-3" />
                          )}
                        </Button>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
