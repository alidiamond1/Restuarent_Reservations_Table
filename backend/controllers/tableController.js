const Table = require('../models/Table');

exports.getAllTables = async (req, res) => {
  try {
    const tables = await Table.find();
    res.status(200).json(tables);
  } catch (error) {
    console.error('Error getting tables:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

exports.addTable = async (req, res) => {
  try {
    const { number, capacity, type } = req.body;
    const table = new Table({ number, capacity, type });
    await table.save();
    res.status(201).json(table);
  } catch (error) {
    console.error('Error adding table:', error);
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

exports.deleteTable = async (req, res) => {
  try {
    const { id } = req.params;
    const table = await Table.findByIdAndDelete(id);

    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    res.status(200).json({ message: 'Table deleted successfully' });
  } catch (error) {
    console.error('Error deleting table:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};