import { useState, useRef } from 'react';
import FileUploader from './FileUploader';
import RestoredOutput from './RestoredOutput';
import { Button } from '@/components/ui/button';
import { Fingerprint, Cpu, AlertCircle } from 'lucide-react';

type Stage = 'idle' | 'processing' | 'done' | 'error';

export default function RestorePanel() {
  const [file, setFile] = useState<File | null>(null);
  const [originalSrc, setOriginalSrc] = useState('');
  const [restoredSrc, setRestoredSrc] = useState('');
  const [stage, setStage] = useState<Stage>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const cancelRef = useRef(false);

  const handleFileSelect = (f: File) => {
    setFile(f);
    setStage('idle');
    setRestoredSrc('');
    setOriginalSrc('');
  };

  const handleRestore = async () => {
  if (!file) return;

  cancelRef.current = false;
  setStage('processing');
  setProgress(0);
  setErrorMsg('');

  // Simulate progress while waiting for backend
  const steps = [15, 35, 55, 75, 90];
  for (const pct of steps) {
    if (cancelRef.current) return;
    setProgress(pct);
    await new Promise(r => setTimeout(r, 300));
  }

  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('http://localhost:5000/restore', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) throw new Error(`Server error: ${res.status}`);

    const data = await res.json();
    if (!data.restored || !data.original) throw new Error('No output from model');

    if (cancelRef.current) return;
    setProgress(100);
    await new Promise(r => setTimeout(r, 200));
    setOriginalSrc(data.original);
    setRestoredSrc(data.restored);
    setStage('done');
  } catch (err) {
    setErrorMsg(err instanceof Error ? err.message : 'Processing failed');
    setStage('error');
  }
};

  const reset = () => {
    cancelRef.current = true;
    setFile(null);
    setOriginalSrc('');
    setRestoredSrc('');
    setStage('idle');
    setProgress(0);
    setErrorMsg('');
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Upload Section */}
      {stage !== 'done' && (
        <div className="gradient-card border-glow rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Fingerprint className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Upload Fingerprint</h3>
              <p className="text-xs text-muted-foreground">Supported: TIFF</p>
            </div>
          </div>
          <FileUploader onFileSelect={handleFileSelect} disabled={stage === 'processing'} />
        </div>
      )}

      {/* Processing State */}
      {stage === 'processing' && (
        <div className="gradient-card border-glow rounded-2xl p-8 text-center scan-line">
          <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-5 animate-pulse-glow">
            <Cpu className="w-10 h-10 text-primary animate-spin" style={{ animationDuration: '2s' }} />
          </div>
          <h3 className="text-lg font-semibold mb-2">Restoring Fingerprint...</h3>
          <p className="text-sm text-muted-foreground mb-6">Applying AI-powered ridge enhancement</p>

          <div className="relative h-2 bg-secondary rounded-full overflow-hidden mb-3">
            <div
              className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-500 glow"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="font-mono text-sm text-primary">{progress}%</p>
        </div>
      )}

      {/* Error State */}
      {stage === 'error' && (
        <div className="gradient-card border border-destructive/30 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-destructive mb-1">Processing Failed</p>
              <p className="text-sm text-muted-foreground">{errorMsg}</p>
            </div>
          </div>

          <Button variant="outline" onClick={reset} className="mt-4 w-full">Try Again</Button>
        </div>
      )}

      {/* Action Button */}
      {stage === 'idle' && file && (
        <Button
          onClick={handleRestore}
          className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base glow"
        >
          <Fingerprint className="w-5 h-5 mr-2" />
          Restore Fingerprint
        </Button>
      )}

      {/* Output */}
      {stage === 'done' && restoredSrc && (
        <div className="gradient-card border-glow rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Fingerprint className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Restoration Complete</h3>
                <p className="text-xs text-muted-foreground">Ridge enhancement applied</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={reset} className="text-muted-foreground hover:text-foreground">
              New File
            </Button>
          </div>
          <RestoredOutput
            originalSrc={originalSrc}
            restoredSrc={restoredSrc}
            fileName={file?.name ?? 'fingerprint'}
          />
        </div>
      )}


    </div>
  );
}
