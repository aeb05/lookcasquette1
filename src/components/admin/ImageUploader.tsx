import { useState, useRef } from "react";
import apiClient from "@/lib/api";
import { toast } from "sonner";
import { Upload, Loader2, X, ImagePlus } from "lucide-react";
import imageCompression from "browser-image-compression";

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  compact?: boolean;
}

export const ImageUploader = ({ label, value, onChange, onRemove, compact }: ImageUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    setUploading(true);
    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
      });

      const result = await apiClient.uploadImage(compressed);
      onChange(result.url);
      toast.success("Image uploadée");
    } catch (error) {
      toast.error("Erreur lors de l'upload");
      console.error(error);
    }
    setUploading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
    e.target.value = "";
  };

  if (compact) {
    return (
      <div className="relative group">
        <input ref={inputRef} type="file" accept="image/*" onChange={handleChange} className="hidden" />
        {value ? (
          <div className="relative w-20 h-20 rounded-md overflow-hidden border border-border">
            <img src={value} alt="" className="w-full h-full object-cover" />
            {onRemove && (
              <button onClick={onRemove} className="absolute top-0.5 right-0.5 bg-background/80 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <X size={12} />
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="w-20 h-20 rounded-md border border-dashed border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors"
          >
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      <label className="text-sm text-muted-foreground mb-1 block">{label}</label>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleChange} className="hidden" />
      {value ? (
        <div className="relative group w-full aspect-video rounded-lg overflow-hidden border border-border bg-secondary/30">
          <img src={value} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button onClick={() => inputRef.current?.click()} disabled={uploading}
              className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-xs font-display tracking-wider">
              {uploading ? <Loader2 size={14} className="animate-spin" /> : "CHANGER"}
            </button>
            {onRemove && (
              <button onClick={onRemove} className="px-3 py-1.5 bg-destructive text-destructive-foreground rounded-md text-xs font-display tracking-wider">
                SUPPRIMER
              </button>
            )}
          </div>
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full aspect-video rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
        >
          {uploading ? (
            <Loader2 size={24} className="animate-spin" />
          ) : (
            <>
              <Upload size={24} />
              <span className="text-sm">Cliquer pour uploader</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};
