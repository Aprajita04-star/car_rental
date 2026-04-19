const Car = require('../models/Car');

// @desc    Get all cars (Search/Filter)
// @route   GET /api/cars
// @access  Public
exports.getCars = async (req, res, next) => {
    try {
        let query;

        // Copy req.query
        const reqQuery = { ...req.query };

        // Fields to exclude
        const removeFields = ['select', 'sort', 'page', 'limit'];

        // Loop over removeFields and delete them from reqQuery
        removeFields.forEach(param => delete reqQuery[param]);

        // Create query string
        let queryStr = JSON.stringify(reqQuery);

        // Create operators ($gt, $gte, etc)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

        // Only show approved cars to the public
        const queryObj = JSON.parse(queryStr);
        if (req.user && (req.user.role === 'Admin' || req.user.role === 'Developer')) {
            // Admin/Dev can see everything
        } else {
            queryObj.isApproved = true;
        }

        // Finding resource
        query = Car.find(queryObj);

        // Select Fields
        if (req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }

        // Sort
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            // Default sort: Featured first, then newest
            query = query.sort('-isFeatured -createdAt');
        }

        // Executing query
        const cars = await query;

        res.status(200).json({
            success: true,
            count: cars.length,
            data: cars
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Get single car
// @route   GET /api/cars/:id
// @access  Public
exports.getCar = async (req, res, next) => {
    try {
        const car = await Car.findById(req.params.id).populate('owner', 'name email phone');

        if (!car) {
            return res.status(404).json({ success: false, error: 'Car not found' });
        }

        res.status(200).json({ success: true, data: car });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Create new car
// @route   POST /api/cars
// @access  Private (Owner/Dealer/Admin)
exports.createCar = async (req, res, next) => {
    try {
        // Add user to req.body
        req.body.owner = req.user.id;

        const car = await Car.create(req.body);

        res.status(201).json({ success: true, data: car });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Update car
// @route   PUT /api/cars/:id
// @access  Private
exports.updateCar = async (req, res, next) => {
    try {
        let car = await Car.findById(req.params.id);

        if (!car) {
            return res.status(404).json({ success: false, error: 'Car not found' });
        }

        // Make sure user is car owner or admin
        if (car.owner.toString() !== req.user.id && req.user.role !== 'Admin') {
            return res.status(401).json({ success: false, error: 'Not authorized to update this car' });
        }

        car = await Car.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: car });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Delete car
// @route   DELETE /api/cars/:id
// @access  Private
exports.deleteCar = async (req, res, next) => {
    try {
        const car = await Car.findById(req.params.id);

        if (!car) {
            return res.status(404).json({ success: false, error: 'Car not found' });
        }

        // Make sure user is car owner or admin
        if (car.owner.toString() !== req.user.id && req.user.role !== 'Admin') {
            return res.status(401).json({ success: false, error: 'Not authorized to delete this car' });
        }

        await car.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Get unique car locations
// @route   GET /api/cars/locations
// @access  Public
exports.getLocations = async (req, res, next) => {
    try {
        const locations = await Car.distinct('city', { isApproved: true });
        res.status(200).json({ success: true, data: locations });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};
