import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import { Link } from 'react-router-dom';
import './css/HamburgerMenu.css';

class HamburgerMenu extends React.Component {
  static defaultProps = {
    customBurgerIcon: <img src="path/to/burger/icon.png" alt="Menu" />,
    customCrossIcon: <img src="path/to/cross/icon.png" alt="Close" />
  };

  render() {
    return (
      <Menu {...this.props}>
        <Link to="/">Home</Link>
        <Link to="/instructions">Instructions</Link>
        <Link to="/preferences">Preferences</Link>
        <Link to="/color-game">Color Game</Link>
      </Menu>
    );
  }
}

export default HamburgerMenu;

