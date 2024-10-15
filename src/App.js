import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import ColorGame from './ColorGame';
import InstructionsPage from './InstructionsPage';
import Preferences from './Preferences';
import HamburgerMenu from './HamburgerMenu';

function App() {
  return (
    <div
    className="App"
    style={{
      backgroundColor: 'black',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Raleway', sans-serif",
      color: 'white',
      textAlign: 'center',
    }}
  >
    <HamburgerMenu />
      <nav className="navbar">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/color-game">Color Game</Link>
          </li>
          <li>
            <Link to="/instructions">Instructions</Link>
          </li>
          <li>
            <Link to="/preferences">Preferences</Link>
          </li>
        </ul>
      </nav>
      <Routes>
      <Route
            path="/"
            element={
              <div>
                <h1>Mindsight Practice</h1>
                <div style={{ marginTop: '20px' }}>
                  <Link to="/color-game">
                    <button
                      style={{
                        padding: '10px 20px',
                        marginRight: '10px',
                        fontSize: '1em',
                        cursor: 'pointer',
                      }}
                    >
                      Color Game
                    </button>
                  </Link>
                  <Link to="/instructions">
                    <button
                      style={{
                        padding: '10px 20px',
                        fontSize: '1em',
                        cursor: 'pointer',
                      }}
                    >
                      Instructions
                    </button>
                  </Link>
                </div>
              </div>
            }
          />
        <Route path="/color-game" element={<ColorGame />} />
        <Route path="/instructions" element={<InstructionsPage />} />
        <Route path="/preferences" element={<Preferences />} />
      </Routes>
    </div>
  );
}

export default App;
