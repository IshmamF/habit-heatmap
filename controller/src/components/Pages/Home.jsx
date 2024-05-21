import React, { useState, useEffect } from 'react';

function Home({ username }) {
    const [recentHabits, setRecentHabits] = useState([]);
    const [recentNotes, setRecentNotes] = useState([]);
    const [quote, setQuote] = useState('');

    useEffect(() => {
        fetch('http://127.0.0.1:8080/api/v1/get_recent_habits', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify({ username }),
        })
            .then(response => response.json())
            .then(data => {
                setRecentHabits(data.result);
                console.log(data.result);
            });

        fetch('http://127.0.0.1:8080/api/v1/get_recent_notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify({ username }),
        })
            .then(response => response.json())
            .then(data => {
                setRecentNotes(data.result);
                console.log(data.result);
            });
        
        fetch(`https://api.api-ninjas.com/v1/quotes?category=inspirational`, { 
            method: 'GET',
            headers: {
              'X-Api-Key': 'MqTrXKuy1zXQi8S49RNCNA==leho72JwM3kMtacL'
            }
          })
          .then(response => response.json())
          .then(data => {
            setQuote(data[0].quote);
          });
    }, [username]);
    return (
      <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">Welcome, {username}!</h1>
          <p className="text-lg italic mb-6">{quote}</p>

          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Recent Habit Changes</h2>
              <ul className="list-none p-0">
                  {recentHabits.length > 0 ? (
                      recentHabits.map((habit, index) => (
                          <li key={index} className="mb-2 text-lg border-b pb-2">
                              <span className="font-semibold">{habit.habitName}</span>: 
                              <span className="ml-2">{habit.value} {habit.metric}</span>
                              <span className="ml-4 text-sm text-gray-500">{habit.date}</span>
                          </li>
                      ))
                  ) : (
                      <li className="mb-2 text-lg text-gray-500">No recent habit changes</li>
                  )}
              </ul>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Recent Notes</h2>
              <ul className="list-none p-0">
                  {recentNotes.length > 0 ? (
                      recentNotes.map((note, index) => (
                          <li key={index} className="mb-2 text-lg border-b pb-2">
                              <span className="font-semibold">{note.note}</span>
                              <span className="ml-4 text-sm text-gray-500">{note.date}</span>
                          </li>
                      ))
                  ) : (
                      <li className="mb-2 text-lg text-gray-500">No recent notes</li>
                  )}
              </ul>
          </div>
      </div>
  );
}

export default Home;
