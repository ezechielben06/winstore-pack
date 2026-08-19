// 📄 src/config/supabase.js

// ✅ Modifier la fonction initializeProducts
export const initializeProducts = async (localProducts) => {
  try {
    // Vérifier si la table a la colonne priceRange
    const { error: checkError } = await supabase
      .from('products')
      .select('priceRange')
      .limit(1);
    
    if (checkError && checkError.message.includes('priceRange')) {
      console.warn('⚠️ Colonne priceRange manquante, utilisation des données sans priceRange');
    }
    
    const { count } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
    
    if (count === 0) {
      console.log('📦 Initialisation des produits dans Supabase...');
      
      const products = [...localProducts.women, ...localProducts.men];
      
      const formatted = products.map(p => ({
        ...p,
        price_range: p.priceRange || null, // ✅ Utiliser price_range au lieu de priceRange
        tags: p.tags || [],
        items: p.items || [],
        variants: p.variants || [],
      }));
      
      const batchSize = 50;
      for (let i = 0; i < formatted.length; i += batchSize) {
        const batch = formatted.slice(i, i + batchSize);
        const { error } = await supabase
          .from('products')
          .insert(batch);
        
        if (error) throw error;
      }
      
      console.log(`✅ ${formatted.length} produits initialisés`);
    }
  } catch (error) {
    console.error('❌ Erreur d\'initialisation:', error);
  }
};