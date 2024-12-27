const express = require('express');
const { getAllTables, addTable, updateTable, deleteTable } = require('../controllers/tableController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getAllTables);
router.post('/', protect, authorize('admin'), addTable);
router.put('/:id', protect, authorize('admin'), updateTable);
router.delete('/:id', protect, authorize('admin'), deleteTable);

module.exports = router;