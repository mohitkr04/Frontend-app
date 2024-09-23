import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import LandingPage from './components/LandingPage';
import SearchPage from './components/SearchPage';
import Footer from './components/Footer'; // New import

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [landingPageDarkMode, setLandingPageDarkMode] = useState(false);
  const [searchPageDarkMode, setSearchPageDarkMode] = useState(false);

  const landingTheme = createTheme({
    palette: {
      mode: landingPageDarkMode ? 'dark' : 'light',
    },
  });

  const searchTheme = createTheme({
    palette: {
      mode: searchPageDarkMode ? 'dark' : 'light',
    },
  });

  const handleExplore = () => {
    setCurrentPage('search');
  };

  const handleAddCompany = () => {
    console.log('Add company details');
  };

  const handleBackToHome = () => {
    setCurrentPage('landing');
  };

  const toggleLandingPageDarkMode = (checked) => {
    setLandingPageDarkMode(checked);
  };

  const toggleSearchPageDarkMode = (checked) => {
    setSearchPageDarkMode(checked);
  };

  return (
    <ThemeProvider theme={currentPage === 'landing' ? landingTheme : searchTheme}>
      <CssBaseline />
      {currentPage === 'landing' ? (
        <LandingPage 
          onExplore={handleExplore} 
          onAddCompany={handleAddCompany} 
          isDarkMode={landingPageDarkMode}
          toggleDarkMode={toggleLandingPageDarkMode}
        />
      ) : (
        <SearchPage 
          onBackToHome={handleBackToHome}
          isDarkMode={searchPageDarkMode}
          toggleDarkMode={toggleSearchPageDarkMode}
        />
      )}
      <Footer />
    </ThemeProvider>
  );
}

export default App;
