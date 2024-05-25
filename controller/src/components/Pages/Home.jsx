import React, { useState, useEffect } from 'react';

function Home({ theme }) {
    const username = localStorage.getItem('username');
    const [recentHabits, setRecentHabits] = useState([]);
    const [recentNotes, setRecentNotes] = useState([]);
    const [quote, setQuote] = useState('');

    useEffect(() => {
        fetch('https://habit-heatmap-api-d98a01d08072.herokuapp.com/api/v1/get_recent_habits', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify({ username }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                setRecentHabits(data.result);
                console.log(data.result);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });

        fetch('https://habit-heatmap-api-d98a01d08072.herokuapp.com/api/v1/get_recent_notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify({ username }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                setRecentNotes(data.result);
                console.log(data.result);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });

        fetch('https://api.api-ninjas.com/v1/quotes?category=inspirational', {
            method: 'GET',
            headers: {
                'X-Api-Key': 'MqTrXKuy1zXQi8S49RNCNA==leho72JwM3kMtacL'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                const suitableQuotes = data.filter(quote => quote.quote.length <= 150);
                if (suitableQuotes.length > 0) {
                    setQuote(suitableQuotes[0].quote); 
                } else {
                    setQuote('No suitable quote found.');
                }
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }, [username]);

    return (
        <div className={`p-6 transition-colors duration-500 ease-in-out ${theme === 'light' ? 'text-black bg-gray-100' : 'text-white bg-zinc-900'}`}>
            <h1 className="text-3xl font-bold mb-4">Welcome, {username}!</h1>
            <p className="text-lg italic mb-6">{quote}</p>

            <div className={`shadow-md rounded-lg p-6 mb-8 transition-colors duration-500 ease-in-out ${theme === 'light' ? 'bg-white text-black' : 'bg-gray-800 text-white'}`}>
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

            <div className={`shadow-md rounded-lg p-6 transition-colors duration-500 ease-in-out ${theme === 'light' ? 'bg-white text-black' : 'bg-gray-800 text-white'}`}>
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