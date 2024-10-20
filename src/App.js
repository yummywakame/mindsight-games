import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import ColorGame from './games/ColorGame/ColorGame'; // Updated path
import InstructionsPage from './InstructionsPage';
import PreferencesPage from './PreferencesPage';
import HamburgerMenu from './HamburgerMenu';
import './css/App.css'; // Importing the App CSS

function App() {
  return (
    <div className="App">
      <HamburgerMenu />
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <h1>Mindsight Practice</h1>
              <div className="home-buttons">
                <Link to="/color-game">
                  <button>Color Game</button>
                </Link>
                <Link to="/instructions">
                  <button>Instructions</button>
                </Link>              
              </div>
            </div>
          }
        />
        <Route path="/color-game" element={<ColorGame />} />
        <Route path="/instructions" element={<InstructionsPage />} />
        <Route path="/preferences" element={<PreferencesPage />} />
      </Routes>
    </div>
  );
}

export default App;
