import { useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import FileUploader from './FileUploader';
import RestoredOutput from './RestoredOutput';
import { restoreFingerprint } from '@/lib/fingerprintProcessor';
import { Button } from '@/components/ui/button';
import { Fingerprint, Cpu, AlertCircle, FileText } from 'lucide-react';

type Stage = 'idle' | 'processing' | 'done' | 'error';

export default function RestorePanel() {
  const { user } = useAuth();
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

    if (f.type !== 'application/pdf') {
      const url = URL.createObjectURL(f);
      setOriginalSrc(url);
    } else {
      setOriginalSrc('');
    }
  };

  const handleRestore = async () => {
    if (!file) return;
    if (file.type === 'application/pdf') {
      setErrorMsg('PDF processing: Please convert your PDF to PNG/JPG first, or upload an image directly for best results.');
      setStage('error');
      return;
    }

    cancelRef.current = false;
    setStage('processing');
    setProgress(0);
    setErrorMsg('');

    // Simulate progress steps
    const steps = [
      { pct: 15, label: 'Loading image...' },
      { pct: 35, label: 'Converting to grayscale...' },
      { pct: 55, label: 'Enhancing contrast...' },
      { pct: 75, label: 'Sharpening ridges...' },
      { pct: 90, label: 'Applying restoration...' },
    ];

    for (const step of steps) {
      if (cancelRef.current) return;
      setProgress(step.pct);
      await new Promise(r => setTimeout(r, 300));
    }

    try {
      const result = await restoreFingerprint(file);
      if (cancelRef.current) return;
      setProgress(100);
      await new Promise(r => setTimeout(r, 200));
      setRestoredSrc(result);
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
              <p className="text-xs text-muted-foreground">Supported: PNG, JPG, JPEG, PDF</p>
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
          {file?.type === 'application/pdf' && (
            <div className="mt-4 p-3 bg-secondary/50 rounded-lg flex items-start gap-2">
              <FileText className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                PDF fingerprint support is coming soon. For now, please extract the fingerprint image and upload as PNG or JPG.
              </p>
            </div>
          )}
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

      {/* Not Logged In Notice */}
      {!user && (
        <div className="text-center p-4 bg-primary/5 border border-primary/20 rounded-xl">
          <p className="text-sm text-muted-foreground">
            Sign in to save your restoration history and access premium features.
          </p>
        </div>
      )}
    </div>
  );
}
