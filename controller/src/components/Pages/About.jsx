import React from 'react';

const About = ({username}) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">About</h1>
      <p className="text-lg">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis sagittis arcu.
        Integer bibendum nulla nec semper aliquet. Donec nec fermentum dolor. 
        Fusce eget velit nec purus vulputate fermentum.
      </p>
      <p className="text-lg mt-4">
        Nulla facilisi. Nam nec nisi non justo maximus finibus. Duis feugiat fermentum enim, 
        et posuere velit consequat eu.
      </p>
    </div>
  );
};

export default About;
