// 📄 src/utils/productExporter.js - Version avec variantes et échappement sécurisé

/**
 * ✅ Échappe une chaîne pour l'inclure dans un littéral JS simple quote ('...')
 * - Gère les apostrophes
 * - Gère les retours à la ligne
 * - Gère les backslashes
 */
const escapeString = (str) => {
  if (str === undefined || str === null) return '';
  return String(str)
    .replace(/\\/g, '\\\\')   // backslash d'abord
    .replace(/'/g, "\\'")     // apostrophes
    .replace(/\n/g, '\\n')    // retours ligne
    .replace(/\r/g, '\\r');   // retours chariot
};

/**
 * Génère le code JavaScript pour le fichier products.js
 */
export const generateExportCode = (products) => {
  // ✅ Séparation fiable par préfixe d'ID
  // Convention :
  //   w1, w2...   → produits femme
  //   p1, p2...   → packs femme
  //   m1, m2...   → produits homme (mais PAS mp...)
  //   mp1, mp2... → packs homme
  const womenProds = products.filter((p) => {
    const id = p.id || '';
    return id.startsWith('w');
  });

  const womenPacksData = products.filter((p) => {
    const id = p.id || '';
    return id.startsWith('p') && !id.startsWith('mp');
  });

  const menProds = products.filter((p) => {
    const id = p.id || '';
    return id.startsWith('m') && !id.startsWith('mp');
  });

  const menPacksData = products.filter((p) => {
    const id = p.id || '';
    return id.startsWith('mp');
  });

  const formatArray = (arr, isPack = false) => {
    if (arr.length === 0) return '[]';

    return `[\n${arr
      .map((p) => {
        const entries = [];

        // Ordre des propriétés
        const order = [
          'id',
          'name',
          'category',
          'price',
          'priceRange',
          'description',
          'emoji',
          'image',
          'tags',
          'popularity',
          'color',
        ];
        if (isPack) order.push('items');
        if (p.variants && p.variants.length > 0) order.push('variants');

        order.forEach((key) => {
          const value = p[key];
          if (value === undefined || value === null || value === '') return;

          if (Array.isArray(value)) {
            if (key === 'variants') {
              // ✅ Formatage des variantes avec échappement
              const variantsCode = value
                .map((v) => {
                  const vEntries = [];
                  ['id', 'name', 'value', 'price', 'image', 'stock', 'color'].forEach(
                    (vk) => {
                      const vv = v[vk];
                      if (vv === undefined || vv === null || vv === '') return;
                      if (typeof vv === 'number') {
                        vEntries.push(`    ${vk}: ${vv}`);
                      } else {
                        vEntries.push(`    ${vk}: '${escapeString(vv)}'`);
                      }
                    }
                  );
                  return `    {\n${vEntries.join(',\n')}\n    }`;
                })
                .join(',\n');
              entries.push(`  variants: [\n${variantsCode}\n  ]`);
            } else {
              // ✅ Tableau de strings (items, tags) avec échappement
              const arrayCode = value
                .map((v) => `'${escapeString(v)}'`)
                .join(', ');
              entries.push(`  ${key}: [${arrayCode}]`);
            }
          } else if (typeof value === 'number') {
            entries.push(`  ${key}: ${value}`);
          } else if (typeof value === 'boolean') {
            entries.push(`  ${key}: ${value}`);
          } else {
            // ✅ String (y compris color: 'from-...') avec échappement
            entries.push(`  ${key}: '${escapeString(value)}'`);
          }
        });

        return `  {\n${entries.join(',\n')}\n  }`;
      })
      .join(',\n')}\n]`;
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
};
`;
};

/**
 * Télécharge le fichier products.js
 */
export const downloadProductsFile = (products) => {
  const code = generateExportCode(products);
  const blob = new Blob([code], { type: 'text/javascript;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'products.js';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};