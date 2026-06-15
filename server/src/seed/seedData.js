import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env — try server root first, then project root
dotenv.config({ path: path.join(__dirname, '../../.env'), override: true });
dotenv.config({ path: path.join(__dirname, '../../../.env'), override: true });

const products = [
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'Premium over-ear wireless headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound quality. Perfect for music lovers and professionals who demand the best audio experience on the go or in the studio.',
    price: 4999,
    compareAtPrice: 7999,
    category: 'Electronics',
    brand: 'SoundMax',
    stock: 25,
    ratings: 0,
    numOfReviews: 0,
    featured: true,
    isActive: true,
    images: [{ public_id: 'sample_1', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500' }],
  },
  {
    name: 'Classic Leather Jacket',
    description: 'Genuine leather jacket with a timeless design. Features a smooth zip-up front, multiple pockets, and a comfortable inner lining. A must-have wardrobe staple that never goes out of style.',
    price: 8499,
    compareAtPrice: 12999,
    category: 'Clothing',
    brand: 'UrbanStyle',
    stock: 15,
    ratings: 0,
    numOfReviews: 0,
    featured: true,
    isActive: true,
    images: [{ public_id: 'sample_2', url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500' }],
  },
  {
    name: 'Running Shoes Pro',
    description: 'Lightweight and responsive running shoes with breathable mesh upper, cushioned midsole, and durable rubber outsole. Engineered for speed and comfort on every stride.',
    price: 5999,
    compareAtPrice: 8499,
    category: 'Footwear',
    brand: 'SpeedRun',
    stock: 40,
    ratings: 0,
    numOfReviews: 0,
    featured: true,
    isActive: true,
    images: [{ public_id: 'sample_3', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500' }],
  },
  {
    name: 'Smart Watch Ultra',
    description: 'Feature-packed smartwatch with AMOLED display, heart rate monitoring, GPS tracking, and 7-day battery life. Stay connected and track your fitness goals effortlessly.',
    price: 12999,
    compareAtPrice: 17999,
    category: 'Electronics',
    brand: 'TechVibe',
    stock: 20,
    ratings: 0,
    numOfReviews: 0,
    featured: true,
    isActive: true,
    images: [{ public_id: 'sample_4', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500' }],
  },
  {
    name: 'Cotton Casual T-Shirt',
    description: '100% premium cotton t-shirt with a relaxed fit. Soft, breathable fabric perfect for everyday wear. Available in multiple colors and sizes.',
    price: 1299,
    compareAtPrice: 1999,
    category: 'Clothing',
    brand: 'BasicWear',
    stock: 100,
    ratings: 0,
    numOfReviews: 0,
    featured: false,
    isActive: true,
    images: [{ public_id: 'sample_5', url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500' }],
  },
  {
    name: 'Wireless Charging Pad',
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices. Sleek, compact design with LED indicator and overheat protection.',
    price: 2499,
    compareAtPrice: 3499,
    category: 'Electronics',
    brand: 'ChargePro',
    stock: 50,
    ratings: 0,
    numOfReviews: 0,
    featured: false,
    isActive: true,
    images: [{ public_id: 'sample_6', url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500' }],
  },
  {
    name: 'Stainless Steel Water Bottle',
    description: 'Double-walled vacuum insulated water bottle that keeps drinks cold for 24 hours or hot for 12 hours. BPA-free and eco-friendly.',
    price: 1899,
    compareAtPrice: 2499,
    category: 'Sports',
    brand: 'HydroLife',
    stock: 75,
    ratings: 0,
    numOfReviews: 0,
    featured: false,
    isActive: true,
    images: [{ public_id: 'sample_7', url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500' }],
  },
  {
    name: 'Laptop Backpack',
    description: 'Water-resistant laptop backpack with padded compartment for up to 15.6-inch laptops. USB charging port and anti-theft design.',
    price: 3499,
    compareAtPrice: 4999,
    category: 'Accessories',
    brand: 'PackIt',
    stock: 30,
    ratings: 0,
    numOfReviews: 0,
    featured: true,
    isActive: true,
    images: [{ public_id: 'sample_8', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500' }],
  },
  {
    name: 'Sunglasses Aviator',
    description: 'Classic aviator-style sunglasses with UV400 protection and polarized lenses. Lightweight metal frame with comfortable nose pads.',
    price: 2999,
    compareAtPrice: 4499,
    category: 'Accessories',
    brand: 'ShadeVision',
    stock: 45,
    ratings: 0,
    numOfReviews: 0,
    featured: false,
    isActive: true,
    images: [{ public_id: 'sample_9', url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500' }],
  },
  {
    name: 'Home Decor Ceramic Vase',
    description: 'Handcrafted ceramic vase with minimalist design. Perfect for fresh or dried flower arrangements. Adds elegance to any room.',
    price: 1999,
    compareAtPrice: 2999,
    category: 'Home & Garden',
    brand: 'DecorArt',
    stock: 35,
    ratings: 0,
    numOfReviews: 0,
    featured: false,
    isActive: true,
    images: [{ public_id: 'sample_10', url: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=500' }],
  },
  {
    name: 'Mechanical Keyboard RGB',
    description: 'Full-size mechanical keyboard with hot-swappable switches, per-key RGB lighting, and PBT keycaps. Built for gamers and developers.',
    price: 7999,
    compareAtPrice: 10999,
    category: 'Electronics',
    brand: 'KeyCraft',
    stock: 18,
    ratings: 0,
    numOfReviews: 0,
    featured: true,
    isActive: true,
    images: [{ public_id: 'sample_11', url: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500' }],
  },
  {
    name: 'Yoga Mat Premium',
    description: 'Extra-thick 6mm yoga mat with non-slip textured surface. Made from eco-friendly TPE material. Includes carry strap.',
    price: 2499,
    compareAtPrice: 3499,
    category: 'Sports',
    brand: 'FlexZone',
    stock: 60,
    ratings: 0,
    numOfReviews: 0,
    featured: false,
    isActive: true,
    images: [{ public_id: 'sample_12', url: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500' }],
  },
];

// Review templates — will be assigned to random products
const reviewTemplates = [
  { rating: 5, comment: 'Absolutely love this product! Exceeded my expectations in every way. The build quality is outstanding and it works perfectly.' },
  { rating: 4, comment: 'Great product for the price. Works well and looks even better in person. Would definitely recommend to friends.' },
  { rating: 5, comment: 'Best purchase I have made this year! The quality is top-notch and delivery was super fast. Very satisfied customer.' },
  { rating: 4, comment: 'Really good quality and fast delivery. The only minor issue is the packaging could be better, but the product itself is excellent.' },
  { rating: 3, comment: 'Decent product but not exactly as described. The color is slightly different from the pictures. Still usable though.' },
  { rating: 5, comment: 'Outstanding quality! This feels premium and works like a charm. Already ordered another one as a gift for my brother.' },
  { rating: 4, comment: 'Very comfortable and well-made. Took a few days to get used to it but now I use it daily. Great value for money.' },
  { rating: 5, comment: 'Perfect fit and amazing quality. I was skeptical at first but this really delivers. Five stars all the way!' },
  { rating: 4, comment: 'Good product overall. Shipping was quick and the item matches the description. Happy with my purchase.' },
  { rating: 3, comment: 'It is okay for the price range. Nothing extraordinary but gets the job done. Expected a bit more based on the reviews.' },
  { rating: 5, comment: 'Impressed with the quality at this price point. Works perfectly right out of the box. Highly recommended!' },
  { rating: 4, comment: 'Solid product with good materials. A few minor scratches on arrival but nothing that affects functionality.' },
  { rating: 5, comment: 'This is exactly what I was looking for! Premium feel, great performance, and excellent customer service from the seller.' },
  { rating: 4, comment: 'Really nice design and functionality. Battery life could be better but otherwise a fantastic product.' },
  { rating: 5, comment: 'Worth every penny! The attention to detail is remarkable. This is my second purchase and both have been excellent.' },
  { rating: 3, comment: 'Average product. Does what it says but nothing special. I have seen better options in the same price range.' },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear all collections
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Review.deleteMany({});
    console.log('Cleared existing products, orders, and reviews');

    // ─── Create Products ─────────────────────────────
    const createdProducts = await Product.insertMany(products);
    console.log(`Seeded ${createdProducts.length} products`);

    // ─── Create Users ────────────────────────────────
    let adminUser = await User.findOne({ email: 'admin@shopverse.com' });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'Admin User',
        email: 'admin@shopverse.com',
        password: 'admin123',
        role: 'admin',
        phone: '+92 300 1234567',
      });
      console.log('Created admin user (admin@shopverse.com / admin123)');
    } else {
      console.log('Admin user already exists');
    }

    let testUser = await User.findOne({ email: 'test@shopverse.com' });
    if (!testUser) {
      testUser = await User.create({
        name: 'Test User',
        email: 'test@shopverse.com',
        password: 'test123',
        role: 'user',
        phone: '+92 317 5718391',
      });
      console.log('Created test user (test@shopverse.com / test123)');
    } else {
      console.log('Test user already exists');
    }

    let kamranUser = await User.findOne({ email: 'kamran@shopverse.com' });
    if (!kamranUser) {
      kamranUser = await User.create({
        name: 'Muhammad Kamran',
        email: 'kamran@shopverse.com',
        password: 'kamran123',
        role: 'user',
        phone: '+92 317 5718391',
      });
      console.log('Created kamran user (kamran@shopverse.com / kamran123)');
    } else {
      console.log('Kamran user already exists');
    }

    const users = [testUser, kamranUser];

    // ─── Create Reviews ──────────────────────────────
    const reviews = [];
    // Give each user 5 reviews on different products
    for (const user of users) {
      const shuffled = [...createdProducts].sort(() => Math.random() - 0.5);
      const productsToReview = shuffled.slice(0, 5);

      for (let i = 0; i < productsToReview.length; i++) {
        const template = reviewTemplates[(users.indexOf(user) * 5 + i) % reviewTemplates.length];
        reviews.push({
          user: user._id,
          product: productsToReview[i]._id,
          rating: template.rating,
          comment: template.comment,
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
        });
      }
    }

    const createdReviews = await Review.insertMany(reviews);
    console.log(`Seeded ${createdReviews.length} reviews`);

    // ─── Update Product Ratings ──────────────────────
    for (const product of createdProducts) {
      const productReviews = createdReviews.filter(
        (r) => r.product.toString() === product._id.toString()
      );
      if (productReviews.length > 0) {
        const avgRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
        product.ratings = Math.round(avgRating * 10) / 10;
        product.numOfReviews = productReviews.length;
        await product.save();
      }
    }
    console.log('Updated product ratings based on reviews');

    // ─── Create Orders ───────────────────────────────
    const shippingAddresses = [
      { fullName: 'Muhammad Kamran', phone: '+92 317 5718391', street: '42 Satellite Town', city: 'Rawalpindi', state: 'Punjab', zipCode: '46000', country: 'Pakistan' },
      { fullName: 'Test User', phone: '+92 300 9876543', street: '15 Blue Area', city: 'Islamabad', state: 'ICT', zipCode: '44000', country: 'Pakistan' },
      { fullName: 'Muhammad Kamran', phone: '+92 317 5718391', street: '7 Saddar Road', city: 'Rawalpindi', state: 'Punjab', zipCode: '46000', country: 'Pakistan' },
    ];

    const orders = [];

    // Order 1 — test user, 2 items, delivered
    const p1 = createdProducts[0];
    const p2 = createdProducts[7];
    const items1 = [
      { product: p1._id, name: p1.name, image: p1.images[0].url, price: p1.price, quantity: 1 },
      { product: p2._id, name: p2.name, image: p2.images[0].url, price: p2.price, quantity: 1 },
    ];
    const itemsPrice1 = p1.price + p2.price;
    orders.push({
      user: testUser._id,
      items: items1,
      shippingAddress: shippingAddresses[1],
      itemsPrice: itemsPrice1,
      shippingPrice: itemsPrice1 > 5000 ? 0 : 200,
      totalPrice: itemsPrice1 + (itemsPrice1 > 5000 ? 0 : 200),
      paymentMethod: 'COD',
      paymentStatus: 'paid',
      orderStatus: 'delivered',
      deliveredAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    });

    // Order 2 — kamran user, 3 items, shipped
    const p3 = createdProducts[3];
    const p4 = createdProducts[10];
    const p5 = createdProducts[5];
    const items2 = [
      { product: p3._id, name: p3.name, image: p3.images[0].url, price: p3.price, quantity: 1 },
      { product: p4._id, name: p4.name, image: p4.images[0].url, price: p4.price, quantity: 1 },
      { product: p5._id, name: p5.name, image: p5.images[0].url, price: p5.price, quantity: 2 },
    ];
    const itemsPrice2 = p3.price + p4.price + p5.price * 2;
    orders.push({
      user: kamranUser._id,
      items: items2,
      shippingAddress: shippingAddresses[0],
      itemsPrice: itemsPrice2,
      shippingPrice: 0,
      totalPrice: itemsPrice2,
      paymentMethod: 'Card',
      paymentStatus: 'paid',
      orderStatus: 'shipped',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    });

    // Order 3 — kamran user, 1 item, processing
    const p6 = createdProducts[1];
    const items3 = [
      { product: p6._id, name: p6.name, image: p6.images[0].url, price: p6.price, quantity: 1 },
    ];
    orders.push({
      user: kamranUser._id,
      items: items3,
      shippingAddress: shippingAddresses[2],
      itemsPrice: p6.price,
      shippingPrice: 0,
      totalPrice: p6.price,
      paymentMethod: 'COD',
      paymentStatus: 'pending',
      orderStatus: 'processing',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    });

    // Order 4 — test user, 2 items, delivered
    const p7 = createdProducts[2];
    const p8 = createdProducts[11];
    const items4 = [
      { product: p7._id, name: p7.name, image: p7.images[0].url, price: p7.price, quantity: 1 },
      { product: p8._id, name: p8.name, image: p8.images[0].url, price: p8.price, quantity: 2 },
    ];
    const itemsPrice4 = p7.price + p8.price * 2;
    orders.push({
      user: testUser._id,
      items: items4,
      shippingAddress: shippingAddresses[1],
      itemsPrice: itemsPrice4,
      shippingPrice: 0,
      totalPrice: itemsPrice4,
      paymentMethod: 'COD',
      paymentStatus: 'paid',
      orderStatus: 'delivered',
      deliveredAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    });

    // Order 5 — kamran user, 1 item, delivered
    const p9 = createdProducts[8];
    const items5 = [
      { product: p9._id, name: p9.name, image: p9.images[0].url, price: p9.price, quantity: 1 },
    ];
    orders.push({
      user: kamranUser._id,
      items: items5,
      shippingAddress: shippingAddresses[0],
      itemsPrice: p9.price,
      shippingPrice: 200,
      totalPrice: p9.price + 200,
      paymentMethod: 'Card',
      paymentStatus: 'paid',
      orderStatus: 'delivered',
      deliveredAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    });

    const createdOrders = await Order.insertMany(orders);
    console.log(`Seeded ${createdOrders.length} orders`);

    console.log('\n═══════════════════════════════════════════');
    console.log('  Database seeding completed successfully!');
    console.log('═══════════════════════════════════════════');
    console.log(`  Products : ${createdProducts.length}`);
    console.log(`  Reviews  : ${createdReviews.length}`);
    console.log(`  Orders   : ${createdOrders.length}`);
    console.log('  Users    : admin / test / kamran');
    console.log('═══════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();