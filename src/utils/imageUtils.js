// 📄 src/utils/imageUtils.js

/**
 * Normalise et résout l'URL d'une image de produit ou de pack.
 * Gère les URLs absolues (Supabase/http), les chemins absolus (/) et les noms de fichiers locaux (images/).
 */
export const getProductImageUrl = (image) => {
  if (!image || typeof image !== "string") return null;
  const trimmed = image.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("data:")) {
    return trimmed;
  }
  if (trimmed.startsWith("/")) {
    return trimmed;
  }
  if (trimmed.startsWith("images/")) {
    return `/${trimmed}`;
  }
  return `/images/${trimmed}`;
};
