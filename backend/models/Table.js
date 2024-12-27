const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
    unique: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['indoor', 'outdoor', 'private'],
    default: 'indoor',
  },
  status: {
    type: String,
    enum: ['available', 'reserved', 'occupied'],
    default: 'available',
  },
  currentReservation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reservation'
  }
});

module.exports = mongoose.model('Table', tableSchema);