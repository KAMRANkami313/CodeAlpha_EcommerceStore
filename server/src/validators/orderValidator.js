import { body } from 'express-validator';

export const createOrderValidator = [
  body('shippingAddress.fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required'),

  body('shippingAddress.phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required'),

  body('shippingAddress.street')
    .trim()
    .notEmpty()
    .withMessage('Street address is required'),

  body('shippingAddress.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),

  body('shippingAddress.state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),

  body('shippingAddress.zipCode')
    .trim()
    .notEmpty()
    .withMessage('Zip code is required'),

  body('paymentMethod')
    .notEmpty()
    .withMessage('Payment method is required')
    .isIn(['COD', 'Card'])
    .withMessage('Invalid payment method'),

  body('stripePaymentId')
    .optional()
    .trim(),
];