import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import cloudinary from '../config/cloudinary.js';
import * as productService from '../services/productService.js';

const createProduct = asyncHandler(async (req, res) => {
  let images = [];

  // Upload images to Cloudinary if files exist
  if (req.files && req.files.length > 0) {
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
  const product = await productService.updateProduct(req.params.id, req.body);

  res.status(200).json(new ApiResponse(200, product, 'Product updated successfully'));
});

const deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.params.id);

  res.status(200).json(new ApiResponse(200, null, 'Product deleted successfully'));
});

export { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct };