import { useState } from 'react'
import { Tab } from '@headlessui/react'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const menuCategories = {
  Appetizers: [
    { name: 'Bruschetta', description: 'Toasted bread topped with tomatoes, garlic, and basil', price: '$8', image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60' },
    { name: 'Calamari', description: 'Lightly fried squid served with marinara sauce', price: '$12', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60' },
    { name: 'Caprese Salad', description: 'Fresh mozzarella, tomatoes, and basil drizzled with balsamic glaze', price: '$10', image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60' },
    { name: 'Spinach Artichoke Dip', description: 'Creamy spinach and artichoke dip served with tortilla chips', price: '$9', image: 'https://images.unsplash.com/photo-1576072115035-e8b3748c20ee?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60' },
    { name: 'Stuffed Mushrooms', description: 'Button mushrooms filled with herbs and cheese', price: '$11', image: 'https://images.unsplash.com/photo-1621841957884-1210fe19b810?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60' },
  ],
  'Main Courses': [
    { name: 'Grilled Salmon', description: 'Fresh salmon fillet with lemon butter sauce', price: '$22', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60' },
    { name: 'Beef Tenderloin', description: '8oz beef tenderloin with red wine reduction', price: '$28', image: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60' },
    { name: 'Mushroom Risotto', description: 'Creamy Arborio rice with wild mushrooms and Parmesan', price: '$18', image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60' },
    { name: 'Chicken Parmesan', description: 'Breaded chicken breast topped with marinara and mozzarella', price: '$20', image: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60' },
    { name: 'Vegetable Stir Fry', description: 'Mixed vegetables in a savory sauce over rice', price: '$16', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60' },
  ],
  'Pasta & Pizza': [
    { name: 'Spaghetti Carbonara', description: 'Classic carbonara with pancetta and egg', price: '$16', image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60' },
    { name: 'Margherita Pizza', description: 'Traditional pizza with tomato, mozzarella, and basil', price: '$14', image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60' },
    { name: 'Fettuccine Alfredo', description: 'Fettuccine pasta in a creamy Parmesan sauce', price: '$15', image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60' },
    { name: 'Penne Arrabbiata', description: 'Penne pasta in a spicy tomato sauce', price: '$14', image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60' },
    { name: 'Quattro Formaggi Pizza', description: 'Four cheese pizza with mozzarella, gorgonzola, parmesan, and ricotta', price: '$16', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60' },
  ],
  Desserts: [
    { name: 'Tiramisu', description: 'Classic Italian coffee-flavored dessert', price: '$8', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60' },
    { name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with a molten center', price: '$10', image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60' },
    { name: 'Crème Brûlée', description: 'Rich custard topped with caramelized sugar', price: '$9', image: 'https://images.unsplash.com/photo-1470324161839-ce2bb6fa6bc3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60' },
    { name: 'New York Cheesecake', description: 'Creamy cheesecake with a graham cracker crust', price: '$8', image: 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60' },
    { name: 'Fruit Tart', description: 'Buttery tart shell filled with pastry cream and fresh fruits', price: '$9', image: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60' },
  ],
}

function Menu() {
  const [categories] = useState(menuCategories)

  return (
    <div className="bg-gray-100 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-12">Our Menu</h2>
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-white p-1 shadow-lg mb-12">
            {Object.keys(categories).map((category) => (
              <Tab
                key={category}
                className={({ selected }) =>
                  classNames(
                    'w-full rounded-lg py-3 text-sm font-medium leading-5',
                    'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60',
                    selected
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-gray-600 hover:bg-blue-100 hover:text-blue-600'
                  )
                }
              >
                {category}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels>
            {Object.values(categories).map((dishes, idx) => (
              <Tab.Panel
                key={idx}
                className={classNames(
                  'rounded-xl bg-white p-6 shadow-lg',
                  'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60'
                )}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {dishes.map((dish) => (
                    <div key={dish.name} className="bg-white rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:scale-105">
                      <img src={dish.image} alt={dish.name} className="w-full h-48 object-cover" />
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{dish.name}</h3>
                        <p className="text-sm text-gray-600 mb-4">{dish.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-blue-600">{dish.price}</span>
                          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300">
                            Order Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  )
}

export default Menu