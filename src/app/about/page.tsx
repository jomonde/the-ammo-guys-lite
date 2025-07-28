import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'About Us | The Ammo Guys',
  description: 'Learn about our mission, values, and the team behind The Ammo Guys.',
};

const team = [
  {
    name: 'Jonan Scheffler',
    role: 'Founder & CEO',
    bio: 'A passionate firearms enthusiast with over 15 years of experience in the industry, Jonan founded The Ammo Guys to solve the problem of ammo scarcity for responsible gun owners.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  // Add more team members as needed
];

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gray-900">
        <div className="absolute inset-0">
          <Image
            src="/images/range-background.jpg"
            alt="Shooting range"
            width={1920}
            height={1080}
            className="w-full h-full object-cover opacity-20"
            priority
          />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Our Story
          </h1>
          <p className="mt-6 text-xl text-indigo-100 max-w-3xl">
            Building a better way for responsible gun owners to secure their ammo supply.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="bg-white py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white">
            <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Our Mission</h2>
                <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                  Empowering responsible gun owners
                </p>
                <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
                  At The Ammo Guys, we believe in the right to bear arms and the importance of being prepared. 
                  Our mission is to make it easy and affordable for responsible gun owners to maintain a 
                  consistent ammo supply without the hassle of shortages or price gouging.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Our Values</h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              What we stand for
            </p>
          </div>

          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  name: 'Responsibility',
                  description: 'We promote safe and responsible gun ownership and usage.',
                  icon: '🔫',
                },
                {
                  name: 'Reliability',
                  description: 'Consistent, quality ammo when you need it, every time.',
                  icon: '🔄',
                },
                {
                  name: 'Community',
                  description: 'Supporting and growing the community of responsible gun owners.',
                  icon: '👥',
                },
                {
                  name: 'Transparency',
                  description: 'Honest pricing and clear communication with our customers.',
                  icon: '🔍',
                },
                {
                  name: 'Freedom',
                  description: 'Upholding the Second Amendment and personal freedoms.',
                  icon: '🦅',
                },
                {
                  name: 'Innovation',
                  description: 'Continuously improving our service to better serve you.',
                  icon: '💡',
                },
              ].map((value) => (
                <div key={value.name} className="pt-6">
                  <div className="flow-root bg-white rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                          <span className="text-2xl">{value.icon}</span>
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                        {value.name}
                      </h3>
                      <p className="mt-5 text-base text-gray-500">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-white py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Our Team</h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              The people behind the mission
            </p>
            <p className="max-w-2xl mt-5 mx-auto text-xl text-gray-500">
              Passionate individuals dedicated to serving the shooting community.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {team.map((person) => (
              <div key={person.name} className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div className="flex items-center justify-center">
                      <div className="relative h-40 w-40 rounded-full overflow-hidden">
                        <Image
                          src={person.image}
                          alt={person.name}
                          width={160}
                          height={160}
                          className="h-40 w-40 object-cover"
                        />
                      </div>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 text-center">
                      {person.name}
                    </h3>
                    <p className="text-indigo-600 text-center">{person.role}</p>
                    <p className="mt-5 text-base text-gray-500">{person.bio}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-indigo-600">Start building your stockpile today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <a
                href="/subscribe"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Get started
              </a>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
              >
                Contact us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
