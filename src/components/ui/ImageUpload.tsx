import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from './button';
import { uploadImage, deleteImage } from '@/lib/supabase';
import { toast } from 'sonner';

interface ImageUploadProps {
  value: string | string[];
  onChange: (url: string | string[]) => void;
  multiple?: boolean;
  bucket?: string;
  maxSize?: number; // in bytes, default 5MB
}

export function ImageUpload({ 
  value, 
  onChange, 
  multiple = false, 
  bucket = 'media',
  maxSize = 5 * 1024 * 1024 
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const images = Array.isArray(value) ? value : (value ? [value] : []);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true);
    try {
      const uploadPromises = acceptedFiles.map(file => uploadImage(file, bucket));
      const newUrls = await Promise.all(uploadPromises);
      
      const validUrls = newUrls.filter((url): url is string => url !== null);
      
      if (validUrls.length > 0) {
        if (multiple) {
          onChange([...images, ...validUrls]);
        } else {
          onChange(validUrls[0]);
        }
        toast.success('Image(s) uploaded successfully');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to upload image(s)';
      toast.error(message);
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  }, [bucket, images, multiple, onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/svg+xml': ['.svg'],
      'image/webp': ['.webp']
    },
    maxSize,
    multiple
  } as any);

  const handleRemove = async (urlToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteImage(urlToRemove, bucket);
      if (multiple) {
        onChange(images.filter(url => url !== urlToRemove));
      } else {
        onChange('');
      }
      toast.success('Image removed');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to remove image';
      toast.error(message);
      console.error(error);
    }
  };

  return (
    <div className="space-y-4">
      <div 
        {...getRootProps()} 
        data-testid={`image-upload-dropzone-${bucket}`}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-secondary/5'}
          ${isUploading ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <input {...getInputProps()} data-testid={`image-upload-input-${bucket}`} />
        <div className="flex flex-col items-center justify-center gap-2">
          {isUploading ? (
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
          ) : (
            <UploadCloud className="h-10 w-10 text-muted-foreground" />
          )}
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {isUploading ? 'Uploading...' : 'Click or drag images here'}
            </p>
            <p className="text-xs text-muted-foreground">
              SVG, PNG, JPG or WEBP (max. 5MB)
            </p>
          </div>
        </div>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((url, index) => (
            <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-border group bg-secondary/20">
              <img 
                src={url} 
                alt={`Uploaded ${index}`} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="rounded-full h-8 w-8"
                  onClick={(e) => handleRemove(url, e)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
