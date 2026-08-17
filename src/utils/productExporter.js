// 📄 src/utils/productExporter.js - Version avec variantes

/**
 * Génère le code JavaScript pour le fichier products.js
 */
export const generateExportCode = (products) => {
  // Séparer les produits
  const womenProds = products.filter(p => 
    p.id?.startsWith('w') || (p.category === 'product' && !p.id?.startsWith('m'))
  );
  const womenPacksData = products.filter(p => 
    p.id?.startsWith('p') || (p.category === 'pack' && !p.id?.startsWith('mp'))
  );
  const menProds = products.filter(p => 
    p.id?.startsWith('m') && !p.id?.startsWith('mp')
  );
  const menPacksData = products.filter(p => 
    p.id?.startsWith('mp')
  );

  const formatArray = (arr, isPack = false) => {
    if (arr.length === 0) return '[]';
    
    return `[\n${arr.map(p => {
      const entries = [];
      
      // Ordre des propriétés
      const order = ['id', 'name', 'category', 'price', 'priceRange', 'description', 'emoji', 'image', 'tags', 'popularity', 'color'];
      if (isPack) order.push('items');
      // ✅ Ajouter variants si présent
      if (p.variants && p.variants.length > 0) {
        order.push('variants');
      }
      
      order.forEach(key => {
        if (p[key] !== undefined && p[key] !== null && p[key] !== '') {
          if (Array.isArray(p[key])) {
            if (key === 'variants') {
              // ✅ Formatage spécial pour les variantes
              entries.push(`  variants: [\n${p[key].map(v => {
                const vEntries = [];
                ['id', 'name', 'value', 'price', 'image', 'stock'].forEach(vk => {
                  if (v[vk] !== undefined && v[vk] !== null && v[vk] !== '') {
                    if (typeof v[vk] === 'number') {
                      vEntries.push(`    ${vk}: ${v[vk]}`);
                    } else {
                      vEntries.push(`    ${vk}: '${v[vk]}'`);
                    }
                  }
                });
                return `    {\n${vEntries.join(',\n')}\n    }`;
              }).join(',\n')}\n  ]`);
            } else {
              entries.push(`  ${key}: [${p[key].map(v => `'${v}'`).join(', ')}]`);
            }
          } else if (typeof p[key] === 'number') {
            entries.push(`  ${key}: ${p[key]}`);
          } else if (typeof p[key] === 'string' && p[key].includes('from-')) {
            entries.push(`  ${key}: '${p[key]}'`);
          } else if (p[key] === true || p[key] === false) {
            entries.push(`  ${key}: ${p[key]}`);
          } else {
            entries.push(`  ${key}: '${p[key]}'`);
          }
        }
      });
      
      return `  {\n${entries.join(',\n')}\n  }`;
    }).join(',\n')}\n]`;
  };

  return `// ========== PRODUITS FEMME ==========
export const womenProducts = ${formatArray(womenProds)};

// ========== PACKS FEMME ==========
export const womenPacks = ${formatArray(womenPacksData, true)};

// ========== PRODUITS HOMME ==========
export const menProducts = ${formatArray(menProds)};

// ========== PACKS HOMME ==========
export const menPacks = ${formatArray(menPacksData, true)};

// Export combiné
export const allProducts = {
  women: [...womenProducts, ...womenPacks],
  men: [...menProducts, ...menPacks],
};`;
};

/**
 * Télécharge le fichier products.js
 */
export const downloadProductsFile = (products) => {
  const code = generateExportCode(products);
  const blob = new Blob([code], { type: 'text/javascript' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'products.js';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};