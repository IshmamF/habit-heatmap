import React, { useEffect, useState } from 'react';
import { getHabitOptions , fetchHabits, selectedHabitDetails } from '../../functions/habits';

const Settings = () => {
    const username = "testuser";
    const [habits, setHabits] = useState([]);
    const [selectedHabit, setSelectedHabit] = useState({"habitName": "Select a habit", "metric": "Select a habit", "color": "Select a habit"});
    const [button, setButton] = useState("");

    function handleChange(event) {
        setSelectedHabit(selectedHabitDetails(event.target.value, habits));
    }

    useEffect(() => {
      async function loadHabits() {
        const fetchedHabits = await fetchHabits(username);
        setHabits(fetchedHabits);
      }
      loadHabits();
    }, []);

    function submitData(event) {
      event.preventDefault();
      if (selectedHabit.habitName !== "Select a habit") {
        if (button === "delete") {
          fetch('http://localhost:8080/api/v1/removeHabit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({"username": username, "habitName": selectedHabit.habitName}),
          }).then(response => {
            if (response.ok) {
              console.log(response.json());
            } 
          }).catch((error) => {
            console.error('Error:', error);
          }
          )
        } else {
          const formData = new FormData(event.target);
          if (formData.get('title') === "") {
            formData.set('title', selectedHabit.habitName);
          }
          if (formData.get('metric') === "") { 
            formData.set('metric', selectedHabit.metric);
          }
          const title = formData.get('title');
          const metric = formData.get('metric');
          const color = formData.get('color');
          fetch('http://localhost:8080/api/v1/updateHabit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({"username": username, "habitName": selectedHabit.habitName, "newHabitName": title, "metric": metric, "color": color}),
          }).then(response => {
            if (response.ok) {
              console.log(response.json());
              alert("Habit updated successfully!");
            } else {
              alert("Failed to update habit");
            }
          }).catch((error) => {
            console.error('Error:', error);
          }
          )
        }
      } else {
        alert("Please select a habit to delete");
      }
    }

    return(
      <form className="max-w-md mx-auto bg-white shadow-md rounded px-8 mt-12 pt-6 pb-8 mb-4" onSubmit={submitData}>
        <div className='mb-4'>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="habit">
            Select Habit:
          </label>
          <select onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none " name="habit">
            <option value="select">Select a Habit</option>
            {getHabitOptions(habits)}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            Title
          </label>
          <input placeholder={selectedHabit.habitName} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none " type="text" name="title" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="metric">
            Metric
          </label>
          <input placeholder={selectedHabit.metric} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none " type="text" name="metric" />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="color">
            Pick a color:
          </label>
          <select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none" name="color">
            <option value="green">Green</option>
          </select>
        </div>
        <div className="flex items-center justify-between mt-8">
          <button onClick={() => setButton("update")} className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none" type="submit" value="update">
            Update
          </button>
          <button onClick={() => setButton("delete")} type="submit" className="bg-slate-400 opacity-50 hover:opacity-100 text-white font-bold py-2 px-4 rounded focus:outline-none" value="delete">
            Delete
          </button>
        </div>
      </form>
  );
}

export default Settings
