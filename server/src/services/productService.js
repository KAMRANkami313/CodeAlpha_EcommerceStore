import Product from '../models/Product.js';
import ApiError from '../utils/ApiError.js';

const createProduct = async (productData, images = []) => {
  const product = await Product.create({
    ...productData,
    images,
  });
  return product;
};

const getAllProducts = async (filters = {}) => {
  const { category, minPrice, maxPrice, search, sort, page = 1, limit = 12, featured } = filters;

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
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(parseInt(limit));

  return {
    products,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      limit: parseInt(limit),
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

const deleteProduct = async (productId) => {
  const product = await Product.findByIdAndDelete(productId);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }
  return product;
};

export { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct };