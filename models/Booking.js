const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    car: {
        type: mongoose.Schema.ObjectId,
        ref: 'Car',
        required: true
    },
    customer: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    startDate: {
        type: Date,
        required: [true, 'Please add a start date']
    },
    endDate: {
        type: Date,
        required: [true, 'Please add an end date']
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    totalPrice: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['Unpaid', 'Paid'],
        default: 'Unpaid'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Booking', BookingSchema);
