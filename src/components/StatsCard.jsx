import React from 'react';

const StatsCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white shadow-md p-4 rounded-lg text-center">
      <div className="text-4xl text-purple-600">{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
};

export default StatsCard;
