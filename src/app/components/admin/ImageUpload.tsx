import React, { useCallback, useState } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../ui/utils';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove: () => void;
  disabled?: boolean;
  maxSizeInMB?: number;
  acceptedFormats?: string[];
  onUpload?: (file: File) => Promise<string>;
  uploadProgress?: number;
}

const DEFAULT_MAX_SIZE_MB = 5;
const DEFAULT_ACCEPTED_FORMATS = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export function ImageUpload({
  value,
  onChange,
  onRemove,
  disabled,
  maxSizeInMB = DEFAULT_MAX_SIZE_MB,
  acceptedFormats = DEFAULT_ACCEPTED_FORMATS,
  onUpload,
  uploadProgress,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const isDisabled = disabled || isUploading;

  const validateFile = useCallback((file: File): string | null => {
    // Validate file type
    if (!acceptedFormats.includes(file.type)) {
      return `Invalid file type. Please upload: ${acceptedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')}`;
    }

    // Validate file size
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      return `File size exceeds ${maxSizeInMB}MB limit`;
    }

    return null;
  }, [acceptedFormats, maxSizeInMB]);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDisabled) {
      setIsDragging(true);
    }
  }, [isDisabled]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (isDisabled) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      handleFile(file);
    }
  }, [isDisabled]);

  const handleFile = useCallback(async (file: File) => {
    // Clear previous errors
    setError('');

    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (onUpload) {
      setIsUploading(true);
      try {
        onChange(await onUpload(file));
      } catch (uploadError) {
        setError(
          uploadError instanceof Error
            ? uploadError.message
            : 'Failed to upload image. Please try again.'
        );
      } finally {
        setIsUploading(false);
      }
      return;
    }

    // Create a preview URL for the selected file
    const reader = new FileReader();
    reader.onloadend = () => {
      onChange(reader.result as string);
    };
    reader.onerror = () => {
      setError('Failed to read file. Please try again.');
    };
    reader.readAsDataURL(file);
  }, [onChange, onUpload, validateFile]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      handleFile(file);
    }
  }, [handleFile]);

  const handleButtonClick = useCallback(() => {
    if (!isDisabled) {
      fileInputRef.current?.click();
    }
  }, [isDisabled]);

  const handleRemove = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setError('');
    onRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onRemove]);

  return (
    <div className="space-y-4">
      {value ? (
        <div className="relative rounded-lg border-2 border-dashed border-border bg-muted/10 p-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <img
              src={value}
              alt="Preview"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute right-2 top-2"
            onClick={handleRemove}
            disabled={isDisabled}
            aria-label="Remove image"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/10 p-8 transition-colors',
            isDragging && 'border-primary bg-primary/5',
            isDisabled && 'cursor-not-allowed opacity-50',
            error && 'border-destructive'
          )}
          onClick={handleButtonClick}
          role="button"
          tabIndex={isDisabled ? -1 : 0}
          aria-label="Upload image"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleButtonClick();
            }
          }}
        >
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <div className={cn(
              'flex h-16 w-16 items-center justify-center rounded-full bg-muted',
              isDragging && 'bg-primary/10',
              error && 'bg-destructive/10'
            )}>
              {isDragging ? (
                <ImageIcon className="h-8 w-8 text-primary" />
              ) : (
                <Upload className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                {isUploading
                  ? 'Uploading image...'
                  : isDragging
                    ? 'Drop image here'
                    : 'Drag and drop an image here'}
              </p>
              {isUploading && uploadProgress !== undefined && (
                <p className="text-xs text-muted-foreground">{uploadProgress}%</p>
              )}
              <p className="text-xs text-muted-foreground">
                or click to browse files
              </p>
              <p className="text-xs text-muted-foreground">
                Max size: {maxSizeInMB}MB • Formats: JPEG, PNG, WebP, GIF
              </p>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedFormats.join(',')}
            onChange={handleFileInputChange}
            className="hidden"
            disabled={isDisabled}
            aria-label="File input"
          />
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
