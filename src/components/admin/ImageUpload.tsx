import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Trash2, Loader2, ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  hint?: string;
}

/**
 * Re-encodes an uploaded picture to WebP at a sane display width before it ever
 * reaches storage. Article covers are shown at ~380–760 CSS px, so multi-hundred
 * KB originals were being downloaded in full by every visitor. Output is visually
 * identical at the sizes the site actually renders.
 */
const MAX_UPLOAD_WIDTH = 1600;
const WEBP_QUALITY = 0.82;

async function optimizeImage(file: File): Promise<{ blob: Blob; ext: string; type: string }> {
  const passthrough = { blob: file, ext: file.name.split(".").pop() || "png", type: file.type };
  // SVG/GIF must keep their original encoding (vectors / animation).
  if (!/^image\/(png|jpeg|jpg|webp)$/i.test(file.type)) return passthrough;
  if (typeof createImageBitmap !== "function") return passthrough;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_UPLOAD_WIDTH / bitmap.width);
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return passthrough;
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close?.();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", WEBP_QUALITY),
    );
    // Only take the re-encode when it is actually smaller.
    if (!blob || blob.size >= file.size) return passthrough;
    return { blob, ext: "webp", type: "image/webp" };
  } catch {
    return passthrough;
  }
}

export function ImageUpload({ label, value, onChange, folder = "misc", hint }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Skedari është më i madh se 5 MB");
      return;
    }
    setUploading(true);
    try {
      const optimized = await optimizeImage(file);
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${optimized.ext}`;
      const { error } = await supabase.storage.from("site-images").upload(path, optimized.blob, {
        // Paths are unique per upload, so they can be cached for a year.
        cacheControl: "31536000, immutable",
        upsert: false,
        contentType: optimized.type,
      });
      if (error) throw error;
      const { data } = supabase.storage.from("site-images").getPublicUrl(path);
      onChange(data.publicUrl);
      toast.success("Imazhi u ngarkua");
    } catch (e: any) {
      toast.error(e.message || "Ngarkimi dështoi");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };


  return (
    <div className="rounded-xl border border-border/60 bg-background/60 p-3">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-xs font-medium">{label}</div>
        {hint && <div className="text-[10px] text-muted-foreground">{hint}</div>}
      </div>
      <div className="flex items-center gap-3">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-border bg-muted flex items-center justify-center">
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImageIcon className="h-6 w-6 text-muted-foreground/60" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs hover:bg-muted disabled:opacity-50"
            >
              {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
              {uploading ? "Duke ngarkuar..." : value ? "Ndrysho" : "Ngarko"}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" /> Hiq
              </button>
            )}
          </div>
          {value && (
            <div className="mt-1.5 truncate text-[10px] text-muted-foreground" title={value}>{value}</div>
          )}
        </div>
      </div>
    </div>
  );
}
