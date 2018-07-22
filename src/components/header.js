import React from 'react'
import Link from 'gatsby-link'
import { connect } from "react-redux"

import Me from '../components/me'

const Header = ({ siteTitle, path, hide, scrollingDown, title}) => {
  const headerStyle = {
      marginBottom: '0',
      transition: 'transform 0.2s ease-in-out',
      transform: scrollingDown ? 'translate(0, -100px)' : 'translate(0, 0)', 
      display: (path === '/' || hide) ? 'none' : 'block',
      position:'fixed',
      width:'100%',
    };
  const textStyle = {
       margin: '0',
  };
  return (
    <div
      style={headerStyle}
    >
      <div className="header_menu">
        <Me className="header_me" />
        <div className="header_items">
          <span> <Link to="/category/"><i className="fas fa-tags"></i> Categories </Link></span>
          <span> <Link to="/search/"><i className="fas fa-search"></i> Search </Link></span>
          <span> <Link to="/about/"><i className="fas fa-question"></i> About </Link></span>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    scrollingDown: state.globalReducer.scrollingDown,
  };
}

export default connect(mapStateToProps, null)(Header);
