// 📄 src/components/Admin/ImageUploader.jsx - Avec compression
import { useState } from 'react';
import { Upload, X, Check, AlertCircle, Camera } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { supabase } from '../../config/supabase';

const ImageUploader = ({ onImageUpload, currentImage }) => {
  const { isDark } = useTheme();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [preview, setPreview] = useState(currentImage || null);

  // ✅ Compression d'image
  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 600;
          const MAX_HEIGHT = 600;
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > MAX_WIDTH) {
              height = height * (MAX_WIDTH / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = width * (MAX_HEIGHT / height);
              height = MAX_HEIGHT;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            resolve(compressedFile);
          }, 'image/jpeg', 0.75);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const uploadToSupabase = async (file) => {
    try {
      const ext = file.name.split('.').pop().toLowerCase();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(fileName, file, {
          cacheControl: '31536000',
          upsert: false,
          contentType: 'image/jpeg',
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Erreur d\'upload:', error);
      throw error;
    }
  };

  const handleFileSelect = async (file) => {
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Format non supporté. Utilisez JPG, PNG, WEBP ou GIF');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("L'image ne doit pas dépasser 10MB");
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(false);

    try {
      // ✅ Compression de l'image
      const compressedFile = await compressImage(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(compressedFile);

      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
      }, 100);

      const imageUrl = await uploadToSupabase(compressedFile);
      
      clearInterval(interval);
      setUploadProgress(100);
      setUploading(false);
      setSuccess(true);

      setPreview(imageUrl);

      if (onImageUpload) {
        onImageUpload(imageUrl);
      }

      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setUploading(false);
      setError(err.message || 'Erreur lors de l\'upload');
    }
  };

  const handleButtonClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = false;
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        handleFileSelect(file);
      }
    };
    
    input.click();
  };

  const handleRemove = () => {
    setPreview(null);
    setSuccess(false);
    setError(null);
    if (onImageUpload) {
      onImageUpload('');
    }
  };

  return (
    <div className="space-y-3">
      <div
        className={`relative rounded-xl p-4 text-center transition-all ${
          uploading ? 'opacity-50 pointer-events-none' : ''
        } ${
          isDark 
            ? 'bg-[#2a2a4a] border border-[#2d3748]' 
            : 'bg-gray-50 border border-gray-200'
        }`}
      >
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Aperçu"
              className="w-full max-h-48 object-contain rounded-lg mx-auto"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect width="200" height="200" fill="%23f0f0f0"/%3E%3Ctext x="100" y="110" text-anchor="middle" fill="%23999" font-size="16"%3EImage%3C/text%3E%3C/svg%3E';
              }}
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            {currentImage && currentImage.includes('supabase.co') && (
              <p className="text-xs text-green-500 mt-1 truncate">
                ✅ Image sur Supabase Storage
              </p>
            )}
          </div>
        ) : (
          <div className="py-4">
            <Camera className="w-12 h-12 mx-auto text-gray-400 mb-2" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              📸 Choisir une image
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              JPG, PNG, WEBP • Max 10MB • Compression automatique
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={handleButtonClick}
          disabled={uploading}
          className={`w-full mt-3 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 text-sm ${
            isDark
              ? 'bg-gold/20 text-gold hover:bg-gold/30'
              : 'bg-gold text-gray-900 hover:bg-gold/90'
          } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {uploading ? (
            <>
              <span className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
              Upload en cours... {uploadProgress}%
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              {preview ? 'Changer l\'image' : 'Choisir une image'}
            </>
          )}
        </button>

        {uploading && (
          <div className="mt-3">
            <div className="w-full h-2 bg-gray-200 dark:bg-[#2a2a4a] rounded-full overflow-hidden">
              <div
                className="h-full bg-gold rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {success && (
          <div className="mt-3 flex items-center justify-center gap-2 text-green-500 text-sm animate-fade-in">
            <Check className="w-4 h-4" />
            Image uploadée avec succès !
          </div>
        )}

        {error && (
          <div className="mt-3 flex items-center justify-center gap-2 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
      </div>

      <div className={`p-3 rounded-xl ${isDark ? 'bg-[#141425]' : 'bg-gray-100'} border ${isDark ? 'border-[#2d3748]' : 'border-gray-200'}`}>
        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
          <span>💡</span>
          <span>
            Les images sont compressées automatiquement pour un chargement plus rapide
          </span>
        </p>
      </div>
    </div>
  );
};

export default ImageUploader; 