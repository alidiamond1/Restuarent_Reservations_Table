const express = require('express');
const { protect } = require('../middleware/auth');
const {
  createReservation,
  getUserReservations,
  updateReservation,
  cancelReservation
} = require('../controllers/reservationController');

const router = express.Router();

// Protect all routes
router.use(protect);

router.post('/', createReservation);
router.get('/', getUserReservations);
router.put('/:id', updateReservation);
router.delete('/:id', cancelReservation);

module.exports = router;