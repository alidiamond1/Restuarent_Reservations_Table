const express = require('express');
const { 
  getDashboardData, 
  getTables, 
  addTable, 
  updateTable, 
  deleteTable,
  getReservations,
  updateReservation,
  cancelReservation,
  assignTable
} = require('../controllers/adminController');
const { getCustomers, sendPromotion } = require('../controllers/customerController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getDashboardData);

// Table routes
router.get('/tables', getTables);
router.post('/tables', addTable);
router.put('/tables/:id', updateTable);
router.delete('/tables/:id', deleteTable);

// Reservation routes
router.get('/reservations', getReservations);
router.put('/reservations/:id', updateReservation);
router.delete('/reservations/:id', cancelReservation);
router.post('/reservations/:reservationId/assign-table', assignTable);

// Customer routes
router.get('/customers', getCustomers);
router.post('/customers/:id/promotion', sendPromotion);

module.exports = router;