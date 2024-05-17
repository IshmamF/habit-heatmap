import React from "react";
import Popup from "reactjs-popup";


export default function AddMetric({openAdd, closeAddModal, submitMetric, date, selectedHabit}) {
    return (
        <Popup open={openAdd} closeOnDocumentClick onClose={closeAddModal}>
            <div className="modal">
                <a className="cursor-pointer absolute block px-5 py-2 leading-6 right-[-10px] top-[-10px] text-xl bg-white rounded-full border border-gray-300" onClick={closeAddModal}>
                    &times;
                </a>
                <form onSubmit={submitMetric} className="max-w-md mx-auto bg-white shadow-md rounded px-8 mt-12 pt-6 pb-8 mb-4">
                    <h1 className="mx-auto text-black text-lg font-bold text-center pb-4">Add Metric:</h1>
                    <div className="mb-4">
                        <h1>Date: {date}</h1>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="metric">
                            Metric
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none" type="number" name="metric" required/>
                        {'  ' + selectedHabit.metric}
                    </div>
                    <div className="flex items-center justify-center mt-8">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded " type="submit">
                        Submit
                    </button>
                    </div>
                </form>
            </div>
        </Popup>
    );
}