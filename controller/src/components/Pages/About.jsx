import React, { useEffect, useState } from 'react';

const About = ({ theme }) => {
  const [text, setText] = useState('');
  const bioText = "Habit Heatmap is a goal tracker that will allow users to mark their goals and activities through the use of heatmaps. This project was created by Ishmam Fardin, Abrar Habib, and Yared Pena.";

  useEffect(() => {
    let index = 0;
    let typingTimeout;

    const typingEffect = () => {
      if (index < bioText.length) {
        setText((prev) => prev + bioText.charAt(index));
        index++;
        typingTimeout = setTimeout(typingEffect, 50);
      }
    };

    typingEffect();

    return () => {
      clearTimeout(typingTimeout);
    };
  }, []);

  return (
    <div className={`flex items-center justify-center min-h-screen transition-all duration-500 ease-in-out ${theme === 'light' ? 'bg-gray-100 text-black' : 'bg-zinc-900 text-white'}`}>
      <div className={`p-8 rounded shadow-md w-full max-w-md transition-all duration-500 ease-in-out ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
        <h2 className="text-3xl font-bold mb-4">About Habit Heatmap</h2>
        <p className="text-lg">{text}</p>
      </div>
    </div>
  );
};

export default About;