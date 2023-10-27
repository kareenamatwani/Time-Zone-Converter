import React, { useState } from 'react';
import TimeZoneSelector from './TimeZoneSelector';
import TimeZoneSlider from './TimeZoneSlider';
import './App.css';
import moment from 'moment-timezone';
import DarkModeToggle from './DarkModeToggle';
// import ScheduleMeeting from './ScheduleMeeting';
import { useDrop } from 'react-dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [selectedDate, setSelectedDate] = useState(moment()); // Initialize with the current date and time
  const [timeZones, setTimeZones] = useState([]);
  const [timeValues, setTimeValues] = useState({}); //stores object (here , current time for the selected timeZone)
  //timeZones stores the seelcted timeZones , while timeValues store its corresponding timeValues
  const [, drop] = useDrop({
    accept: 'TIMEZONE_SLIDER',
    drop: (item, monitor) => {
      const { timeZone } = item;
      const newTimeZones = [...timeZones];//copy of timeZones array
      newTimeZones.splice(timeZones.indexOf(timeZone), 1);//removal of one item
      newTimeZones.push(timeZone);
      setTimeZones(newTimeZones);
      const newTimeValues = {};
      newTimeZones.forEach((tz) => {  //This is a loop that iterates over the time zones in the newTimeZones array.
        newTimeValues[tz] = timeValues[tz];
      });
      setTimeValues(newTimeValues);//updates the state
    },
  });

  const addTimeZone = (timeZone) => {
    setTimeZones([...timeZones, timeZone]);
    setTimeValues({ ...timeValues, [timeZone]: moment() });
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  

  const removeTimeZone = (timeZone) => {
    const updatedTimeZones = timeZones.filter((tz) => tz !== timeZone);
    setTimeZones(updatedTimeZones);
    const { [timeZone]: removedValue, ...rest } = timeValues;//removes timeZone and new object created named rest
    setTimeValues(rest);
  };

  const updateTimeValue = (timeZone, newValue) => {
    setTimeValues({ ...timeValues, [timeZone]: newValue }); 
  };

  const reorderSlidersClockwise = () => {
    const newTimeZones = [...timeZones];//working with new array here ...
    const lastSlider = newTimeZones.pop();
    newTimeZones.unshift(lastSlider);
    setTimeZones(newTimeZones);
  };

  return (
    
    <div className="App">
      <h1 className="heading">Time Zone Converter - Kareena Matwani</h1>
      <div className="header-buttons">
        <DarkModeToggle />
        <button onClick={reorderSlidersClockwise} className="btn">
          <FontAwesomeIcon icon={faSync} />
        </button>
        {/* <ScheduleMeeting 
          selectedTimeZones={timeZones} // Pass the selected time zones
          eventDurationMinutes={120} // Specify the event duration
        /> */}
      </div>
      <TimeZoneSelector selectedDate={selectedDate} addTimeZone={addTimeZone} handleDateChange={handleDateChange} />
      <div ref={drop} className="slider-container">
        {timeZones.map((tz, index) => (
          <TimeZoneSlider
            key={index}
            timeZone={tz}
            timeValue={timeValues[tz]}
            updateTimeValue={updateTimeValue}
            removeTimeZone={removeTimeZone}
            allTimeValues={timeValues}
            selectedDate={selectedDate}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
