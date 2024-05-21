import React, { useState, useEffect } from 'react';

function Home({ username }) {
    const [recentHabits, setRecentHabits] = useState([]);
    const [recentNotes, setRecentNotes] = useState([]);

    useEffect(() => {
        fetch('http://127.0.0.1:8080/api/v1/get_recent_habits', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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
            },
            body: JSON.stringify({ username }),
        })
            .then(response => response.json())
            .then(data => {
                setRecentNotes(data.result);
                console.log(data.result);
            });
    }, [username]);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Recent Habit Changes</h2>
            <ul className="list-none p-0 mb-6">
                {recentHabits.length > 0 ? (
                    recentHabits.map((habit, index) => (
                        <li key={index} className="mb-2 text-lg">
                            {`Completed the habit ${habit.habitName} for ${habit.value} ${habit.metric} on ${habit.date}`}
                        </li>
                    ))
                ) : (
                    <li className="mb-2 text-lg">No recent habit changes</li>
                )}
            </ul>

            <h2 className="text-2xl font-bold mb-4">Recent Notes</h2>
            <ul className="list-none p-0">
                {recentNotes.length > 0 ? (
                    recentNotes.map((note, index) => (
                        <li key={index} className="mb-2 text-lg">
                            {`${note.note} - ${note.date}`}
                        </li>
                    ))
                ) : (
                    <li className="mb-2 text-lg">No recent notes</li>
                )}
            </ul>
        </div>
    );
}

export default Home;
