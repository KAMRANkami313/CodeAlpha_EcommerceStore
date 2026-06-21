import Product from '../models/Product.js';
import ApiError from '../utils/ApiError.js';
import cloudinary, { isCloudinaryConfigured } from '../config/cloudinary.js';

// Maximum allowed limit per page to prevent abuse
const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 12;

const createProduct = async (productData, images = []) => {
  const product = await Product.create({
    ...productData,
    images,
  });
  return product;
};

const getAllProducts = async (filters = {}) => {
  const { category, minPrice, maxPrice, search, sort, page = 1, limit = DEFAULT_LIMIT, featured } = filters;

  // Enforce pagination bounds
  const safePage = Math.max(1, parseInt(page) || 1);
  const safeLimit = Math.min(MAX_LIMIT, Math.max(1, parseInt(limit) || DEFAULT_LIMIT));

  // Build query
  const query = { isActive: true };

  if (category) query.category = category;
  if (featured === 'true') query.featured = true;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseFloat(minPrice);
    if (maxPrice) query.price.$lte = parseFloat(maxPrice);
  }
  if (search) {
    query.$text = { $search: search };
  }

  // Build sort
  let sortOption = { createdAt: -1 };
  if (sort === 'price_asc') sortOption = { price: 1 };
  if (sort === 'price_desc') sortOption = { price: -1 };
  if (sort === 'newest') sortOption = { createdAt: -1 };
  if (sort === 'rating') sortOption = { ratings: -1 };

  // Pagination
  const skip = (safePage - 1) * safeLimit;
  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(safeLimit);

  return {
    products,
    pagination: {
      total,
      page: safePage,
      pages: Math.ceil(total / safeLimit),
      limit: safeLimit,
    },
  };
};

const getProductById = async (productId) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }
  return product;
};

const updateProduct = async (productId, updateData) => {
  const product = await Product.findByIdAndUpdate(productId, updateData, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }
  return product;
};

/**
 * Delete a product and clean up its images from Cloudinary.
 * If Cloudinary is not configured, images are only removed from the database.
 */
const deleteProduct = async (productId) => {
  const product = await Product.findByIdAndDelete(productId);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  // Destroy images from Cloudinary (fire-and-forget — don't block the response)
  if (isCloudinaryConfigured && product.images?.length > 0) {
    for (const image of product.images) {
      if (image.public_id && !image.public_id.startsWith('placeholder_') && !image.public_id.startsWith('default_')) {
        cloudinary.uploader.destroy(image.public_id).catch((err) => {
          console.warn(`Failed to delete Cloudinary image ${image.public_id}:`, err.message);
        });
      }
    }
  }

  return product;
};

export { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct };