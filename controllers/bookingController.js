const Booking = require('../models/Booking');
const Car = require('../models/Car');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private (Customer)
exports.createBooking = async (req, res, next) => {
    try {
        req.body.customer = req.user.id;

        const car = await Car.findById(req.body.car);

        if (!car) {
            return res.status(404).json({ success: false, error: 'Car not found' });
        }

        if (!car.availability || !car.isApproved) {
            return res.status(400).json({ success: false, error: 'Car is not available for booking' });
        }

        // Calculate total price
        const start = new Date(req.body.startDate);
        const end = new Date(req.body.endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
        req.body.totalPrice = diffDays * car.pricePerDay;

        const booking = await Booking.create(req.body);

        res.status(201).json({ success: true, data: booking });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Get bookings
// @route   GET /api/bookings
// @access  Private
exports.getBookings = async (req, res, next) => {
    try {
        let query;

        if (req.user.role === 'Admin' || req.user.role === 'Developer') {
            query = Booking.find().populate('customer').populate({
                path: 'car',
                populate: { path: 'owner', select: 'name email phone' }
            });
        } else if (req.user.role === 'Owner') {
            // Find cars owned by this user
            const cars = await Car.find({ owner: req.user.id });
            const carIds = cars.map(car => car._id);
            query = Booking.find({ car: { $in: carIds } }).populate('car customer');
        } else {
            // Customer
            query = Booking.find({ customer: req.user.id }).populate('car');
        }

        const bookings = await query;

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id
// @access  Private (Admin)
exports.updateBooking = async (req, res, next) => {
    try {
        let booking = await Booking.findById(req.params.id).populate('car');

        if (!booking) {
            return res.status(404).json({ success: false, error: 'Booking not found' });
        }

        // Only admin or the car owner can approve/reject
        const isOwner = booking.car.owner.toString() === req.user.id;
        
        if (req.user.role !== 'Admin' && !isOwner) {
            return res.status(401).json({ success: false, error: 'Not authorized to update this booking' });
        }

        booking = await Booking.findByIdAndUpdate(req.params.id, { status: req.body.status }, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: booking });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
