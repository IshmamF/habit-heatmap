import React from 'react'

const AddHabit = ({username}) => {

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
      },
      body: JSON.stringify({"username": username, "habitName":title, "metric": metric, "color": color}),
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
    }
    )
  }
  
  return (
    <>
      <form onSubmit={submitData} className="max-w-md mx-auto bg-white shadow-md rounded px-8 mt-12 pt-6 pb-8 mb-4">
        <h1 className="mx-auto text-black text-lg font-bold text-center pb-4">Create a New Habit:</h1>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            Title
          </label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none" type="text" name="title" required/>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="metric">
            Metric
          </label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none" type="text" name="metric" required/>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="color">
            Pick a color:
          </label>
          <select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none" name="color">
              <option value="green">Green</option>
              <option value="orange">Orange</option>
              <option value="blue">Blue</option>
          </select>
        </div>
        <div className="flex items-center justify-center mt-8">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded " type="submit">
            Create
          </button>
        </div>
      </form>
    </>
  );  
}

export default AddHabit

