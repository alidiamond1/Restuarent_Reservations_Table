const Reservation = require('../models/Reservation');
const User = require('../models/User');
const Table = require('../models/Table');

exports.getDashboardData = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalReservations = await Reservation.countDocuments();
    const todayReservations = await Reservation.countDocuments({ date: { $gte: today } });
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const availableTables = await Table.countDocuments({ status: 'available' });

    const recentReservations = await Reservation.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email');

    res.status(200).json({
      totalReservations,
      todayReservations,
      totalCustomers,
      availableTables,
      recentReservations,
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

exports.getTables = async (req, res) => {
  try {
    const { search, type } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { number: { $regex: search, $options: 'i' } },
        { type: { $regex: search, $options: 'i' } }
      ];
    }

    if (type && type !== 'all') {
      query.type = type;
    }

    const tables = await Table.find(query).populate('currentReservation');
    res.status(200).json(tables);
  } catch (error) {
    console.error('Error in getTables:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

exports.addTable = async (req, res) => {
  try {
    const { number, capacity, type } = req.body;
    const table = new Table({ number, capacity, type });
    await table.save();
    res.status(201).json(table);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

exports.deleteTable = async (req, res) => {
  try {
    const { id } = req.params;
    await Table.findByIdAndDelete(id);
    res.status(200).json({ message: 'Table deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

exports.updateTable = async (req, res) => {
  try {
    const { id } = req.params;
    const { number, capacity, type, status } = req.body;

    const table = await Table.findByIdAndUpdate(
      id,
      { number, capacity, type, status },
      { new: true }
    );

    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    res.status(200).json(table);
  } catch (error) {
    console.error('Error updating table:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

exports.getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate('user', 'name email')
      .populate('table', 'number');
    console.log('Reservations fetched:', reservations); // Add this line for debugging
    res.status(200).json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error); // Add this line for debugging
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

exports.updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedReservation = await Reservation.findByIdAndUpdate(id, req.body, { new: true })
      .populate('user', 'name email')
      .populate('table', 'number');
    if (!updatedReservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    res.status(200).json(updatedReservation);
  } catch (error) {
    console.error('Error updating reservation:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

exports.cancelReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const cancelledReservation = await Reservation.findByIdAndDelete(id);
    if (!cancelledReservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    res.status(200).json({ message: 'Reservation cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling reservation:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

exports.assignTable = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const { tableId } = req.body;
    const updatedReservation = await Reservation.findByIdAndUpdate(
      reservationId,
      { table: tableId },
      { new: true }
    ).populate('table', 'number');
    if (!updatedReservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    res.status(200).json(updatedReservation);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};