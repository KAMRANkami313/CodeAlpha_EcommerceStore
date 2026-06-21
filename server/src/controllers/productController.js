import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import cloudinary, { isCloudinaryConfigured } from '../config/cloudinary.js';
import * as productService from '../services/productService.js';

const createProduct = asyncHandler(async (req, res) => {
  let images = [];

  // Upload images to Cloudinary if files exist and Cloudinary is configured
  if (req.files && req.files.length > 0) {
    if (isCloudinaryConfigured) {
      const uploadPromises = req.files.map((file) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'ecommerce/products' },
            (error, result) => {
              if (error) reject(error);
              else resolve({ public_id: result.public_id, url: result.secure_url });
            }
          );
          stream.end(file.buffer);
        });
      });
      images = await Promise.all(uploadPromises);
    } else {
      // Cloudinary not configured — create placeholder image entries
      images = req.files.map((file, index) => ({
        public_id: `placeholder_${Date.now()}_${index}`,
        url: `https://placehold.co/400x400/e2e8f0/64748b?text=${encodeURIComponent(req.body.name || 'Product')}`,
      }));
    }
  }

  // If no images were uploaded, add a default placeholder
  if (images.length === 0) {
    images = [{
      public_id: `default_${Date.now()}`,
      url: `https://placehold.co/400x400/e2e8f0/64748b?text=${encodeURIComponent(req.body.name || 'Product')}`,
    }];
  }

  const product = await productService.createProduct(req.body, images);

  res.status(201).json(new ApiResponse(201, product, 'Product created successfully'));
});

const getAllProducts = asyncHandler(async (req, res) => {
  const result = await productService.getAllProducts(req.query);

  res.status(200).json(new ApiResponse(200, result, 'Products fetched successfully'));
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);

  res.status(200).json(new ApiResponse(200, product, 'Product fetched successfully'));
});

const updateProduct = asyncHandler(async (req, res) => {
  let newImages = [];

  // If new images are uploaded, process them
  if (req.files && req.files.length > 0) {
    if (isCloudinaryConfigured) {
      const uploadPromises = req.files.map((file) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'ecommerce/products' },
            (error, result) => {
              if (error) reject(error);
              else resolve({ public_id: result.public_id, url: result.secure_url });
            }
          );
          stream.end(file.buffer);
        });
      });
      newImages = await Promise.all(uploadPromises);
    } else {
      newImages = req.files.map((file, index) => ({
        public_id: `placeholder_${Date.now()}_${index}`,
        url: `https://placehold.co/400x400/e2e8f0/64748b?text=${encodeURIComponent(req.body.name || 'Product')}`,
      }));
    }
  }

  // If new images were provided, replace the old ones
  // If no new images uploaded, keep existing images (don't overwrite)
  const updateData = { ...req.body };
  if (newImages.length > 0) {
    updateData.images = newImages;
  }

  const product = await productService.updateProduct(req.params.id, updateData);

  res.status(200).json(new ApiResponse(200, product, 'Product updated successfully'));
});

const deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.params.id);

  res.status(200).json(new ApiResponse(200, null, 'Product deleted successfully'));
});

export { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct };