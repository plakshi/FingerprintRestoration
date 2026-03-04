import { useCallback, useRef, useState } from 'react';
import { Upload, FileImage, X, AlertCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

const ACCEPTED = ['image/tiff', 'image/x-tiff'];
const MAX_SIZE = 20 * 1024 * 1024;

export default function FileUploader({ onFileSelect, disabled }: FileUploaderProps) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');
  const [noisyUrl, setNoisyUrl] = useState<string | null>(null);
  const [cleanUrl, setCleanUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndSet = async (file: File) => {
    setFileError('');
    if (!ACCEPTED.includes(file.type)) {
      setFileError('Invalid file type. Please upload a TIFF file.');
      return;
    }
    if (file.size > MAX_SIZE) {
      setFileError('File too large. Maximum size is 20MB.');
      return;
    }
    setSelectedFile(file);
    setNoisyUrl(null);
    setCleanUrl(null);
    onFileSelect(file);

    // Send to backend
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('http://localhost:5000/restore', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.restored && data.original) {
        setNoisyUrl(data.original);
        setCleanUrl(data.restored);
      } else {
        setFileError('Restoration failed. Check the backend.');
      }
    } catch (err) {
      setFileError('Could not connect to backend. Is it running on port 5000?');
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) validateAndSet(file);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndSet(file);
  };

  const clearFile = () => {
    setSelectedFile(null);
    setFileError('');
    setNoisyUrl(null);
    setCleanUrl(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="w-full">
      {!selectedFile ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !disabled && inputRef.current?.click()}
          className={`
            relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200
            ${dragOver ? 'border-primary bg-primary/10 scale-[1.01]' : 'border-border hover:border-primary/50 hover:bg-primary/5'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".tif,.tiff"
            onChange={handleChange}
            className="hidden"
            disabled={disabled}
          />
          <div className="flex flex-col items-center gap-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 ${dragOver ? 'bg-primary/20 glow' : 'bg-secondary'}`}>
              <Upload className={`w-7 h-7 transition-colors ${dragOver ? 'text-primary' : 'text-muted-foreground'}`} />
            </div>
            <div>
              <p className="text-base font-semibold mb-1">
                {dragOver ? 'Drop your file here' : 'Drag & drop your fingerprint file'}
              </p>
              <p className="text-sm text-muted-foreground">
                or <span className="text-primary font-medium">browse to upload</span>
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-md bg-secondary text-xs font-mono font-medium text-muted-foreground border border-border">
              TIFF
            </span>
            <p className="text-xs text-muted-foreground">Max file size: 20MB</p>
          </div>
        </div>
      ) : (
        <div className="border border-primary/30 rounded-xl p-4 bg-primary/5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <FileImage className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{selectedFile.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB · TIFF
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={clearFile} className="flex-shrink-0 hover:text-destructive">
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {fileError && (
        <div className="mt-3 flex items-center gap-2 text-destructive text-sm bg-destructive/10 border border-destructive/20 rounded-lg p-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{fileError}</span>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="mt-6 text-center">
          <p className="text-primary animate-pulse text-sm font-medium">Processing with AI model...</p>
        </div>
      )}

      {/* Before / After comparison */}
      {noisyUrl && cleanUrl && (
        <div className="mt-8 flex flex-col sm:flex-row gap-6 justify-center items-center">
          {/* Original */}
          <div className="flex flex-col items-center gap-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Original</p>
            <img
              src={noisyUrl}
              alt="Original fingerprint"
              className="w-56 h-56 object-contain rounded-xl border border-border bg-secondary"
            />
            <a
              href={noisyUrl}
              download="original_fingerprint.tiff"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Download Original
            </a>
          </div>

          {/* Arrow */}
          <div className="text-2xl text-primary font-bold sm:mt-10">→</div>

          {/* Restored */}
          <div className="flex flex-col items-center gap-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Restored</p>
            <img
              src={cleanUrl}
              alt="Restored fingerprint"
              className="w-56 h-56 object-contain rounded-xl border border-primary/40 bg-secondary shadow-[0_0_20px_rgba(0,255,255,0.1)]"
            />
            <a
              href={cleanUrl}
              download="restored_fingerprint.png"
              className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Download Restored
            </a>
          </div>
        </div>
      )}
    </div>
  );
}