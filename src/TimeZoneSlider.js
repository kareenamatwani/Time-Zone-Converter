import React, { useEffect, useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import './TimeZoneSlider.css';
import moment from 'moment-timezone';
import { useDrag } from 'react-dnd';
import { FaArrowsAlt } from 'react-icons/fa';

function TimeZoneSlider({ timeZone, timeValue, updateTimeValue, removeTimeZone, allTimeValues, updateTimeValuesForAll, selectedDate }) {
  console.log('Received timeZone:', timeZone);
  const [sliderValue, setSliderValue] = useState(0);
  const [sliderTime, setSliderTime] = useState('');
  const [sliderDate, setSliderDate] = useState('');
  const [sliderStep] = useState(0.1); // Adjust step size
  

  const [debouncedSliderValue, setDebouncedSliderValue] = useState(0);
  const [currentDateTime, setCurrentDateTime] = useState('');
 // const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  let dateDisplay = '';
  if (selectedDate) {
  //  dateDisplay = selectedDate.format('YYYY-MM-DD');
  }
  useEffect(() => {
    // Initialize the slider value, slider time, and slider date when the component mounts
    const initialSliderValue = calculateSliderValue(timeValue);
    setSliderValue(initialSliderValue);
    setSliderTime(timeValue.format('hh:mm A'));
    setSliderDate(timeValue.format('YYYY-MM-DD'));
  }, [timeValue]);

  useEffect(() => {
    // Debounce the slider value for smoother movement
    const debounceTimer = setTimeout(() => {
      setDebouncedSliderValue(sliderValue);
    }, 100);

    return () => clearTimeout(debounceTimer);
  }, [sliderValue]);

  useEffect(() => {
    // Update the current date and time based on the selected timezone
    const currentDateTimeValue = moment()
      .tz(timeZone)
      .format('YYYY-MM-DD hh:mm A');
    setCurrentDateTime(currentDateTimeValue);
  }, [timeZone]);

  useEffect(() => {
    // Update the sliderDate state when selectedDate changes
    if (selectedDate) {
      setSliderDate(selectedDate.format('YYYY-MM-DD'));
    }
  }, [selectedDate]);

  const calculateSliderValue = (value) => {
    // Calculate the slider value based on the time value
    const hours = value.hours();
    const minutes = value.minutes();
    return hours + minutes / 60;
  };

  const handleSliderChange = (newValue) => {
    const hours = Math.floor(newValue);
    const minutes = Math.round((newValue - hours) * 60);
  
    // Create a new moment object for the selected time zone
    const newTimeValue = moment()
      .tz(timeZone)
      .hours(hours)
      .minutes(minutes);
  
    // Update the slider value
    setSliderValue(newValue);
  
    // Calculate the time zone differences in both directions (UTC to local and local to UTC)
    const timeDifferences = {};
    for (const tz in allTimeValues) {
      if (tz !== timeZone) {
        const offsetToUTC = moment.tz.zone(tz).utcOffset(newTimeValue);
        const offsetToSelectedTimeZone = moment.tz.zone(timeZone).utcOffset(newTimeValue);
        const difference = offsetToSelectedTimeZone - offsetToUTC;
        timeDifferences[tz] = difference;
      }
    }
  
    // Update all other sliders' values based on the selected slider's time difference
    for (const tz in allTimeValues) {
      if (tz !== timeZone) {
        const difference = timeDifferences[tz];
        const newValueForOtherSlider = newTimeValue.clone().add(difference, 'minutes');
        updateTimeValue(tz, newValueForOtherSlider);
      }
    }
  
    // Update the slider time based on the slider value
    setSliderTime(newTimeValue.format('hh:mm A'));
  };
  
  // Define the drag handle for the slider
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TIMEZONE_SLIDER',
    item: { timeZone },
  }));

  return (
    <div ref={drag} className={`time-zone-slider ${isDragging ? 'is-dragging' : ''} `}>
      <div className="header">
      <h2 title={`The time zone is ${timeZone}`}>{timeZone}</h2>
        {/* <h2>{timeZone}</h2> */}
        {/* <div className={`timeZone === userTimeZone ? 'current-timezone' : ''}`}>
        <p className="current-date-time">Current Date & Time: {currentDateTime}</p>
        </div> */}
        <p className="current-date-time">Current Date & Time: {currentDateTime}</p>
      </div>
      <div className="header">
        <FaArrowsAlt className="drag-handle-icon" />
        <p className="slider-time">Slider Time: {sliderTime}</p>
        <p className="slider-date">Slider Date: {sliderDate}</p>

        <button className="cross-button" onClick={()=> removeTimeZone(timeZone)}>
          &#10005; {/* This is the 'X' symbol */}
        </button>
      </div>
      <div className="slider">
        <Slider
          min={0}
          max={23.75}
          step={sliderStep}
          onChange={handleSliderChange}
          value={debouncedSliderValue}
          selectedDate={selectedDate}
          marks={{
            0: '12:00 AM',
            6: '6:00 AM',
            12: '12:00 PM',
            18: '6:00 PM',
            23.75: '11:45 PM',
          }}
        />
      </div>
      <br />
    </div>
  );
}

export default TimeZoneSlider;
