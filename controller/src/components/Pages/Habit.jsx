import React, { useEffect, useState } from 'react';
import Heatmap from '../heatmap';
import { getHabitOptions , fetchHabits, selectedHabitDetails } from '../../functions/habits';

const Habit = () => {
  const username = "testuser";
  const [habits, setHabits] = useState([]);
  const [selectedHabit, setSelectedHabit] = useState({"habitName": "Select a habit", "metric": "Select a habit", "color": "Select a habit", 'data': []});

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

  return (
    <div>
        <div className='mb-4'>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="habit">
            Select Habit:
          </label>
          <select onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none " name="habit">
            <option value="select">Select a Habit</option>
            {getHabitOptions(habits)}
          </select>
        </div>
      <Heatmap selectedHabit={selectedHabit}></Heatmap>
    </div>
  )
}

export default Habit
