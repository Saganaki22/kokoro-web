import { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Square, 
  Plus, 
  Trash2, 
  Loader2, 
  Download, 
  CheckCircle2, 
  AlertCircle,
  Users,
  Settings2,
  Volume2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Voice data
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

const MAX_SPEAKERS = 10;
const MIN_SPEAKERS = 2;

interface Speaker {
  id: number;
  voice: string;
  text: string;
}

interface ConversationProps {
  backend: 'WebGPU' | 'CPU';
}

export default function Conversation({ backend }: ConversationProps) {
  const [speakers, setSpeakers] = useState<Speaker[]>([
    { id: 0, voice: 'af_heart', text: '' },
    { id: 1, voice: 'am_adam', text: '' }
  ]);
  const [nextId, setNextId] = useState(2);
  const [pauseSeconds, setPauseSeconds] = useState(0.5);
  const [format, setFormat] = useState<'mp3' | 'wav'>('mp3');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [generatedAudio, setGeneratedAudio] = useState<string | null>(null);
  const [generatedFormat, setGeneratedFormat] = useState<'mp3' | 'wav'>('mp3');
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [selectedSpeakerId, setSelectedSpeakerId] = useState<number | null>(null);
  const [previewPlaying, setPreviewPlaying] = useState<string | null>(null);

  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const modelLoadedRef = useRef(false);

  useEffect(() => {
    // Both files are in public/ and served as static assets — Vite never bundles them.
    // Using a plain string URL means Vite won't try to process the worker.
    const base = import.meta.env.BASE_URL; // '/kokoro-web/'
    workerRef.current = new Worker(`${base}conversation-worker.js`, { type: 'module' });
    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  const voiceGroups = {
    'American Female': Object.entries(VOICE_DATA).filter(([_, v]) => v.region === 'American' && v.gender === 'Female'),
    'American Male': Object.entries(VOICE_DATA).filter(([_, v]) => v.region === 'American' && v.gender === 'Male'),
    'British Female': Object.entries(VOICE_DATA).filter(([_, v]) => v.region === 'British' && v.gender === 'Female'),
    'British Male': Object.entries(VOICE_DATA).filter(([_, v]) => v.region === 'British' && v.gender === 'Male'),
  };

  const ensureModelLoaded = (): Promise<void> => {
    if (modelLoadedRef.current) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const worker = workerRef.current!;
      const dtype = backend === 'WebGPU' ? 'q8' : 'q4f16';

      const handler = (e: MessageEvent) => {
        const { type, ...data } = e.data;
        if (type === 'modelLoaded') {
          modelLoadedRef.current = true;
          worker.removeEventListener('message', handler);
          resolve();
        } else if (type === 'modelProgress') {
          const pct = 5 + data.progress * 0.15;
          setProgress(pct);
          setProgressText(`Loading model: ${Math.round(data.progress)}%`);
        } else if (type === 'error') {
          worker.removeEventListener('message', handler);
          reject(new Error(data.message));
        }
      };

      worker.addEventListener('message', handler);
      worker.postMessage({ type: 'loadModel', data: { dtype } });
    });
  };


  const addSpeaker = () => {
    if (speakers.length >= MAX_SPEAKERS) return;
    setSpeakers(prev => [...prev, { id: nextId, voice: 'af_heart', text: '' }]);
    setNextId(prev => prev + 1);
  };

  const removeSpeaker = (id: number) => {
    if (speakers.length <= MIN_SPEAKERS) return;
    setSpeakers(prev => prev.filter(s => s.id !== id));
  };

  const updateSpeaker = (id: number, updates: Partial<Speaker>) => {
    setSpeakers(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const openVoiceModal = (speakerId: number) => {
    setSelectedSpeakerId(speakerId);
    setShowVoiceModal(true);
  };

  const selectVoice = (voiceId: string) => {
    if (selectedSpeakerId === null) return;
    updateSpeaker(selectedSpeakerId, { voice: voiceId });
    setShowVoiceModal(false);
    setSelectedSpeakerId(null);
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

  const generateConversation = async () => {
    const validSpeakers = speakers.filter(s => s.text.trim());
    if (validSpeakers.length === 0) {
      setStatus({ type: 'error', message: 'Please enter text for at least one speaker' });
      setTimeout(() => setStatus({ type: null, message: '' }), 3000);
      return;
    }

    setIsLoading(true);
    setProgress(5);
    setProgressText('Loading model...');
    setStatus({ type: null, message: '' });

    try {
      await ensureModelLoaded();

      setProgress(20);
      setProgressText('Starting generation...');

      const worker = workerRef.current!;

      await new Promise<void>((resolve, reject) => {
        const handler = (e: MessageEvent) => {
          const { type, ...data } = e.data;
          if (type === 'progress') {
            if (data.current && data.total) {
              setProgress(20 + (data.current / data.total) * 60);
            }
            setProgressText(data.message);
          } else if (type === 'complete') {
            worker.removeEventListener('message', handler);
            const fmt: 'mp3' | 'wav' = data.format;
            const mime = fmt === 'mp3' ? 'audio/mpeg' : 'audio/wav';
            const blob = new Blob([data.buffer], { type: mime });
            setGeneratedFormat(fmt);
            setGeneratedAudio(prev => {
              if (prev) URL.revokeObjectURL(prev);
              return URL.createObjectURL(blob);
            });
            setProgress(100);
            setProgressText('Done!');
            setTimeout(() => {
              setProgress(0);
              setProgressText('');
              setStatus({ type: 'success', message: 'Conversation generated!' });
              setTimeout(() => setStatus({ type: null, message: '' }), 2000);
            }, 500);
            resolve();
          } else if (type === 'error') {
            worker.removeEventListener('message', handler);
            reject(new Error(data.message));
          }
        };

        worker.addEventListener('message', handler);
        worker.postMessage({
          type: 'generate',
          data: {
            speakers: validSpeakers.map(s => ({ text: s.text, voice: s.voice })),
            pauseSeconds,
            sampleRate: 24000,
            format,
          }
        });
      });
    } catch (error: any) {
      console.error('Error:', error);
      setStatus({ type: 'error', message: `Error: ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadAudio = () => {
    if (!generatedAudio) return;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const link = document.createElement('a');
    link.href = generatedAudio;
    link.download = `kokoro-conversation-${timestamp}.${generatedFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getVoiceDisplayName = (voiceId: string) => {
    const v = VOICE_DATA[voiceId];
    return v ? `${v.name} (${v.region})` : voiceId;
  };

  return (
    <div className="space-y-6">
      {/* Settings Card */}
      <div className="glass rounded-2xl p-4 flex flex-wrap items-center gap-4">
        <Settings2 className="w-5 h-5 text-muted-foreground shrink-0" />
        <div className="flex items-center gap-3">
          <label className="text-sm text-muted-foreground whitespace-nowrap">Pause between speakers</label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={pauseSeconds}
              onChange={(e) => setPauseSeconds(parseFloat(e.target.value) || 0.5)}
              min={0.1}
              max={1.5}
              step={0.1}
              className="w-20 h-9 bg-muted/50 border-border/50 rounded-lg text-center"
            />
            <span className="text-sm text-muted-foreground">seconds</span>
          </div>
        </div>
        <div className="flex items-center gap-3 ml-auto">
          <label className="text-sm text-muted-foreground">Format</label>
          <Select value={format} onValueChange={(v) => setFormat(v as 'mp3' | 'wav')}>
            <SelectTrigger className="w-24 h-9 bg-muted/50 border-border/50 rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mp3">MP3</SelectItem>
              <SelectItem value="wav">WAV</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Speakers */}
      <div className="space-y-4">
        {speakers.map((speaker, index) => (
          <div
            key={speaker.id}
            className="glass rounded-2xl p-5 space-y-4 animate-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => openVoiceModal(speaker.id)}
                  className="flex items-center gap-2 px-3 py-2 bg-muted/50 hover:bg-primary/10 hover:text-primary rounded-xl border border-border/50 hover:border-primary/30 transition-all duration-200"
                >
                  <span className="text-sm font-medium">{getVoiceDisplayName(speaker.voice)}</span>
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => { e.stopPropagation(); playVoicePreview(speaker.voice); }}
                    className="w-6 h-6 rounded-full hover:bg-primary/20 inline-flex items-center justify-center"
                  >
                    {previewPlaying === speaker.voice ? <Square className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  </span>
                </button>
                <span className="text-xs text-muted-foreground">Speaker {index + 1}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeSpeaker(speaker.id)}
                disabled={speakers.length <= MIN_SPEAKERS}
                className="w-8 h-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 disabled:opacity-30"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <Textarea
              value={speaker.text}
              onChange={(e) => updateSpeaker(speaker.id, { text: e.target.value })}
              placeholder={`Enter text for Speaker ${index + 1}...`}
              className="min-h-[100px] resize-y bg-muted/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all duration-200"
            />
          </div>
        ))}
      </div>

      {/* Add Speaker Button */}
      <Button
        variant="outline"
        onClick={addSpeaker}
        disabled={speakers.length >= MAX_SPEAKERS}
        className="w-full h-12 rounded-xl border-dashed border-2 border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
      >
        <Plus className="w-5 h-5 mr-2" />
        {speakers.length >= MAX_SPEAKERS ? `Maximum ${MAX_SPEAKERS} speakers` : 'Add Speaker'}
      </Button>

      {/* Generate Button */}
      <Button
        onClick={generateConversation}
        disabled={isLoading}
        className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-200"
      >
        {isLoading ? (
          <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Generating...</>
        ) : (
          <><Users className="w-5 h-5 mr-2" />Generate Conversation</>
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
          {status.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertDescription>{status.message}</AlertDescription>
        </Alert>
      )}

      {/* Generated Audio */}
      {generatedAudio && (
        <div className="glass rounded-2xl p-6 space-y-4 slide-in">
          <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Volume2 className="w-4 h-4" />
            Generated Conversation
          </h3>
          <audio controls src={generatedAudio} className="w-full" />
          <Button
            variant="outline"
            onClick={downloadAudio}
            className="w-full rounded-xl border-border/50 hover:bg-primary/10 hover:text-primary hover:border-primary/30"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      )}

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
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{groupName}</h4>
                  <div className="space-y-1">
                    {voices.map(([voiceId, voice]) => (
                      <button
                        key={voiceId}
                        onClick={() => selectVoice(voiceId)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${
                          selectedSpeakerId !== null &&
                          speakers.find(s => s.id === selectedSpeakerId)?.voice === voiceId
                            ? 'border-primary bg-primary/10'
                            : 'border-border/50 hover:border-primary/30 hover:bg-muted/50'
                        }`}
                      >
                        <span className="text-sm font-medium">{voice.name}</span>
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={(e) => playVoicePreview(voiceId, e)}
                          className="w-7 h-7 rounded-full hover:bg-primary/20 inline-flex items-center justify-center"
                        >
                          {previewPlaying === voiceId ? <Square className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                        </span>
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
