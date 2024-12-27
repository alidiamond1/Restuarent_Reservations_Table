const User = require('../models/User');
const Reservation = require('../models/Reservation');

exports.getCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: 'customer' }).populate('reservations');
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

exports.sendPromotion = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const customer = await User.findById(id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    // Here you would implement the actual sending of the promotion
    // This could involve sending an email or SMS
    console.log(`Sending promotion to ${customer.email}: ${message}`);
    res.status(200).json({ message: 'Promotion sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};