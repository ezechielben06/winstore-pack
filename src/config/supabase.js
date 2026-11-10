// 📄 src/config/supabase.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Variables Supabase manquantes. Vérifie ton fichier .env");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ✅ Initialise les produits SI la table est vide (à appeler une seule fois)
export const initializeProducts = async (localProducts) => {
  try {
    const { count, error: countError } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true });

    if (countError) {
      console.warn("⚠️ Erreur lors du comptage:", countError);
      return false;
    }

    if (count > 0) {
      console.log(`✅ ${count} produits déjà présents (pas d'insertion)`);
      return false;
    }

    console.log("📦 Initialisation des produits dans Supabase...");

    const products = [...localProducts.women, ...localProducts.men];

    const formatted = products.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      price: p.price ?? null,
      price_range: p.priceRange ?? null,
      description: p.description || "",
      emoji: p.emoji || "✨",
      image: p.image || "",
      tags: p.tags || [],
      popularity: p.popularity || "",
      color: p.color || "from-pink-400 to-rose-400",
      variants: p.variants || [],
      items: p.items || [],
    }));

    // ✅ Insertion par lots de 50
    const BATCH_SIZE = 50;
    for (let i = 0; i < formatted.length; i += BATCH_SIZE) {
      const batch = formatted.slice(i, i + BATCH_SIZE);
      const { error } = await supabase.from("products").insert(batch);
      if (error) throw error;
      console.log(
        `✅ Lot ${Math.floor(i / BATCH_SIZE) + 1} inséré (${
          batch.length
        } produits)`
      );
    }

    console.log(`✅ ${formatted.length} produits initialisés`);
    return true;
  } catch (error) {
    console.error("❌ Erreur d'initialisation:", error);
    return false;
  }
};

export default supabase;