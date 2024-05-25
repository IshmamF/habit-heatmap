import React from 'react';

const AddHabit = ({ theme }) => {
  const username = localStorage.getItem('username');

  function submitData(event) {
    event.preventDefault(); 
  
    const formData = new FormData(event.target);
  
    const title = formData.get('title');
    const metric = formData.get('metric');
    const color = formData.get('color');

    fetch('https://habit-heatmap-api-d98a01d08072.herokuapp.com/api/v1/createHabit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": "Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify({"username": username, "habitName": title, "metric": metric, "color": color}),
    }).then(response => {
      if (response.ok) {
        console.log(response.json());
        alert("Habit created successfully!");
        window.location.href = "/habits";
      } else {
        alert("Failed to create habit");
      }
    }).catch((error) => {
      console.error('Error:', error);
    });
  }

  return (
    <div className={`flex items-center justify-center min-h-screen ${theme === 'light' ? 'bg-light-mode' : 'bg-dark-mode'}`}>
      <form
        onSubmit={submitData}
        className={`max-w-md w-full shadow-md rounded px-8 pt-6 pb-8 mb-4 transition-all duration-500 ease-in-out ${
          theme === 'light' ? 'bg-white' : 'bg-gray-800'
        }`}
      >
        <h1
          className={`text-lg font-bold text-center pb-4 transition-colors duration-500 ${
            theme === 'light' ? 'text-black' : 'text-white'
          }`}
        >
          Create a New Habit:
        </h1>
        <div className="mb-4">
          <label
            className={`block text-sm font-bold mb-2 transition-colors duration-500 ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}
            htmlFor="title"
          >
            Title
          </label>
          <input
            className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none transition-colors duration-500 ${
              theme === 'light' ? 'text-gray-700 bg-white border-gray-300' : 'text-gray-300 bg-gray-700 border-gray-600'
            }`}
            type="text"
            name="title"
            required
          />
        </div>
        <div className="mb-4">
          <label
            className={`block text-sm font-bold mb-2 transition-colors duration-500 ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}
            htmlFor="metric"
          >
            Metric
          </label>
          <input
            className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none transition-colors duration-500 ${
              theme === 'light' ? 'text-gray-700 bg-white border-gray-300' : 'text-gray-300 bg-gray-700 border-gray-600'
            }`}
            type="text"
            name="metric"
            required
          />
        </div>
        <div className="mb-4">
          <label
            className={`block text-sm font-bold mb-2 transition-colors duration-500 ${
              theme === 'light' ? 'text-gray-700' : 'text-gray-300'
            }`}
            htmlFor="color"
          >
            Pick a color:
          </label>
          <select
            className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none transition-colors duration-500 ${
              theme === 'light' ? 'text-gray-700 bg-white border-gray-300' : 'text-gray-300 bg-gray-700 border-gray-600'
            }`}
            name="color"
          >
            <option value="green">Green</option>
            <option value="orange">Orange</option>
            <option value="blue">Blue</option>
          </select>
        </div>
        <div className="flex items-center justify-center mt-8">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-500"
            type="submit"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddHabit;