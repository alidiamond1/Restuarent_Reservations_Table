const Reservation = require('../models/Reservation');
const Table = require('../models/Table');

exports.createReservation = async (req, res) => {
  try {
    const { date, time, guests, tableType } = req.body;
    const userId = req.user.id; // Assuming the protect middleware adds user to req

    const availableTable = await Table.findOne({ type: tableType, status: 'available', capacity: { $gte: guests } });
    
    if (!availableTable) {
      return res.status(400).json({ message: 'No available tables for the selected criteria' });
    }

    const reservation = new Reservation({
      user: userId,
      date,
      time,  // Ensure this field is included
      guests,
      tableType,
      table: availableTable._id,
      status: 'confirmed',
    });

    await reservation.save();

    availableTable.status = 'reserved';
    await availableTable.save();

    res.status(201).json(reservation);
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

exports.getUserReservations = async (req, res) => {
  try {
    console.log('Fetching reservations for user:', req.userId); // Add this line for debugging
    const reservations = await Reservation.find({ user: req.userId })
      .populate('table', 'number')
      .sort({ date: 1, time: 1 });
    console.log('Found reservations:', reservations); // Add this line for debugging
    res.status(200).json(reservations);
  } catch (error) {
    console.error('Error fetching user reservations:', error);
    res.status(500).json({ message: 'Error fetching reservations', error: error.message });
  }
};

exports.updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, time, guests, tableType } = req.body;

    const reservation = await Reservation.findById(id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    if (reservation.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this reservation' });
    }

    // Check if the new date and time are available
    const conflictingReservation = await Reservation.findOne({
      date,
      time,
      _id: { $ne: id },
      status: { $ne: 'cancelled' }
    });

    if (conflictingReservation) {
      return res.status(400).json({ message: 'This time slot is no longer available' });
    }

    reservation.date = date || reservation.date;
    reservation.time = time || reservation.time;
    reservation.guests = guests || reservation.guests;
    reservation.tableType = tableType || reservation.tableType;

    await reservation.save();

    res.status(200).json(reservation);
  } catch (error) {
    console.error('Error updating reservation:', error);
    res.status(500).json({ message: 'Error updating reservation', error: error.message });
  }
};

exports.cancelReservation = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findById(id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    if (reservation.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to cancel this reservation' });
    }

    reservation.status = 'cancelled';
    await reservation.save();

    // If there's a table assigned, make it available again
    if (reservation.table) {
      await Table.findByIdAndUpdate(reservation.table, { status: 'available' });
    }

    res.status(200).json({ message: 'Reservation cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling reservation:', error);
    res.status(500).json({ message: 'Error cancelling reservation', error: error.message });
  }
};

exports.deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findById(id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    if (reservation.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this reservation' });
    }

    if (reservation.status !== 'cancelled') {
      return res.status(400).json({ message: 'Only cancelled reservations can be deleted' });
    }

    await Reservation.findByIdAndDelete(id);

    res.status(200).json({ message: 'Reservation deleted successfully' });
  } catch (error) {
    console.error('Error deleting reservation:', error);
    res.status(500).json({ message: 'Error deleting reservation', error: error.message });
  }
};