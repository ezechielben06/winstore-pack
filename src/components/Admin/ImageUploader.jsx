// 📄 src/components/Admin/ImageUploader.jsx
import { useState } from 'react';
import { Upload, X, Image, Check, AlertCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ImageUploader = ({ onImageUpload, currentImage }) => {
  const { isDark } = useTheme();
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFiles = async (files) => {
    const file = files[0];
    
    // Vérifier le type
    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner une image');
      return;
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('L\'image ne doit pas dépasser 5MB');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(false);

    try {
      // Simuler l'upload (dans la réalité, tu enverrais à un serveur)
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Créer une URL locale pour l'image
      const imageUrl = URL.createObjectURL(file);
      
      // Simuler le nom du fichier
      const fileName = file.name.toLowerCase().replace(/[^a-z0-9.]/g, '');
      
      setSuccess(true);
      setUploadProgress(100);
      
      // Appeler le callback avec le nom du fichier
      if (onImageUpload) {
        onImageUpload(fileName);
      }
      
      setTimeout(() => {
        setUploading(false);
        setSuccess(false);
        setUploadProgress(0);
      }, 2000);

    } catch (err) {
      setError('Erreur lors de l\'upload');
      setUploading(false);
    }
  };

  const reset = () => {
    setError(null);
    setSuccess(false);
    setUploadProgress(0);
  };

  return (
    <div className="space-y-4">
      {/* Zone de dépôt */}
      <div
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
          dragActive 
            ? 'border-gold bg-gold/5' 
            : isDark 
              ? 'border-[#2d3748] hover:border-gold/50' 
              : 'border-gray-300 hover:border-gold/50'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />

        <div className="flex flex-col items-center gap-3">
          {currentImage ? (
            <div className="relative w-32 h-32 rounded-xl overflow-hidden">
              <img 
                src={`/images/${currentImage}`} 
                alt="Aperçu"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%23f0f0f0"/><text x="50" y="55" text-anchor="middle" fill="%23999" font-size="12">Image</text></svg>';
                }}
              />
            </div>
          ) : (
            <Image className={`w-12 h-12 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
          )}

          <div>
            <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {currentImage ? 'Image actuelle' : 'Déposez votre image ici'}
            </p>
            <p className="text-xs text-gray-400">
              ou cliquez pour parcourir • JPG, PNG, WebP • Max 5MB
            </p>
            {currentImage && (
              <p className="text-xs text-gold font-medium mt-1">
                📁 {currentImage}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Barre de progression */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Upload en cours...</span>
            <span className="text-gray-500">{uploadProgress}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-[#2a2a4a] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gold rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Message de succès */}
      {success && (
        <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-500/10 rounded-xl border border-green-200 dark:border-green-500/20">
          <Check className="w-4 h-4 text-green-500" />
          <span className="text-sm text-green-600 dark:text-green-400">Image téléchargée avec succès !</span>
        </div>
      )}

      {/* Message d'erreur */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-500/10 rounded-xl border border-red-200 dark:border-red-500/20">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
          <button onClick={() => setError(null)} className="ml-auto">
            <X className="w-4 h-4 text-red-400" />
          </button>
        </div>
      )}

      {/* Instructions */}
      <div className={`p-4 rounded-xl ${isDark ? 'bg-[#141425]' : 'bg-gray-50'} border ${isDark ? 'border-[#2d3748]' : 'border-gray-200'}`}>
        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
          <span>💡</span>
          <span>
            Placez manuellement les images dans le dossier <span className="font-mono bg-gray-200 dark:bg-[#2a2a4a] px-1.5 py-0.5 rounded">public/images/</span>
          </span>
        </p>
      </div>
    </div>
  );
};

export default ImageUploader;