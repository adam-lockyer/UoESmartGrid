import React from 'react';

export const datetimeDataFilter = (data, intervalMinutes) => {
  const filteredData = [];
  let lastTimestamp = null;

  data.forEach((item) => {
    const currentTime = new Date(item.datetime).setSeconds(0, 0);
    if (!lastTimestamp || (currentTime - lastTimestamp) >= intervalMinutes * 60 * 1000) {
      filteredData.push(item);
      lastTimestamp = currentTime;
    }
  });

  return filteredData;
}