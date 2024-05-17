import React from 'react';
import { getHabitOptions  } from '../functions/habits';

export default function HabitOptions ({habits, handleChange}) {

    return (
    <div className='mb-4'>
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="habit">
          Select Habit:
        </label>
        <select onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none " name="habit">
          <option value="select">Select a Habit</option>
          {getHabitOptions(habits)}
        </select>
      </div>
    )
}