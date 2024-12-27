import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import DataTable from 'react-data-table-component';
// import { getReservations, updateReservation, cancelReservation, assignTable, getTables } from '../utils/api';
import { getAdminReservations, updateAdminReservation, cancelAdminReservation, assignTable, getTables } from '../utils/api';
import { motion } from 'framer-motion';
import { FaEdit, FaTimes, FaChair } from 'react-icons/fa';

function ReservationManagement() {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReservation, setEditingReservation] = useState(null);

  useEffect(() => {
    fetchReservations();
    fetchTables();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await getAdminReservations();
      setReservations(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch reservations');
      setLoading(false);
  }
};

  const fetchTables = async () => {
    try {
      const response = await getTables();
      setTables(response.data);
    } catch (error) {
      toast.error('Failed to fetch tables');
    }
  };

  const handleUpdateReservation = async (id, updatedData) => {
    try {
      await updateAdminReservation(id, updatedData);
      toast.success('Reservation updated successfully');
      fetchReservations();
      setEditingReservation(null);
    } catch (error) {
      console.error('Error updating reservation:', error);
      toast.error('Failed to update reservation');
    }
  };

  const handleCancelReservation = async (id) => {
    try {
      await cancelAdminReservation(id);
      toast.success('Reservation cancelled successfully');
      fetchReservations();
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      toast.error('Failed to cancel reservation');
    }
  };

  const handleAssignTable = async (reservationId, tableId) => {
    try {
      await assignTable(reservationId, tableId);
      toast.success('Table assigned successfully');
      fetchReservations();
    } catch (error) {
      toast.error('Failed to assign table');
    }
  };

  const columns = [
    {
      name: 'Customer',
      selector: row => row.user.name,
      sortable: true,
      cell: row => <div className="font-semibold text-gray-800">{row.user.name}</div>,
    },
    {
      name: 'Date',
      selector: row => new Date(row.date).toLocaleDateString(),
      sortable: true,
      cell: row => <div className="text-gray-600">{new Date(row.date).toLocaleDateString()}</div>,
    },
    {
      name: 'Time',
      selector: row => row.time,
      sortable: true,
      cell: row => <div className="text-gray-600">{row.time}</div>,
    },
    {
      name: 'Guests',
      selector: row => row.guests,
      sortable: true,
      cell: row => <div className="text-center bg-blue-100 text-blue-800 py-1 px-2 rounded-full">{row.guests}</div>,
    },
    {
      name: 'Table',
      selector: row => row.table ? row.table.number : 'Not assigned',
      sortable: true,
      cell: row => (
        <div className={`text-center py-1 px-2 rounded-full ${row.table ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
          {row.table ? row.table.number : 'Not assigned'}
        </div>
      ),
    },
    {
      name: 'Status',
      selector: row => row.status,
      sortable: true,
      cell: row => (
        <div className={`text-center py-1 px-2 rounded-full ${
          row.status === 'confirmed' ? 'bg-green-100 text-green-800' :
          row.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </div>
      ),
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setEditingReservation(row)}
            className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition duration-300"
          >
            <FaEdit />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleCancelReservation(row._id)}
            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition duration-300"
          >
            <FaTimes />
          </motion.button>
          <motion.select
            whileHover={{ scale: 1.05 }}
            onChange={(e) => handleAssignTable(row._id, e.target.value)}
            className="border rounded p-2 bg-white text-gray-800 hover:border-blue-500 transition duration-300"
            value={row.table ? row.table._id : ''}
          >
            <option value="">Assign Table</option>
            {tables.map(table => (
              <option key={table._id} value={table._id}>{table.number}</option>
            ))}
          </motion.select>
        </div>
      ),
    },
  ];

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: '#f3f4f6',
        color: '#374151',
        fontWeight: 'bold',
      },
    },
    rows: {
      style: {
        '&:nth-of-type(odd)': {
          backgroundColor: '#f9fafb',
        },
        '&:hover': {
          backgroundColor: '#e5e7eb',
          transition: 'all 0.3s',
        },
      },
    },
  };

  return (
    <div className="container mx-auto mt-8 px-4 py-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Reservation Management</h1>
      <DataTable
        columns={columns}
        data={reservations}
        pagination
        progressPending={loading}
        customStyles={customStyles}
        highlightOnHover
        pointerOnHover
      />
      {editingReservation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative p-8 bg-white w-full max-w-md m-auto rounded-lg shadow-lg"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Edit Reservation</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleUpdateReservation(editingReservation._id, editingReservation);
            }}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  value={new Date(editingReservation.date).toISOString().split('T')[0]}
                  onChange={(e) => setEditingReservation({...editingReservation, date: e.target.value})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="time">
                  Time
                </label>
                <input
                  type="time"
                  id="time"
                  value={editingReservation.time}
                  onChange={(e) => setEditingReservation({...editingReservation, time: e.target.value})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="guests">
                  Guests
                </label>
                <input
                  type="number"
                  id="guests"
                  value={editingReservation.guests}
                  onChange={(e) => setEditingReservation({...editingReservation, guests: e.target.value})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                  Status
                </label>
                <select
                  id="status"
                  value={editingReservation.status}
                  onChange={(e) => setEditingReservation({...editingReservation, status: e.target.value})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
                >
                  Update
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => setEditingReservation(null)}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default ReservationManagement;