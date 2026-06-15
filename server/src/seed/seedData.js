import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env — try server root first, then project root
dotenv.config({ path: path.join(__dirname, '../../.env'), override: true });
dotenv.config({ path: path.join(__dirname, '../../../.env'), override: true });

const products = [
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'Premium over-ear wireless headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound quality.',
    price: 4999,
    compareAtPrice: 7999,
    category: 'Electronics',
    brand: 'SoundMax',
    stock: 25,
    ratings: 4.5,
    numOfReviews: 128,
    featured: true,
    isActive: true,
    images: [{ public_id: 'sample_1', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500' }],
  },
  {
    name: 'Classic Leather Jacket',
    description: 'Genuine leather jacket with a timeless design. Features a smooth zip-up front, multiple pockets, and a comfortable inner lining.',
    price: 8499,
    compareAtPrice: 12999,
    category: 'Clothing',
    brand: 'UrbanStyle',
    stock: 15,
    ratings: 4.7,
    numOfReviews: 89,
    featured: true,
    isActive: true,
    images: [{ public_id: 'sample_2', url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500' }],
  },
  {
    name: 'Running Shoes Pro',
    description: 'Lightweight and responsive running shoes with breathable mesh upper, cushioned midsole, and durable rubber outsole.',
    price: 5999,
    compareAtPrice: 8499,
    category: 'Footwear',
    brand: 'SpeedRun',
    stock: 40,
    ratings: 4.3,
    numOfReviews: 215,
    featured: true,
    isActive: true,
    images: [{ public_id: 'sample_3', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500' }],
  },
  {
    name: 'Smart Watch Ultra',
    description: 'Feature-packed smartwatch with AMOLED display, heart rate monitoring, GPS tracking, and 7-day battery life.',
    price: 12999,
    compareAtPrice: 17999,
    category: 'Electronics',
    brand: 'TechVibe',
    stock: 20,
    ratings: 4.6,
    numOfReviews: 342,
    featured: true,
    isActive: true,
    images: [{ public_id: 'sample_4', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500' }],
  },
  {
    name: 'Cotton Casual T-Shirt',
    description: '100% premium cotton t-shirt with a relaxed fit. Soft, breathable fabric perfect for everyday wear.',
    price: 1299,
    compareAtPrice: 1999,
    category: 'Clothing',
    brand: 'BasicWear',
    stock: 100,
    ratings: 4.1,
    numOfReviews: 567,
    featured: false,
    isActive: true,
    images: [{ public_id: 'sample_5', url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500' }],
  },
  {
    name: 'Wireless Charging Pad',
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices. Sleek, compact design with LED indicator.',
    price: 2499,
    compareAtPrice: 3499,
    category: 'Electronics',
    brand: 'ChargePro',
    stock: 50,
    ratings: 4.2,
    numOfReviews: 98,
    featured: false,
    isActive: true,
    images: [{ public_id: 'sample_6', url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500' }],
  },
  {
    name: 'Stainless Steel Water Bottle',
    description: 'Double-walled vacuum insulated water bottle that keeps drinks cold for 24 hours or hot for 12 hours.',
    price: 1899,
    compareAtPrice: 2499,
    category: 'Sports',
    brand: 'HydroLife',
    stock: 75,
    ratings: 4.4,
    numOfReviews: 156,
    featured: false,
    isActive: true,
    images: [{ public_id: 'sample_7', url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500' }],
  },
  {
    name: 'Laptop Backpack',
    description: 'Water-resistant laptop backpack with padded compartment for up to 15.6-inch laptops. USB charging port.',
    price: 3499,
    compareAtPrice: 4999,
    category: 'Accessories',
    brand: 'PackIt',
    stock: 30,
    ratings: 4.5,
    numOfReviews: 203,
    featured: true,
    isActive: true,
    images: [{ public_id: 'sample_8', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500' }],
  },
  {
    name: 'Sunglasses Aviator',
    description: 'Classic aviator-style sunglasses with UV400 protection and polarized lenses.',
    price: 2999,
    compareAtPrice: 4499,
    category: 'Accessories',
    brand: 'ShadeVision',
    stock: 45,
    ratings: 4.3,
    numOfReviews: 178,
    featured: false,
    isActive: true,
    images: [{ public_id: 'sample_9', url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500' }],
  },
  {
    name: 'Home Decor Ceramic Vase',
    description: 'Handcrafted ceramic vase with minimalist design. Perfect for fresh or dried flower arrangements.',
    price: 1999,
    compareAtPrice: 2999,
    category: 'Home & Garden',
    brand: 'DecorArt',
    stock: 35,
    ratings: 4.6,
    numOfReviews: 67,
    featured: false,
    isActive: true,
    images: [{ public_id: 'sample_10', url: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=500' }],
  },
  {
    name: 'Mechanical Keyboard RGB',
    description: 'Full-size mechanical keyboard with hot-swappable switches, per-key RGB lighting, and PBT keycaps.',
    price: 7999,
    compareAtPrice: 10999,
    category: 'Electronics',
    brand: 'KeyCraft',
    stock: 18,
    ratings: 4.8,
    numOfReviews: 421,
    featured: true,
    isActive: true,
    images: [{ public_id: 'sample_11', url: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500' }],
  },
  {
    name: 'Yoga Mat Premium',
    description: 'Extra-thick 6mm yoga mat with non-slip textured surface. Made from eco-friendly TPE material.',
    price: 2499,
    compareAtPrice: 3499,
    category: 'Sports',
    brand: 'FlexZone',
    stock: 60,
    ratings: 4.4,
    numOfReviews: 134,
    featured: false,
    isActive: true,
    images: [{ public_id: 'sample_12', url: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500' }],
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    await Product.deleteMany({});
    console.log('Cleared existing products');

    const createdProducts = await Product.insertMany(products);
    console.log(`Seeded ${createdProducts.length} products`);

    const adminExists = await User.findOne({ email: 'admin@shopverse.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin User',
        email: 'admin@shopverse.com',
        password: 'admin123',
        role: 'admin',
      });
      console.log('Created admin user (admin@shopverse.com / admin123)');
    } else {
      console.log('Admin user already exists');
    }

    const testExists = await User.findOne({ email: 'test@shopverse.com' });
    if (!testExists) {
      await User.create({
        name: 'Test User',
        email: 'test@shopverse.com',
        password: 'test123',
        role: 'user',
      });
      console.log('Created test user (test@shopverse.com / test123)');
    } else {
      console.log('Test user already exists');
    }

    console.log('\nDatabase seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();