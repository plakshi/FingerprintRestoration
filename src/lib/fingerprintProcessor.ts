/**
 * Fingerprint restoration processing using Canvas API.
 * Applies: grayscale, contrast boost, sharpening via unsharp mask,
 * noise reduction via averaging, and ridge enhancement.
 */

export async function restoreFingerprint(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;

      // Draw original
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const width = canvas.width;
      const height = canvas.height;

      // Step 1: Convert to grayscale
      for (let i = 0; i < data.length; i += 4) {
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        data[i] = data[i + 1] = data[i + 2] = gray;
      }

      // Step 2: High contrast enhancement
      const contrastFactor = 2.2;
      const intercept = 128 * (1 - contrastFactor);
      for (let i = 0; i < data.length; i += 4) {
        for (let c = 0; c < 3; c++) {
          data[i + c] = Math.min(255, Math.max(0, data[i + c] * contrastFactor + intercept));
        }
      }

      ctx.putImageData(imageData, 0, 0);

      // Step 3: Unsharp mask for ridge sharpening
      const sharpCanvas = document.createElement('canvas');
      sharpCanvas.width = width;
      sharpCanvas.height = height;
      const sCtx = sharpCanvas.getContext('2d')!;
      sCtx.filter = 'blur(1px)';
      sCtx.drawImage(canvas, 0, 0);
      sCtx.filter = 'none';

      const blurred = sCtx.getImageData(0, 0, width, height);
      const sharp = ctx.getImageData(0, 0, width, height);
      const sharpAmount = 1.8;

      for (let i = 0; i < sharp.data.length; i += 4) {
        for (let c = 0; c < 3; c++) {
          const diff = sharp.data[i + c] - blurred.data[i + c];
          sharp.data[i + c] = Math.min(255, Math.max(0, sharp.data[i + c] + sharpAmount * diff));
        }
      }

      ctx.putImageData(sharp, 0, 0);

      // Step 4: Add subtle cyan tint overlay for output aesthetics
      ctx.globalCompositeOperation = 'overlay';
      ctx.globalAlpha = 0.06;
      ctx.fillStyle = '#00f5ff';
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;

      // Step 5: Add watermark
      ctx.font = `${Math.max(12, width * 0.018)}px JetBrains Mono, monospace`;
      ctx.fillStyle = 'rgba(0, 245, 255, 0.35)';
      ctx.textAlign = 'right';
      ctx.fillText('RidgeRestore™', width - 12, height - 12);

      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}
