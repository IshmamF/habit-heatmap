import React from "react";
import Popup from "reactjs-popup";

export default function UpdateMetric({openUpdate, closeUpdateModal, submitUpdate, date, selectedHabit, setButton}) {
    return (
        <Popup open={openUpdate} closeOnDocumentClick onClose={closeUpdateModal}>
            <div className="modal">
                <a className="cursor-pointer absolute block px-5 py-2 leading-6 right-[-10px] top-[-10px] text-xl bg-white rounded-full border border-gray-300" onClick={closeUpdateModal}>
                    &times;
                </a>
                <form className="max-w-md mx-auto bg-white shadow-md rounded px-8 mt-12 pt-6 pb-8 mb-4" onSubmit={submitUpdate}>
                    <h1 className="mx-auto text-black text-lg font-bold text-center pb-4">Update Metric:</h1>
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
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="note">
                            Note
                        </label>
                        <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none" name="note" rows={4} cols={40} />
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
            </div>
        </Popup>
    )
}