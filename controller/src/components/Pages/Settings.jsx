import React, { useEffect, useState } from 'react';
import {fetchHabits, selectedHabitDetails } from '../../functions/habits';
import HabitOptions from '../habitoptions';

const Settings = () => {
    const [username, setUsername] = useState(localStorage.getItem('username'));
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
    }, [selectedHabit]);

    function submitData(event) {
      event.preventDefault();
      if (selectedHabit.habitName !== "Select a habit") {
        if (button === "delete") {
          fetch('https://habit-heatmap-api-d98a01d08072.herokuapp.com/api/v1/removeHabit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({"username": username, "habitName": selectedHabit.habitName}),
          }).then(response => {
            if (response.ok) {
              console.log(response.json());
            }
            const updatedHabits = habits.filter(habit => habit.habitName !== selectedHabit.habitName); 
            setHabits(updatedHabits);
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
          fetch('https://habit-heatmap-api-d98a01d08072.herokuapp.com/api/v1/updateHabit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({"username": username, "habitName": selectedHabit.habitName, "newHabitName": title, "metric": metric, "color": color}),
          }).then(response => {
            if (response.ok) {
              const updatedHabits = habits.map(habit => {
                if (habit.habitName === selectedHabit.habitName) {
                  habit.habitName = title;
                  habit.metric = metric;
                  habit.color = color;
                }
                return habit;
              });
              setHabits(updatedHabits);
              setSelectedHabit({"habitName": title, "metric": metric, "color": color});
              console.log(response.json());
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

    function updateUsername(e) {
      e.preventDefault();
      const formData = new FormData(e.target);
      const newUsername = formData.get('username');
      console.log(newUsername)
      fetch('https://habit-heatmap-api-d98a01d08072.herokuapp.com/api/v1/updateUsername', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({"username": username, "newUsername": newUsername}),
      }).then(response => {
        if (response.ok) {
          setUsername(newUsername);
          console.log(response.json());
        }
      }).catch((error) => {
        console.error('Error:', error);
      }
      )
    }

    return(
      <>
        <form className="max-w-md mx-auto bg-white shadow-md rounded px-8 mt-12 pt-6 pb-4 mb-4" onSubmit={updateUsername}>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">Update Username</label>
          <div className="flex items-center space-x-4">
            <input placeholder={username} className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none flex-grow" type="text" name="username" />
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded focus:outline-none mx-auto" type="submit">Update</button>
          </div>
        </form>
        <form className="max-w-md mx-auto bg-white shadow-md rounded px-8 mt-12 pt-6 pb-8 mb-4" onSubmit={submitData}>
          <HabitOptions habits={habits} handleChange={handleChange}></HabitOptions>
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
              <option value="orange">Orange</option>
              <option value="blue">Blue</option>
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
      </>
  );
}

export default Settings
