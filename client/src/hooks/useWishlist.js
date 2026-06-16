import { useWishlistContext } from '../context/WishlistContext.jsx';

const useWishlist = () => {
  const { wishlistProducts, wishlistCount, fetchWishlist, toggleWishlist, isInWishlist } = useWishlistContext();
  return { wishlistProducts, wishlistCount, fetchWishlist, toggleWishlist, isInWishlist };
};

export default useWishlist;