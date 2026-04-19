const express = require('express');
const { 
    getStats, 
    approveCar, 
    getAllUsers, 
    deleteUser, 
    getAllCars, 
    toggleFeatured,
    deleteCar
} = require('../controllers/adminController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('Admin'));

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/cars', getAllCars);
router.put('/cars/:id/approve', approveCar);
router.put('/cars/:id/featured', toggleFeatured);
router.delete('/cars/:id', deleteCar);

module.exports = router;
