import React from "react";
import Calendar from "./Calendar";

const App = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-6">
      <h1 className="text-3xl font-extrabold text-center mb-6 text-purple-800 drop-shadow-md">Calendar</h1>
      <Calendar />
    </div>
  );
};

export default App;