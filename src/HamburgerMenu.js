import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import { Link } from 'react-router-dom';
import './css/HamburgerMenu.css';

class HamburgerMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false,
    };
  }

  handleStateChange(state) {
    this.setState({ menuOpen: state.isOpen });
  }

  closeMenu() {
    this.setState({ menuOpen: false });
  }

  render() {
    return (
      <div className="hamburger-menu-container"> {/* New container */}
        <Menu
          isOpen={this.state.menuOpen}
          onStateChange={(state) => this.handleStateChange(state)}
        >
          <Link to="/" onClick={() => this.closeMenu()}>Home</Link>
          <Link to="/instructions" onClick={() => this.closeMenu()}>Instructions</Link>
          <Link to="/color-game" onClick={() => this.closeMenu()}>Color Game</Link>
        </Menu>
      </div>
    );
  }
}

export default HamburgerMenu;
