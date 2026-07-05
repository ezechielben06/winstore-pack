// 📄 src/components/Shop/CreatePackButton.jsx
import { useState } from 'react';  // ✅ AJOUTÉ
import { Package, Plus } from 'lucide-react';
import PackBuilder from './PackBuilder';

const CreatePackButton = ({ products, isWomen }) => {
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsBuilderOpen(true)}
        className="group relative overflow-hidden bg-gradient-to-r from-gold to-feminine-primary text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition-all duration-300 shadow-xl shadow-gold/30 flex items-center gap-2"
      >
        <Package className="w-5 h-5" />
        Crée ton pack
        <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
      </button>

      <PackBuilder
        isOpen={isBuilderOpen}
        onClose={() => setIsBuilderOpen(false)}
        products={products}
        isWomen={isWomen}
      />
    </>
  );
};

export default CreatePackButton;
