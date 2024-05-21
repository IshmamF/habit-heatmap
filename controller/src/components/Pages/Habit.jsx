import React, { useEffect, useState } from 'react';
import Heatmap from '../heatmap';
import {fetchHabits, selectedHabitDetails } from '../../functions/habits';
import HabitOptions from '../habitoptions';

const Habit = () => {
  const username = localStorage.getItem('username');
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
      <HabitOptions habits={habits} handleChange={handleChange}></HabitOptions>
      <Heatmap selectedHabit={selectedHabit} setSelectedHabit={setSelectedHabit} username={username}></Heatmap>
    </div>
  )
}

export default Habit
