// 📄 src/services/productService.js
import { supabase } from "../config/supabase";
import { allProducts } from "../data/products";

/**
 * Normalise un produit brut venant de Supabase ou des données locales.
 */
export const normalizeProduct = (p) => ({
  ...p,
  priceRange: p.price_range || p.priceRange || "",
  tags: Array.isArray(p.tags) ? p.tags : [],
  items: Array.isArray(p.items) ? p.items : [],
  variants: Array.isArray(p.variants) ? p.variants : [],
  image: p.image || "",
});

/**
 * Récupère tous les produits depuis Supabase, avec fallback sur les données locales si hors ligne ou erreur.
 */
export const fetchProducts = async () => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("name");

    if (error) throw error;

    if (data && data.length > 0) {
      // Déduplication par ID
      const uniqueMap = new Map();
      data.forEach((p) => {
        if (!uniqueMap.has(p.id)) {
          uniqueMap.set(p.id, normalizeProduct(p));
        }
      });
      return { products: Array.from(uniqueMap.values()), isOnline: true };
    }

    // Si table vide, retourne le fallback local groupé (femme + homme)
    const localAll = [...allProducts.women, ...allProducts.men];
    return { products: localAll.map(normalizeProduct), isOnline: false };
  } catch (error) {
    console.warn("⚠️ Mode hors ligne ou erreur Supabase, utilisation du catalogue local:", error.message);
    const localAll = [...allProducts.women, ...allProducts.men];
    return { products: localAll.map(normalizeProduct), isOnline: false };
  }
};

/**
 * Insère ou met à jour un produit dans Supabase.
 */
export const saveProductToSupabase = async (product, isEditing = false) => {
  const payload = {
    id: product.id.trim(),
    name: product.name.trim(),
    category: product.category,
    description: product.description || "",
    emoji: product.emoji || "✨",
    image: product.image || "",
    tags: product.tags || [],
    price: product.price ?? null,
    price_range: product.priceRange || null,
    items: product.items || [],
    variants: product.variants || [],
    popularity: product.popularity || "",
    color: product.color || "from-pink-400 to-rose-400",
    ...(isEditing ? { updated_at: new Date().toISOString() } : {}),
  };

  if (isEditing) {
    const { data, error } = await supabase
      .from("products")
      .update(payload)
      .eq("id", payload.id)
      .select();

    if (error) throw error;
    return data ? data.map(normalizeProduct) : [];
  } else {
    const { data, error } = await supabase
      .from("products")
      .insert([payload])
      .select();

    if (error) throw error;
    return data ? data.map(normalizeProduct) : [];
  }
};

/**
 * Supprime un produit de Supabase.
 */
export const deleteProductFromSupabase = async (id) => {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
};
