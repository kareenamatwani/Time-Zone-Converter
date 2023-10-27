import React, { useState } from 'react';
import './DarkModeToggle.css';
import { IoMdSunny, IoMdMoon } from 'react-icons/io';

function DarkModeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(true); // Initially set to true for dark mode

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode', isDarkMode);
  };

  return (
    <div className={`dark-mode-toggle ${isDarkMode ? 'dark' : 'light'}`}>
      <button onClick={toggleDarkMode} style={{borderRadius:'4px'}}>
        {isDarkMode ? (
          <IoMdMoon size={24} />
        ) : (
          
          <IoMdSunny size={24} /> 
        )}
      </button>
    </div>
  );
}

export default DarkModeToggle;
