import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

export const Header = ({ headerLink, onClickPressed, buttonText }) => (
  <div>
    <header>
      <Link to={headerLink}>
        <h3>App</h3>
      </Link>
      <button onClick={onClickPressed}>{buttonText}</button>
    </header>
  </div>
);

export default Header;
