# ShopVerse — Full-Stack E-Commerce Store

A complete e-commerce platform built with the MERN stack (MongoDB, Express, React, Node.js) as part of the CodeAlpha Internship program.

## Features

- **Product Management** — Browse, search, filter, and sort products by category, price, and ratings
- **User Authentication** — JWT-based auth with access + refresh token rotation, account lockout protection
- **Shopping Cart** — Real-time price sync with product database, stock validation
- **Wishlist** — Save products for later with one-click toggle
- **Order Management** — Place orders with COD or Stripe card payment, track order status
- **Reviews** — Rate and review products, admin can moderate inappropriate reviews
- **Admin Dashboard** — Stats, user management (role changes, deletion), order management, product CRUD
- **Dark Mode** — Full dark/light theme support
- **Responsive Design** — Mobile-first with Tailwind CSS

## Tech Stack

| Layer    | Technology                                                                          |
| -------- | ----------------------------------------------------------------------------------- |
| Frontend | React 19, Vite, Tailwind CSS 4, Framer Motion, React Hook Form                      |
| Backend  | Express 5, MongoDB (Mongoose 9), JWT, Stripe, Cloudinary                            |
| Security | Helmet, CORS, rate limiting, XSS sanitization, MongoDB injection protection, bcrypt |

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB running locally or a MongoDB Atlas connection string
- (Optional) Cloudinary account for image uploads
- (Optional) Stripe account for card payments

### Installation

```bash
# Clone the repo
git clone https://github.com/KAMRANkami313/CodeAlpha_EcommerceStore.git
cd CodeAlpha_EcommerceStore

# Install all dependencies (root + server + client)
npm run install:all
```

### Environment Setup

```bash
# Copy the example env file and fill in your values
cp server/.env.example server/.env

# Edit server/.env with your configuration
# Minimum required: MONGODB_URI, JWT_SECRET, JWT_REFRESH_SECRET
```

### Running the App

```bash
# Start both server and client concurrently
npm run dev

# Or run them separately:
npm run dev:server   # Server on http://localhost:5000
npm run dev:client   # Client on http://localhost:5173
```

### Seed the Database

```bash
cd server
npm run seed
```

This creates:

- **Admin user**: `admin@shopverse.com` / `Admin@123`
- **Test user**: `test@shopverse.com` / `Test@1234`
- **Kamran user**: `kamran@shopverse.com` / `Kamran@123`
- 12 sample products, 10 reviews, 5 orders

## Project Structure

```
CodeAlpha_EcommerceStore/
├── server/                     # Express backend
│   ├── src/
│   │   ├── config/            # DB, env, Cloudinary config
│   │   ├── controllers/       # Route handlers
│   │   ├── middleware/         # Auth, validation, XSS, audit logging
│   │   ├── models/            # Mongoose schemas
│   │   ├── routes/            # Express routes
│   │   ├── services/          # Business logic layer
│   │   ├── validators/        # express-validator rules
│   │   ├── utils/             # Helpers (ApiError, ApiResponse, tokens)
│   │   └── seed/              # Database seeding script
│   └── server.js              # Entry point
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/        # UI components
│   │   ├── context/           # React contexts (Auth, Cart, Theme, Wishlist)
│   │   ├── hooks/             # Custom hooks
│   │   ├── pages/             # Page components
│   │   ├── services/          # API service layer
│   │   ├── constants/         # Routes & API endpoints
│   │   └── utils/             # Formatting, validation helpers
│   └── vite.config.js
└── package.json                # Root scripts (concurrently)
```

## Security Features

- **JWT Token Rotation** — Short-lived access tokens (15 min) with refresh token rotation
- **Account Lockout** — 5 failed login attempts locks the account for 15 minutes
- **XSS Protection** — All input sanitized via `xss` library
- **NoSQL Injection** — MongoDB operator characters stripped from input
- **Rate Limiting** — Tiered limits per route type (auth, payment, API, search)
- **Helmet** — Hardened HTTP headers with CSP
- **File Upload Security** — MIME type + extension validation, size limits
- **Mass Assignment Protection** — Whitelisted fields for profile updates
- **Audit Logging** — Admin actions logged with timestamp, user, and target

## License

MIT
