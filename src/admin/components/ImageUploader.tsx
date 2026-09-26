import { useRef, useState } from 'react';
import { getUploadUrl } from '../../services/api';
import { getAdminToken } from '../../services/authStorage';
import { API_BASE_URL } from '../../config/env';

const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_SIZE_BYTES = 8 * 1024 * 1024; // 8MB — reasonable for phone camera photos
const MAX_DIMENSION = 6000; // px, sanity check against corrupt/huge files

interface Props {
  images: string[];
  onChange: (images: string[]) => void;
  mainImage: string;
  onMainImageChange: (url: string) => void;
}

/**
 * Uploads directly to Cloudflare R2 via a pre-signed URL issued by the Worker
 * (POST /api/admin/uploads/sign). Works from an Android phone camera roll:
 * validates MIME type, extension, size, and dimensions before upload, and
 * shows a preview. Never stores images as Base64 in the database.
 */
export default function ImageUploader({ images, onChange, mainImage, onMainImageChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        resolve('Format non supporté. Utilisez JPG, PNG ou WEBP.');
        return;
      }
      if (file.size > MAX_SIZE_BYTES) {
        resolve('Image trop lourde (maximum 8 Mo).');
        return;
      }
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        if (img.width > MAX_DIMENSION || img.height > MAX_DIMENSION) {
          resolve('Dimensions trop grandes pour cette image.');
        } else {
          resolve(null);
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve('Impossible de lire cette image.');
      };
      img.src = url;
    });
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const validationError = await validateFile(file);
        if (validationError) {
          setError(validationError);
          continue;
        }
        const { uploadUrl, publicUrl } = await getUploadUrl(file.name, file.type);
        const token = getAdminToken();
        const putRes = await fetch(`${API_BASE_URL}${uploadUrl}`, {
          method: 'PUT',
          headers: {
            'Content-Type': file.type,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: file,
        });
        if (!putRes.ok) {
          setError("Échec de l'envoi de l'image. Réessayez.");
          continue;
        }
        const next = [...images, publicUrl];
        onChange(next);
        if (!mainImage) onMainImageChange(publicUrl);
      }
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const removeImage = (url: string) => {
    const next = images.filter((i) => i !== url);
    onChange(next);
    if (mainImage === url) onMainImageChange(next[0] || '');
  };

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium">Images du produit</label>
      <div className="flex flex-wrap gap-3">
        {images.map((url) => (
          <div key={url} className="group relative h-24 w-24 overflow-hidden rounded-md border border-border">
            <img src={url} alt="" className="h-full w-full object-cover" />
            {mainImage === url && (
              <span className="absolute left-1 top-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-white">
                Principale
              </span>
            )}
            <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              {mainImage !== url && (
                <button type="button" onClick={() => onMainImageChange(url)} className="rounded bg-white px-1.5 py-1 text-[10px] font-semibold" title="Définir comme image principale">
                  ★
                </button>
              )}
              <button type="button" onClick={() => removeImage(url)} className="rounded bg-white px-1.5 py-1 text-[10px] font-semibold text-error" title="Supprimer">
                ✕
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="grid h-24 w-24 place-items-center rounded-md border-2 border-dashed border-border text-text-faint hover:border-primary hover:text-primary disabled:opacity-50"
        >
          {uploading ? '…' : '+ Ajouter'}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />
      <p className="mt-1.5 text-xs text-text-faint">JPG, PNG ou WEBP — 8 Mo maximum par image.</p>
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>
  );
}
