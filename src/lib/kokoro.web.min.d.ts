declare module '@/lib/kokoro.web.min.js' {
  export class KokoroTTS {
    static from_pretrained(model_id: string, options?: {
      dtype?: string;
      progress_callback?: (progress: any) => void;
    }): Promise<KokoroTTS>;
    generate(text: string, options?: { voice?: string }): Promise<{
      audio: Float32Array;
      sampling_rate?: number;
    }>;
  }
}
