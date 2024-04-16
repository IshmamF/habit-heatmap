import React, { useEffect, useRef } from 'react';
import CalHeatmap from 'cal-heatmap';
import Tooltip from 'cal-heatmap/plugins/Tooltip';
import Legend from 'cal-heatmap/plugins/Legend';
import CalendarLabel from 'cal-heatmap/plugins/CalendarLabel';
import dayjs from 'dayjs';
import 'dayjs/locale/en'; // Import the locale you need

dayjs.locale('en'); // Use the locale as needed

const Heatmap = () => {
    const calRef = useRef(null);

    useEffect(() => {
        if (!calRef.current) {
            console.log("Initializing CalHeatmap");
            calRef.current = new CalHeatmap();
            calRef.current.paint({
                data: {
                    source: '../seattle-weather.csv',
                    type: 'csv',
                    x: 'date',
                    y: d => +d['wind'],
                    groupY: 'max',
                },
                date: { start: new Date('2024-01-01') },
                range: 8,
                scale: {
                    color: {
                        type: 'quantize',
                        // Updated color range for gray bars
                        range: ['#f0f0f0', '#d9d9d9', '#bdbdbd', '#969696', '#737373', '#525252', '#252525', '#000000'],
                        domain: [0, 1, 2, 3, 4, 5, 6, 7],
                    },
                },
                domain: {
                    type: 'month',
                },
                subDomain: { type: 'day', radius: 2 },
                itemSelector: '#ex-wind',
            }, [
                [Tooltip, {
                    text: function (date, value) {
                        return (value ? value + 'km/h' : 'No data') + ' on ' + dayjs(date).format('LL');
                    }
                }],
                [Legend, {
                    tickSize: 0,
                    width: 100,
                    itemSelector: '#ex-wind-legend',
                    label: 'Seattle wind (km/h)',
                }],
            ]);              
        }
    }, []);

    return (
        <div style={{ display: 'inline-block' }}>
            <div id="ex-wind"></div>
            <a
                className="button button--sm button--secondary margin-top--sm"
                href="#"
                onClick={e => {
                    e.preventDefault();
                    calRef.current.previous();
                }}
            >
                ← Previous
            </a>
            <a
                className="button button--sm button--secondary margin-left--xs margin-top--sm"
                href="#"
                onClick={e => {
                    e.preventDefault();
                    calRef.current.next();
                }}
            >
                Next →
            </a>
            <div id="ex-wind-legend" style={{ float: 'right' }}></div>
        </div>    
    );
};

export default Heatmap;
