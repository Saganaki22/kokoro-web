import { useState, useEffect } from 'react';

declare global {
  interface Navigator {
    gpu?: any;
  }
}
import { Sun, Moon, Volume2, MessageSquare, Mic, Github, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SingleTTS from '@/sections/SingleTTS';
import Conversation from '@/sections/Conversation';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [backend, setBackend] = useState<'WebGPU' | 'CPU'>('CPU');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('kokoro-theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
    
    // Check WebGPU support
    if (navigator.gpu) {
      setBackend('WebGPU');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('kokoro-theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Background gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-50 border-b border-border/50 backdrop-blur-xl bg-background/80 sticky top-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/20">
                  <Volume2 className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-background flex items-center justify-center">
                  <Sparkles className="w-2.5 h-2.5 text-primary" />
                </div>
              </div>
              <div>
                <h1 className="text-lg font-semibold tracking-tight">Kokoro TTS</h1>
                <p className="text-xs text-muted-foreground">Browser-based synthesis</p>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Backend badge */}
              <div 
                className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
                  backend === 'WebGPU' 
                    ? 'bg-[hsl(var(--gpu))]/10 text-[hsl(var(--gpu))] border-[hsl(var(--gpu))]/20' 
                    : 'bg-[hsl(var(--cpu))]/10 text-[hsl(var(--cpu))] border-[hsl(var(--cpu))]/20'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${backend === 'WebGPU' ? 'bg-[hsl(var(--gpu))]' : 'bg-[hsl(var(--cpu))]'}`} />
                {backend}
              </div>

              {/* Theme toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full w-10 h-10 hover:bg-muted transition-all duration-200"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </Button>

              {/* GitHub link */}
              <a
                href="https://github.com/Saganaki22/kokoro-web"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full hover:bg-muted transition-all duration-200"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Tabs defaultValue="single" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 p-1 bg-muted/50 rounded-xl">
            <TabsTrigger 
              value="single" 
              className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm transition-all duration-200"
            >
              <Mic className="w-4 h-4 mr-2" />
              Single TTS
            </TabsTrigger>
            <TabsTrigger 
              value="conversation"
              className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm transition-all duration-200"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Conversation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="single" className="mt-0">
            <SingleTTS backend={backend} />
          </TabsContent>

          <TabsContent value="conversation" className="mt-0">
            <Conversation backend={backend} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>
              Powered by{' '}
              <a 
                href="https://huggingface.co/docs/transformers.js/en/index" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Transformers.js
              </a>
            </p>
            <p className="flex items-center gap-1">
              <span>Using</span>
              <a 
                href="https://huggingface.co/onnx-community/Kokoro-82M-ONNX" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Kokoro-82M-ONNX
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
