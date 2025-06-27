
import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import durationPlugin from "dayjs/plugin/duration";
import EventCard from "./EventCard";
import EventForm from "./EventForm";

dayjs.extend(durationPlugin);

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showConflict, setShowConflict] = useState(false);

  useEffect(() => {
    fetch("/events.json")
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error("Error fetching events:", err));
  }, []);

  const startDay = currentDate.startOf("month").startOf("week");
  const endDay = currentDate.endOf("month").endOf("week");

  const calendarDays = [];
  let day = startDay.clone();
  while (day.isBefore(endDay, "day")) {
    calendarDays.push(day);
    day = day.add(1, "day");
  }

  const handlePrev = () => setCurrentDate(prev => prev.subtract(1, "month"));
  const handleNext = () => setCurrentDate(prev => prev.add(1, "month"));

  const handleDayClick = (date) => {
    setSelectedDate(date);
    setShowForm(true);
  };

  const parseDuration = (str) => {
    const match = str.match(/(\d+)(h|m)/);
    if (!match) return 0;
    const value = parseInt(match[1]);
    return match[2] === 'h' ? value * 60 : value;
  };

  const timeToMinutes = (time) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  const handleAddEvent = (newEvent) => {
    const newStart = timeToMinutes(newEvent.time);
    const newEnd = newStart + parseDuration(newEvent.duration);

    const conflicts = events.filter(e => {
      if (e.date !== newEvent.date) return false;
      const existingStart = timeToMinutes(e.time);
      const existingEnd = existingStart + parseDuration(e.duration);
      return newStart < existingEnd && newEnd > existingStart;
    });

    if (conflicts.length > 0) {
      setShowForm(false);
      setShowConflict(true);
      setTimeout(() => setShowConflict(false), 3000);
      return; // prevent adding
    }

    setEvents(prev => [...prev, newEvent]);
    setShowForm(false);
  };

  const getEventsForDay = (date) => {
    return events.filter(e => dayjs(e.date).isSame(date, "day"));
  };

  return (
    <div className="p-4 relative bg-white/80 rounded-xl shadow-lg">
      {showConflict && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-2 rounded shadow-md z-50 text-sm">
          ⚠️ Event conflict: Overlapping time!
        </div>
      )}
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrev} className="px-4 py-2 bg-indigo-300 text-white rounded-lg shadow hover:bg-indigo-400 transition">←</button>
        <h2 className="text-2xl font-bold text-indigo-800 drop-shadow">{currentDate.format("MMMM YYYY")}</h2>
        <button onClick={handleNext} className="px-4 py-2 bg-indigo-300 text-white rounded-lg shadow hover:bg-indigo-400 transition">→</button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center font-bold text-indigo-700">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
          <div key={d} className="uppercase tracking-wider">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 mt-2">
        {calendarDays.map((dayItem, idx) => {
          const isToday = dayItem.isSame(dayjs(), "day");
          const eventsForDay = getEventsForDay(dayItem);

          return (
            <div
              key={idx}
              onClick={() => handleDayClick(dayItem)}
              className={`min-h-[100px] p-2 border rounded-xl cursor-pointer transition hover:scale-[1.02] ${
                isToday ? "bg-yellow-100 border-yellow-500 shadow-lg" : "bg-white/70 border-indigo-200"
              }`}
            >
              <div className="font-bold text-indigo-700 text-sm mb-1">{dayItem.date()}</div>
              {eventsForDay.map((event, index) => (
                <EventCard key={index} event={event} overlap={eventsForDay.length > 1} />
              ))}
            </div>
          );
        })}
      </div>

      {showForm && (
        <EventForm
          selectedDate={selectedDate}
          onSave={handleAddEvent}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default Calendar;