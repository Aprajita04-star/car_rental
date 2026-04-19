const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    make: {
        type: String,
        required: [true, 'Please add a make']
    },
    model: {
        type: String,
        required: [true, 'Please add a model']
    },
    year: {
        type: Number,
        required: [true, 'Please add a year']
    },
    type: {
        type: String,
        enum: ['SUV', 'Hatchback', 'Sedan'],
        required: [true, 'Please select a car type']
    },
    city: {
        type: String,
        required: [true, 'Please add a city']
    },
    pricePerDay: {
        type: Number,
        required: [true, 'Please add a price per day']
    },
    specs: {
        transmission: String,
        fuelType: String,
        mileage: String
    },
    images: [String],
    description: String,
    isApproved: {
        type: Boolean,
        default: false
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    availability: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Car', CarSchema);
