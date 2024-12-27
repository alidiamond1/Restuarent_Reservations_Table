const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const reservationController = require('../controllers/reservationController');

router.delete('/:id', protect, reservationController.deleteReservation);