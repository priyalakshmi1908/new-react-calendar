import React from "react";

const EventCard = ({ event, overlap }) => {
  const bgColor = event.color || (overlap ? "bg-red-300" : "bg-green-200");
  return (
    <div className={`mt-1 text-xs p-1 rounded text-black ${bgColor}`}>
      <div className="font-semibold truncate">{event.title}</div>
      <div>{event.time} • {event.duration}</div>
    </div>
  );
};

export default EventCard;
