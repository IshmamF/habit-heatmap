import React, { useEffect, useState } from 'react';
import Heatmap from '../heatmap';
import { fetchHabits, selectedHabitDetails } from '../../functions/habits';
import HabitOptions from '../habitoptions';

const Habit = ({ theme }) => {
  const username = localStorage.getItem('username');
  const [habits, setHabits] = useState([]);
  const [selectedHabit, setSelectedHabit] = useState({
    habitName: "Select a habit",
    metric: "Select a habit",
    color: "Select a habit",
    data: []
  });
  const [updatedHabit, setUpdatedHabit] = useState([]);
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadHabits() {
      try {
        const fetchedHabits = await fetchHabits(username);
        setHabits(fetchedHabits);
      } catch (error) {
        console.error("Failed to fetch habits", error);
      }
    }
    loadHabits();

    async function loadNotes() {
      try {
        const response = await fetch('https://habit-heatmap-api-d98a01d08072.herokuapp.com/api/v1/get_recent_notes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username }),
        });
        const data = await response.json();
        setNotes(data.result || []);
      } catch (error) {
        console.error("Failed to fetch notes", error);
        setNotes([]); // Initialize as an empty array in case of error
      }
    }
    loadNotes();
  }, [username]);

  useEffect(() => {
    setUpdatedHabit(selectedHabit.data);
  }, [selectedHabit]);

  async function handleChange(event) {
    const selected = selectedHabitDetails(event.target.value, habits);
    setSelectedHabit(selected);
    setUpdatedHabit(selected.data);
  }

  function handleSearchChange(event) {
    setSearchQuery(event.target.value);
  }

  const filteredNotes = notes.filter(note => note.note.toLowerCase().includes(searchQuery.toLowerCase()));
  const displayedNotes = searchQuery ? filteredNotes : notes.slice(0, 3);

  return (
    <div>
      <HabitOptions habits={habits} handleChange={handleChange} />
      <Heatmap selectedHabit={selectedHabit} updatedHabit={updatedHabit} setUpdatedHabit={setUpdatedHabit} />
      <div className="mt-8">
        <input
          type="text"
          placeholder="Search habit notes..."
          value={searchQuery}
          onChange={handleSearchChange}
          className={`p-2 border rounded mb-4 w-full max-w-md transition-colors duration-500 ease-in-out ${theme === 'light' ? 'bg-white text-black border-gray-300' : 'bg-gray-700 text-white border-gray-600'}`}
        />
        <h2 className="text-2xl font-bold mb-4">Habit Notes</h2>
        <ul className="list-none p-0">
          {displayedNotes.length > 0 ? (
            displayedNotes.map((note, index) => (
              <li key={index} className="mb-2 text-lg border-b pb-2">
                <span className="font-semibold">{note.note}</span>
                <span className="ml-4 text-sm text-gray-500">{note.date}</span>
              </li>
            ))
          ) : (
            <li className="mb-2 text-lg text-gray-500">No notes found</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Habit;