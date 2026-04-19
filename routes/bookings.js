const express = require('express');
const {
    createBooking,
    getBookings,
    updateBooking
} = require('../controllers/bookingController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router
    .route('/')
    .get(protect, getBookings)
    .post(protect, authorize('Customer'), createBooking);

router
    .route('/:id')
    .put(protect, authorize('Admin', 'Owner'), updateBooking);

module.exports = router;
