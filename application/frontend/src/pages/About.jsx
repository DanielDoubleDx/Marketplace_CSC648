import React from 'react';

function About() {
  const teamMembers = [
    {
      name: 'Clark Batungbakal',
      role: 'Team Leader',
      description: 'I am a Marine Corps veteran and a Computer Science student at San Francisco State University, set to graduate in December 2025. My interests lie in cloud application development. I have a deep appreciation for Korean history and culture, which I have explored through coursework and personal experiences. I also enjoy traveling, especially to South Korea, where I have gained a new perspective on food, language, and traditions. Feel free to connect with me—I am always open to new opportunities and collaborations! Passionate about creating innovative solutions for our customers.',
      avatar: '/images/clark.jpeg'
    },
    {
      name: 'Thanh Cong Duong',
      role: 'Front-End Leader',
      description: 'I am a Computer Science student at San Francisco State University. I will graduate on Spring 2025. I am interested in traveling around the world to know more about many different cultures, especially food.',
      avatar: '/images/thanh.jpg'
    },
    {
      name: 'Caleb Onuonga',
      role: 'Back-End Leader',
      description: 'Hi everyone my name is Caleb Onuonga. I am team 4\'s backend lead. In my freetime I enjoy reading, playing video games, watching anime, hiking, playing basketball and hanging with my friends.',
      avatar: '/images/caleb.jpeg'
    },
    {
      name: 'Trinity Godwin',
      role: 'GitHub Master',
      description: 'Hello my name is Trinity Godwin. I am acting as Github master for team 04. I am excited to be working with my teammates and happy to be creating such a cool project.',
      avatar: '/images/trinity.jpg'
    },
    {
      name: 'Daniel Lee',
      role: 'Front-End Member',
      description: 'Ello, I am a double major in computer science and physiology. I like to try new things and the way I live is to go where the wind takes me. Currently I am looking into pharmacy school or veterinary school but who knows, just keeping my doors open.',
      avatar: '/images/daniel.png'
    },
  ];

  return (
    <div className="container mx-auto">
      {/* Page title and intro */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">About Us</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          "We are Team 4"
        </p>
      </section>

      {/* Team member cards */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition duration-300">
              <img src={member.avatar} alt={member.name} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover hover:scale-110 transition duration-300" />
              <h3 className="text-xl font-semibold mb-2 text-center">{member.name}</h3>
              <p className="text-primary-500 mb-3 text-center">{member.role}</p>
              <p className="text-gray-400 text-center">{member.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default About;
