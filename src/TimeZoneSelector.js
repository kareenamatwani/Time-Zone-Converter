import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import 'moment-timezone/data/meta/latest.json';
import './TimeZoneSelector.css';
import Select from 'react-select';
import DatePicker from 'react-datepicker'; 
import 'react-datepicker/dist/react-datepicker.css'; // Import styles for react-datepicker

function TimeZoneSelector({ addTimeZone }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null); // Add selectedDate state
  const [options, setOptions] = useState([]);
  const [timeZoneList, setTimeZoneList] = useState([]);

  useEffect(() => {
    const timeZones = moment.tz.names();
    setTimeZoneList(timeZones);
  }, []);

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
  };
  

  const handleTimeZoneAdd = () => {
    if (selectedOption) {
      addTimeZone(selectedOption.value);
      setSelectedOption(null);
    }
  };

  const filterOptions = (inputValue) => {
    const filteredTimeZones = timeZoneList
      .filter((tz) => tz.toLowerCase().includes(inputValue.toLowerCase()))
      .map((tz) => ({ value: tz, label: tz }));

    return filteredTimeZones;
  };

  const handleDateChange = (date) => {
    setSelectedDate(date); // Update selectedDate when the date picker value changes
  };

  return (
    <div className="timezone-selector-container">
      <Select 
        className="timezone-select"
        value={selectedOption}
        onChange={handleChange}
        options={options}

        onInputChange={(inputValue) => setOptions(filterOptions(inputValue))}
        placeholder="Enter a continent or timezone"
      />
      
      <button className="add-button" onClick={handleTimeZoneAdd}>
        +
      </button>
      {/* <DatePicker 
        selected={selectedDate} // Pass the selectedDate state
        onChange={handleDateChange} // Handle date selection
        dateFormat="MMMM d, yyyy" // Define the date format
        placeholderText="Select a date" // Placeholder text
        
      /> */}
      
    </div>
  );
}

export default TimeZoneSelector;
