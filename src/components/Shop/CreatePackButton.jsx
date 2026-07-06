// 📄 src/components/Shop/CreatePackButton.jsx
import { Link, useLocation } from 'react-router-dom';
import { Package, Plus, Wand2 } from 'lucide-react';

const CreatePackButton = ({ products, isWomen }) => {
  const location = useLocation();
  
  return (
    <Link
      to="/creer-pack"
      state={{ 
        from: isWomen ? 'femme' : 'homme',
        products: products,
        returnPath: location.pathname
      }}
      className="group relative overflow-hidden bg-gradient-to-r from-gold to-yellow-500 text-gray-900 px-5 py-2.5 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg shadow-gold/30 flex items-center gap-2 text-sm"
    >
      <Wand2 className="w-4 h-4" />
      Crée ton pack
      <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
    </Link>
  );
};

export default CreatePackButton;