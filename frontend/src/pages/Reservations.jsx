import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { createReservation } from '../utils/api'
import { AuthContext } from '../context/AuthContext'
import DatePicker from 'react-datepicker'
import { motion } from 'framer-motion'
import { FaCalendarAlt, FaClock, FaUsers, FaChair } from 'react-icons/fa'
import "react-datepicker/dist/react-datepicker.css"

function Reservations() {
  const { user } = useContext(AuthContext)
  const [reservation, setReservation] = useState({
    date: new Date(),
    time: '12:00',
    guests: 2,
    tableType: '',
  })
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const formattedReservation = {
        ...reservation,
        date: reservation.date.toISOString().split('T')[0],
        time: reservation.time,
      }
      const response = await createReservation(formattedReservation)
      console.log('Reservation created:', response.data);
      toast.success('Reservation submitted successfully!')
      navigate('/')
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred while submitting the reservation')
     }
   } 

  const inputVariants = {
    focus: { scale: 1.05, transition: { duration: 0.3 } },
    blur: { scale: 1, transition: { duration: 0.3 } }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img className="h-48 w-full object-cover md:h-full md:w-48" src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" alt="Restaurant" />
          </div>
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">Make a Reservation</div>
            <h1 className="block mt-1 text-lg leading-tight font-medium text-black">Reserve Your Table</h1>
            {user ? (
              <form onSubmit={handleSubmit} className="mt-6">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
                    <FaCalendarAlt className="inline mr-2" />Date
                  </label>
                  <motion.div variants={inputVariants} whileFocus="focus" whileBlur="blur">
                    <DatePicker
                      selected={reservation.date}
                      onChange={(date) => setReservation({ ...reservation, date })}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </motion.div>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="time">
                    <FaClock className="inline mr-2" />Time
                  </label>
                  <motion.input
                    type="time"
                    value={reservation.time}
                    onChange={(e) => setReservation({ ...reservation, time: e.target.value })}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                    variants={inputVariants}
                    whileFocus="focus"
                    whileBlur="blur"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="guests">
                    <FaUsers className="inline mr-2" />Number of Guests
                  </label>
                  <motion.input
                    type="number"
                    value={reservation.guests}
                    onChange={(e) => setReservation({ ...reservation, guests: parseInt(e.target.value, 10) })}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                    min="1"
                    variants={inputVariants}
                    whileFocus="focus"
                    whileBlur="blur"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tableType">
                    <FaChair className="inline mr-2" />Table Type
                  </label>
                  <motion.select
                    value={reservation.tableType}
                    onChange={(e) => setReservation({ ...reservation, tableType: e.target.value })}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                    variants={inputVariants}
                    whileFocus="focus"
                    whileBlur="blur"
                  >
                    <option value="">Select table type</option>
                    <option value="indoor">Indoor</option>
                    <option value="outdoor">Outdoor</option>
                    <option value="private">Private Room</option>
                  </motion.select>
                </div>
                <motion.button
                  type="submit"
                  className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Submit Reservation
                </motion.button>
              </form>
            ) : (
              <p className="mt-6 text-center">
                Please <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-semibold">login</Link> to make a reservation.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reservations