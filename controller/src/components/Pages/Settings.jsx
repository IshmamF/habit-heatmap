import React, { useEffect, useState } from 'react';
import { getHabitOptions , fetchHabits, selectedHabitDetails } from '../../functions/habits';

const Settings = () => {
    const username = "testuser";
    const [habits, setHabits] = useState([]);
    const [habitOption, sethabitOption] = useState("Select a habit");
    const [selectedHabit, setSelectedHabit] = useState({});

    function handleChange(event) {
        sethabitOption(event.target.value)
        setSelectedHabit(selectedHabitDetails(event.target.value, habits));
    }

    useEffect(() => {
      async function loadHabits() {
        const fetchedHabits = await fetchHabits(username);
        setHabits(fetchedHabits);
      }
      loadHabits();
    }, []);

    return(
      <form className="max-w-md mx-auto bg-white shadow-md rounded px-8 mt-12 pt-6 pb-8 mb-4">
        <div className='mb-4'>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="color">
            Select Habit:
          </label>
          <select value={habitOption} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none " name="color">
            {getHabitOptions(habits)}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            Title
          </label>
          <input placeholder={selectedHabit.habitName} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none " type="text" name="title" required/>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="metric">
            Metric
          </label>
          <input placeholder={selectedHabit.metric} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none " type="text" name="metric" required/>
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
          <button className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none" type="submit">
            Update
          </button>
          <button className="bg-slate-400 opacity-50 hover:opacity-100 text-white font-bold py-2 px-4 rounded focus:outline-none" type="submit">
            Delete
          </button>
        </div>
      </form>
  );
}

export default Settings
