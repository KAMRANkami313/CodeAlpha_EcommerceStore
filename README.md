# ShopVerse — Full Stack E-Commerce Platform

A production-ready MERN stack e-commerce platform with secure authentication, online payments, inventory management, and a complete admin dashboard.

Live Demo:
https://shopverse-ecommerce-store.vercel.app

---

## Overview

ShopVerse is a modern full-stack online shopping platform built with React, Node.js, Express, and MongoDB.

The application provides a complete shopping experience with product management, secure checkout, order processing, user accounts, and an administrative control panel.

The project follows a scalable architecture with separated frontend and backend layers.

---

## Features

### Customer Application

- Browse products with search and filtering
- Product categories and sorting
- Product details with reviews and ratings
- Shopping cart management
- Wishlist functionality
- Secure authentication system
- Checkout workflow
- Stripe payment integration
- Cash on Delivery support
- Order history and tracking
- Responsive user interface

### Admin Dashboard

- Product management
- Inventory management
- Order management
- User management
- Review moderation
- Sales and order analytics

### Security Features

- JWT authentication
- Refresh token rotation
- Role-based authorization
- Password hashing
- Request validation
- Secure API middleware
- Protected admin routes

---

## Technology Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios
- Context API

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token
- Stripe API

### External Services

- MongoDB Atlas
- Cloudinary
- Vercel
- Render

---

## Application Architecture

```
Client (React)
      |
      |
      v
REST API
      |
      |
      v
Server (Express)
      |
      |
      +----------------+
      |                |
      v                v
 MongoDB          External APIs
 Database         Stripe / Cloudinary
```

---

## Project Structure

    ShopVerse/
    |
    |-- client/                         # Frontend application
    |   |
    |   |-- public/                     # Static assets
    |   |
    |   |-- src/
    |       |
    |       |-- assets/                 # Images, icons, resources
    |       |
    |       |-- components/             # Reusable UI components
    |       |
    |       |-- pages/                  # Application pages
    |       |
    |       |-- layouts/                # Page layouts
    |       |
    |       |-- context/                # Global state management
    |       |
    |       |-- hooks/                  # Custom React hooks
    |       |
    |       |-- services/               # API communication layer
    |       |
    |       |-- utils/                  # Helper functions
    |       |
    |       |-- App.jsx
    |       |-- main.jsx
    |
    |
    |-- server/                         # Backend application
        |
        |-- src/
            |
            |-- config/                 # Database and service configs
            |
            |-- controllers/            # Request handlers
            |
            |-- routes/                 # API route definitions
            |
            |-- models/                 # MongoDB schemas
            |
            |-- middleware/             # Auth and security middleware
            |
            |-- services/               # Business logic layer
            |
            |-- validators/             # Request validation
            |
            |-- utils/                  # Helper utilities
            |
            |-- app.js
            |-- server.js

---

## Installation

Clone repository:

    git clone https://github.com/KAMRANkami313/CodeAlpha_EcommerceStore.git

    cd CodeAlpha_EcommerceStore

Install dependencies:

    npm run install:all

---

## Environment Configuration

Create environment variables for the backend.

Example:

    MONGODB_URI=your_mongodb_connection

    JWT_SECRET=your_secret_key

    JWT_REFRESH_SECRET=your_refresh_secret

    STRIPE_SECRET_KEY=your_stripe_secret

    CLOUDINARY_API_KEY=your_api_key

    CLOUDINARY_API_SECRET=your_api_secret

    CLIENT_URL=http://localhost:5173

---

## Running the Application

Start development mode:

    npm run dev

Frontend:

    http://localhost:5173

Backend:

    http://localhost:5000

---

## API Modules

Authentication

- Register and login
- Token management
- User profile management

Products

- Product listing
- Search and filtering
- Product administration

Orders

- Order creation
- Payment handling
- Order tracking

Admin

- Dashboard statistics
- Product control
- User management

---

## Deployment

Frontend:

Vercel

Backend:

Render

Database:

MongoDB Atlas

---

## Engineering Highlights

- Clean separation of frontend and backend
- Scalable REST API design
- Secure authentication flow
- Reusable component architecture
- Optimized database operations
- Production deployment setup

---

## Author

Muhammad Kamran

GitHub:
https://github.com/KAMRANkami313

LinkedIn:
https://linkedin.com/in/muhammad-kamran-aa7620296

---
