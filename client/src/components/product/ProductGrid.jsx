import ProductCard from './ProductCard.jsx';
import Loader from '../common/Loader.jsx';
import SkeletonGrid from '../common/Skeleton.jsx';

const ProductGrid = ({ products, loading }) => {
  if (loading) return <SkeletonGrid count={8} />;

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-surface-400 dark:text-surface-500 text-lg">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <ProductCard key={product._id} product={product} index={index} />
      ))}
    </div>
  );
};

export default ProductGrid;