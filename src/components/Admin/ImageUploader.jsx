// 📄 src/components/Admin/ImageUploader.jsx - Version corrigée
import { useState } from 'react';
import { Upload, X, Image, Check, AlertCircle, Camera } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ImageUploader = ({ onImageUpload, currentImage }) => {
  const { isDark } = useTheme();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false); // ✅ setSuccess
  const [preview, setPreview] = useState(currentImage ? `/images/${currentImage}` : null);

  const handleFileSelect = (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner une image');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("L'image ne doit pas dépasser 5MB");
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(false);

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setUploading(false);
        setSuccess(true); // ✅ Utiliser setSuccess

        const ext = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

        if (onImageUpload) {
          onImageUpload(fileName);
        }

        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      }
    }, 100);
  };

  const handleButtonClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
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
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            {currentImage && !preview.startsWith('data:') && (
              <p className="text-xs text-gray-400 mt-1 truncate">
                📁 {currentImage}
              </p>
            )}
          </div>
        ) : (
          <div className="py-4">
            <Camera className="w-12 h-12 mx-auto text-gray-400 mb-2" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              📸 Prendre une photo
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              ou choisir dans la galerie
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
              Téléchargement...
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
            <p className="text-xs text-gray-400 mt-1">{uploadProgress}%</p>
          </div>
        )}

        {success && (
          <div className="mt-3 flex items-center justify-center gap-2 text-green-500 text-sm">
            <Check className="w-4 h-4" />
            Image téléchargée !
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
            Les images sont sauvegardées dans <span className="font-mono bg-gray-200 dark:bg-[#2a2a4a] px-1.5 py-0.5 rounded">public/images/</span>
          </span>
        </p>
      </div>
    </div>
  );
};

export default ImageUploader;