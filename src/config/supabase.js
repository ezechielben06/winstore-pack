// 📄 src/config/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Variables Supabase manquantes. Vérifie ton fichier .env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ✅ Fonction pour initialiser les produits
export const initializeProducts = async (localProducts) => {
  try {
    const { count } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
    
    if (count === 0) {
      console.log('📦 Initialisation des produits dans Supabase...');
      
      const products = [...localProducts.women, ...localProducts.men];
      
      const formatted = products.map(p => ({
        ...p,
        tags: p.tags || [],
        items: p.items || [],
        variants: p.variants || [],
      }));
      
      const batchSize = 100;
      for (let i = 0; i < formatted.length; i += batchSize) {
        const batch = formatted.slice(i, i + batchSize);
        const { error } = await supabase
          .from('products')
          .insert(batch);
        
        if (error) throw error;
      }
      
      console.log('✅ Produits initialisés dans Supabase');
    }
  } catch (error) {
    console.error('❌ Erreur d\'initialisation:', error);
  }
};