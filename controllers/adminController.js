const Car = require('../models/Car');
const Booking = require('../models/Booking');
const User = require('../models/User');

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
exports.getStats = async (req, res, next) => {
    try {
        const totalCars = await Car.countDocuments();
        const totalBookings = await Booking.countDocuments();
        const pendingCars = await Car.countDocuments({ isApproved: false });
        const pendingBookings = await Booking.countDocuments({ status: 'Pending' });
        const totalUsers = await User.countDocuments();

        res.status(200).json({
            success: true,
            data: {
                totalCars,
                totalBookings,
                pendingCars,
                pendingBookings,
                totalUsers
            }
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Approve/Reject car listing
// @route   PUT /api/admin/cars/:id/approve
// @access  Private (Admin)
exports.approveCar = async (req, res, next) => {
    try {
        const car = await Car.findByIdAndUpdate(req.params.id, { isApproved: req.body.isApproved }, {
            new: true,
            runValidators: true
        });

        if (!car) {
            return res.status(404).json({ success: false, error: 'Car not found' });
        }

        res.status(200).json({ success: true, data: car });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Get all cars (Admin View)
// @route   GET /api/admin/cars
// @access  Private (Admin)
exports.getAllCars = async (req, res, next) => {
    try {
        const cars = await Car.find().populate('owner', 'name email phone');
        res.status(200).json({ success: true, count: cars.length, data: cars });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Toggle featured status
// @route   PUT /api/admin/cars/:id/featured
// @access  Private (Admin)
exports.toggleFeatured = async (req, res, next) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) return res.status(404).json({ success: false, error: 'Car not found' });
        
        car.isFeatured = !car.isFeatured;
        await car.save();
        
        res.status(200).json({ success: true, data: car });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Delete car
// @route   DELETE /api/admin/cars/:id
// @access  Private (Admin)
exports.deleteCar = async (req, res, next) => {
    try {
        const car = await Car.findByIdAndDelete(req.params.id);
        if (!car) return res.status(404).json({ success: false, error: 'Car not found' });
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
