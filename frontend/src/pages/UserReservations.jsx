import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-hot-toast';
import { getUserReservations, updateReservation, cancelReservation, deleteReservation } from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FaEdit, FaTimes, FaCalendarAlt, FaClock, FaUsers, FaTrash } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import Modal from 'react-modal';
import "react-datepicker/dist/react-datepicker.css";

// Set the app element for react-modal
Modal.setAppElement('#root');

function UserReservations() {
  const { user } = useContext(AuthContext);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReservation, setEditingReservation] = useState(null);
  const [cancelModalIsOpen, setCancelModalIsOpen] = useState(false);
  const [reservationToCancel, setReservationToCancel] = useState(null);

  useEffect(() => {
    console.log('UserReservations component mounted');
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      console.log('Fetching reservations...');
      const response = await getUserReservations();
      console.log('Fetched reservations:', response.data);
      setReservations(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      toast.error('Failed to fetch reservations');
      setLoading(false);
     }
   };

  const handleEdit = (reservation) => {
    setEditingReservation({ ...reservation, date: new Date(reservation.date) });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateReservation(editingReservation._id, editingReservation);
      toast.success('Reservation updated successfully');
      setEditingReservation(null);
      fetchReservations();
    } catch (error) {
      toast.error('Failed to update reservation');
    }
  };

  const openCancelModal = (reservation) => {
    setReservationToCancel(reservation);
    setCancelModalIsOpen(true);
  };

  const closeCancelModal = () => {
    setReservationToCancel(null);
    setCancelModalIsOpen(false);
  };

  const handleCancel = async () => {
    if (reservationToCancel) {
      try {
        await cancelReservation(reservationToCancel._id);
        toast.success('Reservation cancelled successfully');
        fetchReservations();
        closeCancelModal();
      } catch (error) {
        toast.error('Failed to cancel reservation');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this cancelled reservation?')) {
      try {
        await deleteReservation(id);
        toast.success('Reservation deleted successfully');
        setReservations(reservations.filter(reservation => reservation._id !== id));
      } catch (error) {
        console.error('Error deleting reservation:', error);
        toast.error('Failed to delete reservation');
      }
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Reservations</h1>
      {reservations.length === 0 ? (
        <p>You have no reservations.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reservations.map((reservation) => (
            <motion.div
              key={reservation._id}
              className="bg-white rounded-lg shadow-md p-6"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Reservation #{reservation._id.slice(-4)}</h2>
                <div className="flex space-x-2">
                  {reservation.status !== 'cancelled' && (
                    <>
                      <button onClick={() => handleEdit(reservation)} className="text-blue-500 hover:text-blue-700">
                        <FaEdit />
                      </button>
                      <button onClick={() => openCancelModal(reservation)} className="text-red-500 hover:text-red-700">
                        <FaTimes />
                      </button>
                    </>
                  )}
                  {reservation.status === 'cancelled' && (
                    <button 
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this cancelled reservation?')) {
                          handleDelete(reservation._id);
                        }
                      }} 
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <p className="flex items-center"><FaCalendarAlt className="mr-2" /> {new Date(reservation.date).toLocaleDateString()}</p>
                <p className="flex items-center"><FaClock className="mr-2" /> {reservation.time}</p>
                <p className="flex items-center"><FaUsers className="mr-2" /> {reservation.guests} guests</p>
                <p className={`capitalize ${reservation.status === 'cancelled' ? 'text-red-500' : ''}`}>
                  Status: {reservation.status}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

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
            className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md"
          >
            <h2 className="text-2xl font-bold mb-4">Edit Reservation</h2>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Date</label>
                <DatePicker
                  selected={editingReservation.date}
                  onChange={(date) => setEditingReservation({ ...editingReservation, date })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Time</label>
                <input
                  type="time"
                  value={editingReservation.time}
                  onChange={(e) => setEditingReservation({ ...editingReservation, time: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Guests</label>
                <input
                  type="number"
                  value={editingReservation.guests}
                  onChange={(e) => setEditingReservation({ ...editingReservation, guests: parseInt(e.target.value) })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingReservation(null)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Update
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
      
      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={cancelModalIsOpen}
        onRequestClose={closeCancelModal}
        className="modal"
        overlayClassName="overlay"
      >
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">Cancel Reservation</h2>
          <p className="mb-6">Are you sure you want to cancel this reservation?</p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={closeCancelModal}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            >
              No, Keep It
            </button>
            <button
              onClick={handleCancel}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Yes, Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default UserReservations;