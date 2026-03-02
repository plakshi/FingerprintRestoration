import { useCallback, useRef, useState } from 'react';
import { Upload, FileImage, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

const ACCEPTED = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
const MAX_SIZE = 20 * 1024 * 1024; // 20MB

export default function FileUploader({ onFileSelect, disabled }: FileUploaderProps) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndSet = (file: File) => {
    setFileError('');
    if (!ACCEPTED.includes(file.type)) {
      setFileError('Invalid file type. Please upload PNG, JPG, JPEG, or PDF.');
      return;
    }
    if (file.size > MAX_SIZE) {
      setFileError('File too large. Maximum size is 20MB.');
      return;
    }
    setSelectedFile(file);
    onFileSelect(file);
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
            ${dragOver
              ? 'border-primary bg-primary/10 scale-[1.01]'
              : 'border-border hover:border-primary/50 hover:bg-primary/5'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".png,.jpg,.jpeg,.pdf"
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
            <div className="flex gap-2 flex-wrap justify-center">
              {['PNG', 'JPG', 'JPEG', 'PDF'].map(fmt => (
                <span key={fmt} className="px-2.5 py-1 rounded-md bg-secondary text-xs font-mono font-medium text-muted-foreground border border-border">
                  {fmt}
                </span>
              ))}
            </div>
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
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB · {selectedFile.type.split('/')[1].toUpperCase()}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={clearFile}
            className="flex-shrink-0 hover:text-destructive"
          >
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
    </div>
  );
}
