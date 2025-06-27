
import React, { useState } from "react";

const colorOptions = [
  "bg-red-300",
  "bg-green-300",
  "bg-blue-300",
  "bg-yellow-300",
  "bg-purple-300",
  "bg-pink-300"
];

const EventForm = ({ selectedDate, onSave, onCancel }) => {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("");
  const [color, setColor] = useState(colorOptions[0]);

  const handleSubmit = e => {
    e.preventDefault();
    onSave({
      title,
      date: selectedDate.format("YYYY-MM-DD"),
      time,
      duration,
      color
    });
    setTitle("");
    setTime("");
    setDuration("");
    setColor(colorOptions[0]);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-gradient-to-br from-white via-gray-100 to-white border border-gray-300 p-6 rounded-2xl shadow-2xl w-[400px]">
        <h3 className="text-xl font-extrabold text-indigo-700 text-center mb-4">Add Event - {selectedDate.format("MMM D, YYYY")}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Event Title"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <input
            type="time"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            value={time}
            onChange={e => setTime(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Duration (e.g., 1h, 30m)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            value={duration}
            onChange={e => setDuration(e.target.value)}
            required
          />
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">Choose Color:</label>
            <div className="flex gap-2">
              {colorOptions.map((c, i) => (
                <div
                  key={i}
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full cursor-pointer border-2 transition-all duration-200 ${c} ${color === c ? "ring-2 ring-offset-2 ring-indigo-500 border-black" : "border-transparent"}`}
                  title={c.replace("bg-", "").replace("-300", "")}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-between pt-3">
            <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-md transition">Add</button>
            <button type="button" className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg shadow-md transition" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;