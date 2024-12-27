import { useState, useEffect, useContext, useCallback } from 'react'
import { toast } from 'react-hot-toast'
import { AuthContext } from '../context/AuthContext'
import { getDashboardData, getTables, addTable, deleteTable, updateTable } from '../utils/api'
import { FaUsers, FaCalendarCheck, FaChair, FaClipboardList, FaEdit, FaTrash, FaPlus, FaUtensils } from 'react-icons/fa'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import DataTable from 'react-data-table-component'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

function Dashboard() {
  const { user } = useContext(AuthContext)
  const [dashboardData, setDashboardData] = useState(null)
  const [tables, setTables] = useState([])
  const [newTable, setNewTable] = useState({ number: '', capacity: '', type: 'indoor' })
  const [editingTable, setEditingTable] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await getDashboardData()
        setDashboardData(response.data)
      } catch (error) {
        toast.error('Failed to fetch dashboard data')
      }
    }

    const fetchTables = async () => {
      try {
        const response = await getTables(searchTerm, filterType)
        setTables(response.data)
      } catch (error) {
        toast.error('Failed to fetch tables')
      }
    }

    if (user && user.role === 'admin') {
      fetchDashboardData()
      fetchTables()
    }
  }, [user, searchTerm, filterType])

  const handleAddTable = async (e) => {
    e.preventDefault()
    try {
      const response = await addTable(newTable)
      setTables(prevTables => [...prevTables, response.data])
      setNewTable({ number: '', capacity: '', type: 'indoor' })
      toast.success('Table added successfully')
    } catch (error) {
      toast.error('Failed to add table')
    }
  }

  const handleDeleteTable = async (tableId) => {
    try {
      await deleteTable(tableId)
      setTables(prevTables => prevTables.filter(table => table._id !== tableId))
      toast.success('Table deleted successfully')
    } catch (error) {
      toast.error('Failed to delete table')
    }
  }

  const handleEditTable = (table) => {
    setEditingTable({ ...table })
    setIsEditModalOpen(true)
  }

  const handleUpdateTable = async (e) => {
    e.preventDefault()
    try {
      const response = await updateTable(editingTable._id, editingTable)
      setTables(prevTables => prevTables.map(table => table._id === editingTable._id ? response.data : table))
      setIsEditModalOpen(false)
      setEditingTable(null)
      toast.success('Table updated successfully')
    } catch (error) {
      console.error('Error updating table:', error)
      toast.error('Failed to update table')
    }
  }

  const handleCancelEdit = () => {
    setIsEditModalOpen(false)
    setEditingTable(null)
  }

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Reservations',
        data: [65, 59, 80, 81, 56, 55],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  }

  const columns = [
    {
      name: 'Table Number',
      selector: row => row.number,
      sortable: true,
    },
    {
      name: 'Capacity',
      selector: row => row.capacity,
      sortable: true,
    },
    {
      name: 'Type',
      selector: row => row.type,
      sortable: true,
    },
    {
      name: 'Actions',
      cell: row => (
        <div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleEditTable(row)}
            className="text-blue-600 hover:text-blue-800 mr-2"
          >
            <FaEdit />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleDeleteTable(row._id)}
            className="text-red-600 hover:text-red-800"
          >
            <FaTrash />
          </motion.button>
        </div>
      ),
    },
  ]

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: '#f3f4f6',
        borderBottomWidth: '1px',
        borderBottomColor: '#e5e7eb',
      },
    },
    headCells: {
      style: {
        fontSize: '0.875rem',
        fontWeight: '600',
        textTransform: 'uppercase',
        color: '#374151',
      },
    },
    rows: {
      style: {
        fontSize: '0.875rem',
        '&:nth-of-type(odd)': {
          backgroundColor: '#f9fafb',
        },
        '&:hover': {
          backgroundColor: '#e5e7eb',
          transition: 'all 0.3s',
        },
      },
    },
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      {/* Add these new buttons */}
      <div className="mb-8 flex space-x-4">
        <Link 
          to="/admin/reservations" 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Manage Reservations
        </Link>
        <Link 
          to="/admin/customers" 
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Manage Customers
        </Link>
      </div>
      {dashboardData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <DashboardCard title="Total Reservations" value={dashboardData.totalReservations} icon={<FaCalendarCheck />} />
          <DashboardCard title="Today's Reservations" value={dashboardData.todayReservations} icon={<FaClipboardList />} />
          <DashboardCard title="Total Tables" value={dashboardData.totalTables} icon={<FaChair />} />
          <DashboardCard title="Total Customers" value={dashboardData.totalCustomers} icon={<FaUsers />} />
        </div>
      )}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Reservation Trends</h2>
        <Line data={chartData} />
      </div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Restaurant Layout</h2>
        <div className="bg-white p-6 rounded-lg shadow-lg" style={{
          backgroundImage: "url('https://example.com/restaurant-background.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}>
          <div className="grid grid-cols-5 gap-4">
            {tables.map((table) => (
              <motion.div
                key={table._id}
                whileHover={{ scale: 1.05 }}
                className={`aspect-square rounded-lg flex flex-col items-center justify-center text-white font-bold shadow-md relative overflow-hidden ${
                  table.currentReservation ? 'bg-red-500' : 'bg-green-500'
                }`}
                onClick={() => handleEditTable(table)}
                style={{
                  backgroundImage: `url('https://example.com/table-texture.jpg')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
                  <FaUtensils className="text-3xl mb-2" />
                  <span className="text-2xl">{table.number}</span>
                  <span className="text-sm mt-1">Capacity: {table.capacity}</span>
                  <span className="text-xs mt-1">{table.type}</span>
                  {table.currentReservation && (
                    <span className="absolute top-1 right-1 bg-white text-red-500 rounded-full p-1">
                      <FaUsers size={12} />
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center cursor-pointer"
              onClick={() => setNewTable({ number: '', capacity: '', type: 'indoor' })}
            >
              <FaPlus className="text-gray-400 text-2xl" />
            </motion.div>
          </div>
        </div>
      </div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Manage Tables</h2>
        <form onSubmit={handleAddTable} className="mb-4 bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="text"
              value={newTable.number}
              onChange={(e) => setNewTable({ ...newTable, number: e.target.value })}
              placeholder="Table Number"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="number"
              value={newTable.capacity}
              onChange={(e) => setNewTable({ ...newTable, capacity: e.target.value })}
              placeholder="Capacity"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <motion.select
              whileFocus={{ scale: 1.02 }}
              value={newTable.type}
              onChange={(e) => setNewTable({ ...newTable, type: e.target.value })}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="indoor">Indoor</option>
              <option value="outdoor">Outdoor</option>
              <option value="private">Private Room</option>
            </motion.select>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
          >
            Add Table
          </motion.button>
        </form>
        <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-2 md:mb-0">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tables..."
              className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="indoor">Indoor</option>
              <option value="outdoor">Outdoor</option>
              <option value="private">Private Room</option>
            </select>
          </div>
        </div>
        <DataTable
          columns={columns}
          data={tables}
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 20, 30, 40, 50]}
          customStyles={customStyles}
        />
      </div>

      <AnimatePresence>
        {isEditModalOpen && (
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
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Edit Table</h3>
              <form onSubmit={handleUpdateTable}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Table Number:</label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="text"
                    value={editingTable?.number || ''}
                    onChange={(e) => setEditingTable({ ...editingTable, number: e.target.value })}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Capacity:</label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="number"
                    value={editingTable?.capacity || ''}
                    onChange={(e) => setEditingTable({ ...editingTable, capacity: e.target.value })}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Type:</label>
                  <motion.select
                    whileFocus={{ scale: 1.02 }}
                    value={editingTable?.type || ''}
                    onChange={(e) => setEditingTable({ ...editingTable, type: e.target.value })}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="indoor">Indoor</option>
                    <option value="outdoor">Outdoor</option>
                    <option value="private">Private Room</option>
                  </motion.select>
                </div>
                <div className="flex justify-end space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={handleCancelEdit}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition duration-300"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                  >
                    Update Table
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function DashboardCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
      <div className="mr-4 text-3xl text-blue-500">{icon}</div>
      <div>
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  )
}

export default Dashboard