import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface RestoredOutputProps {
  originalSrc: string;
  restoredSrc: string;
  fileName: string;
}

export default function RestoredOutput({ originalSrc, restoredSrc, fileName }: RestoredOutputProps) {
  const [view, setView] = useState<'restored' | 'original' | 'compare'>('restored');
  const [zoom, setZoom] = useState(1);

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = restoredSrc;
    const base = fileName.replace(/\.[^/.]+$/, '');
    a.download = `${base}_restored.png`;
    a.click();
  };

  return (
    <div className="space-y-4">
      {/* View Toggle */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex bg-secondary rounded-lg p-1 gap-1">
          {(['restored', 'original', 'compare'] as const).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all ${
                view === v
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {v}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 ml-auto">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}>
            <ZoomOut className="w-3.5 h-3.5" />
          </Button>
          <span className="text-xs text-muted-foreground w-12 text-center font-mono">{Math.round(zoom * 100)}%</span>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(z => Math.min(3, z + 0.25))}>
            <ZoomIn className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(1)}>
            <Maximize2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Image Display */}
      <div className="relative bg-secondary/30 rounded-xl border border-border overflow-hidden" style={{ minHeight: 320 }}>
        {view === 'compare' ? (
          <div className="grid grid-cols-2 gap-0">
            <div className="p-4">
              <p className="text-xs font-mono text-muted-foreground mb-2 text-center">ORIGINAL</p>
              <div className="overflow-auto max-h-72 flex items-center justify-center">
                <img
                  src={originalSrc}
                  alt="Original fingerprint"
                  className="max-w-full rounded-lg"
                  style={{ transform: `scale(${zoom})`, transformOrigin: 'center', transition: 'transform 0.2s' }}
                />
              </div>
            </div>
            <div className="p-4 border-l border-border">
              <p className="text-xs font-mono text-primary mb-2 text-center">RESTORED</p>
              <div className="overflow-auto max-h-72 flex items-center justify-center">
                <img
                  src={restoredSrc}
                  alt="Restored fingerprint"
                  className="max-w-full rounded-lg glow"
                  style={{ transform: `scale(${zoom})`, transformOrigin: 'center', transition: 'transform 0.2s' }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 flex items-center justify-center min-h-72 overflow-auto">
            <img
              src={view === 'restored' ? restoredSrc : originalSrc}
              alt={view === 'restored' ? 'Restored fingerprint' : 'Original fingerprint'}
              className={`max-w-full max-h-80 rounded-lg ${view === 'restored' ? 'glow' : ''}`}
              style={{ transform: `scale(${zoom})`, transformOrigin: 'center', transition: 'transform 0.2s' }}
            />
          </div>
        )}
      </div>

      {/* Download */}
      <Button
        onClick={handleDownload}
        className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base glow animate-pulse-glow"
      >
        <Download className="w-5 h-5 mr-2" />
        Download Restored Image (.PNG)
      </Button>

      <div className="grid grid-cols-3 gap-3 text-center">
        {[
          { label: 'Ridge Enhanced', value: '✓' },
          { label: 'Noise Reduced', value: '✓' },
          { label: 'Contrast Boosted', value: '✓' },
        ].map(item => (
          <div key={item.label} className="bg-primary/5 border border-primary/20 rounded-lg p-3">
            <p className="text-primary text-lg font-bold">{item.value}</p>
            <p className="text-muted-foreground text-xs mt-0.5">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
