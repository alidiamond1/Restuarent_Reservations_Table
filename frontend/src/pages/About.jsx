import { Link } from 'react-router-dom'
import { FaUtensils, FaUsers, FaAward } from 'react-icons/fa'

function About() {
  return (
    <div className="bg-gray-100">
      {/* Hero Section */}
      <div className="relative bg-indigo-800 text-white">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"
            alt="Restaurant interior"
          />
          <div className="absolute inset-0 bg-indigo-800 opacity-75"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">About Our Restaurant</h1>
          <p className="mt-6 max-w-3xl text-xl">Discover the passion, flavors, and experiences that make us unique.</p>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Our Story</h2>
            <p className="mt-3 max-w-3xl text-lg text-gray-500">
              Founded in 2010, our restaurant has been serving delicious meals and creating memorable dining experiences for over a decade. What started as a small family-owned bistro has grown into a beloved culinary destination in our community.
            </p>
            <div className="mt-8 sm:flex">
              <div className="rounded-md shadow">
                <Link to="/reservations" className="flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                  Make a Reservation
                </Link>
              </div>
              <div className="mt-3 sm:mt-0 sm:ml-3">
                <Link to="/menu" className="flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
                  View Menu
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-8 lg:mt-0">
            <img
              className="rounded-lg shadow-lg"
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"
              alt="Restaurant dishes"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">What Sets Us Apart</h2>
            <p className="mt-4 text-lg text-gray-500">
              We're committed to providing an exceptional dining experience through our cuisine, service, and atmosphere.
            </p>
          </div>
          <dl className="mt-12 space-y-10 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-x-6 sm:gap-y-12 lg:gap-x-8">
            {[
              {
                name: 'Exquisite Cuisine',
                description: 'Our talented chefs craft dishes using only the finest, locally-sourced ingredients.',
                icon: FaUtensils,
              },
              {
                name: 'Exceptional Service',
                description: 'Our attentive staff ensures that every visit is memorable and enjoyable.',
                icon: FaUsers,
              },
              {
                name: 'Award-Winning',
                description: 'Recognized for our culinary excellence and outstanding dining experience.',
                icon: FaAward,
              },
            ].map((feature) => (
              <div key={feature.name} className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-gray-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 lg:py-24">
          <div className="space-y-12">
            <div className="space-y-5 sm:space-y-4 md:max-w-xl lg:max-w-3xl xl:max-w-none">
              <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">Meet Our Team</h2>
              <p className="text-xl text-gray-300">
                Our talented and passionate team works tirelessly to create unforgettable dining experiences for our guests.
              </p>
            </div>
            <ul className="space-y-4 sm:grid sm:grid-cols-2 sm:gap-6 sm:space-y-0 lg:grid-cols-3 lg:gap-8">
              {[
                {
                  name: 'John Doe',
                  role: 'Executive Chef',
                  imageUrl: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
                },
                {
                  name: 'Jane Smith',
                  role: 'Sous Chef',
                  imageUrl: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
                },
                {
                  name: 'Mike Johnson',
                  role: 'Restaurant Manager',
                  imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
                },
              ].map((person) => (
                <li key={person.name} className="py-10 px-6 bg-gray-800 text-center rounded-lg xl:px-10 xl:text-left">
                  <div className="space-y-6 xl:space-y-10">
                    <img className="mx-auto h-40 w-40 rounded-full xl:w-56 xl:h-56" src={person.imageUrl} alt="" />
                    <div className="space-y-2 xl:flex xl:items-center xl:justify-between">
                      <div className="font-medium text-lg leading-6 space-y-1">
                        <h3 className="text-white">{person.name}</h3>
                        <p className="text-indigo-400">{person.role}</p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;