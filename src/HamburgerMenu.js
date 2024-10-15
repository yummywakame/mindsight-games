import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import { Link } from 'react-router-dom';
import './css/HamburgerMenu.css';

class HamburgerMenu extends React.Component {
  render() {
    return (
      <Menu>
        <Link to="/">Home</Link>
        <Link to="/instructions">Instructions</Link>
        <Link to="/color-game">Color Game</Link>
      </Menu>
    );
  }
}

export default HamburgerMenu;
