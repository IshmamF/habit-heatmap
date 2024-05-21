import React, { useState, useEffect } from 'react';
import CalHeatmap from 'cal-heatmap';
import CalendarLabel from 'cal-heatmap/plugins/CalendarLabel';
import Tooltip from 'cal-heatmap/plugins/Tooltip';
import LegendLite from 'cal-heatmap/plugins/LegendLite';
import 'cal-heatmap/cal-heatmap.css';
import 'dayjs/locale/en';
import dayjs from 'dayjs';
import UpdateMetric from './updateMetric.jsx';
import AddMetric from './addmetric';


function getCorrectDate(date, format="mm/dd/yyyy") {
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1; // getUTCMonth() returns month from 0 to 11
    const day = date.getUTCDate();
    if (format === "mm/dd/yyyy") {
        return `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;
    } else {
        return `${year}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;
    }
}

export default function Heatmap({selectedHabit, username}) {
    const [updatedHabit, setUpdatedHabit] = useState(selectedHabit['data']);

    const [theme, setTheme] = useState('light'); // State to track the current theme
    const [cal, setCal] = useState(null); // State to hold the CalHeatmap instance
    console.log('selectedHabit:', selectedHabit);
    const colors = {
        'green': ['#14432a', '#166b34', '#37a446', '#4dd05a'],
        'orange': ['#7f2f00', '#b34700', '#ff6600', '#ff9933'],
        'blue': ['#0b1a33', '#154273', '#1f5ab9', '#649eff']
    }
    const [date, setDate] = useState(new Date());
    const [openAdd, setOpenAdd] = useState(false);
    const closeAddModal = () => setOpenAdd(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const closeUpdateModal = () => setOpenUpdate(false);
    const [button, setButton] = useState("");


    function submitMetric(event) {
        event.preventDefault(); 
        const metricData = new FormData(event.target);
        const value = Number(metricData.get('metric'));
        const note = metricData.get('note');
        const formattedDate = getCorrectDate(date, "yyyy/mm/dd");
        const data = {
            "date": formattedDate,
            "value": value,
            "note": note
        }
        fetch('https://habit-heatmap-api-d98a01d08072.herokuapp.com/api/v1/addMetric', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify({"habitName": selectedHabit.habitName, "data": data, "username": username}),
        }).then(response => {
            if (response.ok) {
                console.log(response.json());
                const newHabit = selectedHabit.data.concat(data);
                cal && cal.fill(newHabit);
                setUpdatedHabit(newHabit);
            } else {
                alert("Failed to add value");
            }
        }).catch((error) => {
            console.error('Error:', error);
        }
        )
    }

    function submitUpdate(event){
        event.preventDefault();
        const updateData = new FormData(event.target);
        const value = Number(updateData.get('metric'));
        const note = updateData.get('note');
        const formattedDate = getCorrectDate(date, "yyyy/mm/dd");
        console.log("metric", value, "note", note, "date", formattedDate)
        let data;
        for (let info of updatedHabit) {
            if (info.date === formattedDate) {
                data = info;
                break;
            }
        }
        if (value) {
            data.value = value;
        }
        if (note) {
            data.note = note;
        }

        if (button === "update") {
            fetch('https://habit-heatmap-api-d98a01d08072.herokuapp.com/api/v1/updateMetric', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                body: JSON.stringify({"habitName": selectedHabit.habitName, "date": formattedDate, "value": data.value, "note":data.note, "username": username}),
            }).then(response => {
                if (response.ok) {
                    console.log(response.json());
                    const newHabit = updatedHabit.map(info => {
                        if (info.date === formattedDate) {
                            return data;
                        }
                        return info;
                    });
                    cal && cal.fill(newHabit);
                    setUpdatedHabit(newHabit);
                } else {
                    alert("Failed to update metric");
                }
            }).catch((error) => {
                console.error('Error:', error);
            }
            )
        } else {
            fetch('https://habit-heatmap-api-d98a01d08072.herokuapp.com/api/v1/removeMetric', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
                body: JSON.stringify({"habitName": selectedHabit.habitName, "date": formattedDate, "username": username}),
            }).then(response => {
                if (response.ok) {
                    console.log(response.json());
                    const newHabit = updatedHabit.filter(info => info.date !== formattedDate);
                    cal && cal.fill(newHabit);
                    setUpdatedHabit(newHabit);
                } else {
                    alert("Failed to delete metric");
                }
            }).catch((error) => {
                console.error('Error:', error);
            }
            )
        }
    }
    

    useEffect(() => {
        if (!cal) {
            // Initialize CalHeatmap only once.
            const newCal = new CalHeatmap();
            setCal(newCal);
        }

        cal && cal.on("click", (event, timestamp, number) => {
            setDate(new Date(timestamp));
            console.log('date:', date);
            console.log("timestamp", timestamp);
            console.log("habit", updatedHabit);
            if (number) {
                setOpenUpdate(o => !o);
            } else {
                setOpenAdd(o => !o);
            }
    });
    

        // Configure the heat map with the generated data
        cal && cal.paint(
            {
                data: {
                    source: selectedHabit.data,
                    type: 'json',
                    x: 'date',
                    y: 'value',
                    groupY: 'max',
                },
                date: { start: new Date('2024-01-01') },
                range: 12,
                scale: {
                    color: {
                        type: 'threshold',
                        range: colors[selectedHabit.color],
                        domain: [1,3,5,8],
                    },
                },
                domain: {
                    type: 'month',
                    gutter: 4,
                    label: { text: 'MMM', textAlign: 'start', position: 'top' },
                },
                subDomain: { type: 'ghDay', radius: 2, width: 11, height: 11, gutter: 4 },
                itemSelector: '#ex-ghDay',
            },
            [
                [
                    Tooltip,
                    {
                        text: function (date, value, dayjsDate) {
                            return (
                                (value ? value : 'No') +
                                ' contributions on ' +
                                dayjsDate.format('dddd, MMMM D, YYYY')
                            );
                        },
                    },
                ],
                [
                    LegendLite,
                    {
                        includeBlank: true,
                        itemSelector: '#ex-ghDay-legend',
                        radius: 2,
                        width: 11,
                        height: 11,
                        gutter: 4,
                    },
                ],
                [
                    CalendarLabel,
                    {
                        width: 30,
                        textAlign: 'start',
                        text: () => dayjs().format('ddd'), // Format the date to get short weekday
                        padding: [25, 0, 0, 0],
                    },
                ],
            ]
        );

        // destroy function to ensure the heatmap doesn't create duplicates.
        return () => {
            if (cal) {
                cal.destroy();
                setCal(null);
            }
        };
    }, [cal, selectedHabit]); // Re-run effect when cal changes or initially when mounted

    // Function to toggle between light and dark themes
    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
        if (cal) {
            cal.destroy();
            setCal(null);
        }
    };

    return (
        <>
            {selectedHabit.habitName !== "Select a habit" && (
                <div
                    style={{
                        background: theme === 'light' ? '#e4e4e7' : '#22272d',
                        color: theme === 'light' ? '#22272d' : '#adbac7',
                        borderRadius: '3px',
                        padding: '1rem',
                        overflow: 'hidden',
                    }}
                >
                    <div id="ex-ghDay" className="margin-bottom--md"></div>
                    <a
                        className="button button--sm button--secondary margin-top--sm"
                        href="#"
                        onClick={e => {
                            e.preventDefault();
                            if (cal) {
                                cal.previous();
                            }
                        }}
                    >
                        ← Previous
                    </a>
                    <a
                        className="button button--sm button--secondary margin-top--sm margin-left--xs"
                        href="#"
                        onClick={e => {
                            e.preventDefault();
                            if (cal) {
                                cal.next();
                            }
                        }}
                    >
                        Next →
                    </a>
                    <div style={{ float: 'right', fontSize: 12 }}>
                        <span style={{ color: theme === 'light' ? '#768390' : '#adbac7' }}>Less</span>
                        <div
                            id="ex-ghDay-legend"
                            style={{ display: 'inline-block', margin: '0 4px' }}
                        ></div>
                        <span style={{ color: theme === 'light' ? '#768390' : '#adbac7', fontSize: 12 }}>More</span>
                    </div>
                    <button onClick={toggleTheme}>Toggle Theme</button> {/* you should try making the heat map change color automatically. do later */}
                    <AddMetric openAdd={openAdd} closeAddModal={closeAddModal} submitMetric={submitMetric} date={getCorrectDate(date)} selectedHabit={selectedHabit}></AddMetric>
                    <UpdateMetric openUpdate={openUpdate} closeUpdateModal={closeUpdateModal} submitUpdate={submitUpdate} date={getCorrectDate(date)} selectedHabit={selectedHabit} setButton={setButton}></UpdateMetric>
                </div>
            )}
        </>
    );
}
