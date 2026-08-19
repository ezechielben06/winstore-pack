// 📄 src/config/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Variables Supabase manquantes. Vérifie ton fichier .env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ✅ Fonction pour initialiser les produits (sans doublons)
export const initializeProducts = async (localProducts) => {
  try {
    // ✅ Vérifier combien de produits existent déjà
    const { count, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.warn('⚠️ Erreur lors du comptage:', countError);
      return;
    }
    
    // ✅ Si des produits existent déjà, ne rien faire
    if (count > 0) {
      console.log(`✅ ${count} produits déjà présents dans Supabase (pas d'insertion)`);
      return;
    }
    
    // ✅ Si la table est vide, insérer les produits
    console.log('📦 Initialisation des produits dans Supabase...');
    
    const products = [...localProducts.women, ...localProducts.men];
    
    const formatted = products.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      price: p.price || null,
      price_range: p.priceRange || null,
      description: p.description || '',
      emoji: p.emoji || '✨',
      image: p.image || '',
      tags: p.tags || [],
      popularity: p.popularity || '',
      color: p.color || 'from-pink-400 to-rose-400',
      variants: p.variants || [],
      items: p.items || [],
    }));
    
    const batchSize = 50;
    for (let i = 0; i < formatted.length; i += batchSize) {
      const batch = formatted.slice(i, i + batchSize);
      const { error } = await supabase
        .from('products')
        .insert(batch);
      
      if (error) {
        console.error('❌ Erreur d\'insertion du lot:', error);
        throw error;
      }
      console.log(`✅ Lot ${Math.floor(i / batchSize) + 1} inséré (${batch.length} produits)`);
    }
    
    console.log(`✅ ${formatted.length} produits initialisés dans Supabase`);
  } catch (error) {
    console.error('❌ Erreur d\'initialisation:', error);
  }
};

export default supabase;