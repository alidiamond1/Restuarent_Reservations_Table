import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import DataTable from 'react-data-table-component';
import { getCustomers, sendPromotion } from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaUserCircle, FaCalendarCheck, FaSearch } from 'react-icons/fa';

function CustomerManagement() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [promotionMessage, setPromotionMessage] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await getCustomers();
      setCustomers(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch customers');
      setLoading(false);
    }
  };

  const handleSendPromotion = async () => {
    try {
      await sendPromotion(selectedCustomer._id, promotionMessage);
      toast.success('Promotion sent successfully');
      setPromotionMessage('');
      setSelectedCustomer(null);
    } catch (error) {
      toast.error('Failed to send promotion');
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      name: 'Name',
      selector: row => row.name,
      sortable: true,
      cell: row => (
        <div className="flex items-center">
          <FaUserCircle className="mr-2 text-gray-500" />
          {row.name}
        </div>
      ),
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true,
      cell: row => (
        <div className="flex items-center">
          <FaEnvelope className="mr-2 text-gray-500" />
          {row.email}
        </div>
      ),
    },
    {
      name: 'Total Reservations',
      selector: row => row.reservations.length,
      sortable: true,
      cell: row => (
        <div className="flex items-center">
          <FaCalendarCheck className="mr-2 text-gray-500" />
          {row.reservations.length}
        </div>
      ),
    },
    {
      name: 'Actions',
      cell: (row) => (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelectedCustomer(row)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
        >
          Send Promotion
        </motion.button>
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
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Customer Management</h1>
      <div className="mb-6 relative">
        <FaSearch className="absolute top-3 left-3 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search customers..."
          className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
        />
      </div>
      <DataTable
        columns={columns}
        data={filteredCustomers}
        pagination
        progressPending={loading}
        customStyles={customStyles}
        highlightOnHover
        pointerOnHover
      />
      <AnimatePresence>
        {selectedCustomer && (
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
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Send Promotion</h2>
              <p className="mb-4 text-gray-600">Sending promotion to: {selectedCustomer.name}</p>
              <textarea
                value={promotionMessage}
                onChange={(e) => setPromotionMessage(e.target.value)}
                placeholder="Enter promotion message"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 mb-4"
                rows="4"
              />
              <div className="flex justify-end space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCustomer(null)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition duration-300"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendPromotion}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                >
                  Send
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CustomerManagement;