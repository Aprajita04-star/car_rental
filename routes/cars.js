const express = require('express');
const {
    getCars,
    getCar,
    createCar,
    updateCar,
    deleteCar,
    getLocations
} = require('../controllers/carController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.get('/locations', getLocations);

router
    .route('/')
    .get(getCars)
    .post(protect, authorize('Owner', 'Admin'), createCar);

router
    .route('/:id')
    .get(getCar)
    .put(protect, authorize('Owner', 'Admin'), updateCar)
    .delete(protect, authorize('Owner', 'Admin'), deleteCar);

module.exports = router;
