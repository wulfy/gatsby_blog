import React from 'react'
import { Link } from 'gatsby'
import { connect } from "react-redux"

import Me from '../components/me'

const Header = ({ siteTitle, path, hide, scrollingDown, scrollValue, title}) => {
  const locationHome = path === '/';
  const headerStyle = {
      marginBottom: '0',
      transition: 'transform 0.2s ease-in-out',
      transform: scrollingDown &&  scrollValue > 10 ? 'translate(0, -100px)' : 'translate(0, 0)', 
      display: 'block',
      position: locationHome? 'absolute' : 'fixed',
      width:'100%',
      zIndex: 999
    };

  let headerOverrideClass = scrollValue < 100 && path.indexOf("posts") >= 0 && path.split("/")[2]? "header_menu_start" : "";
  headerOverrideClass = locationHome ? " header_menu_home " : headerOverrideClass;
  return (
    <div
      style={headerStyle}
    >
      <div className={`${locationHome ? "header_menu_home":"header_menu"}  ${headerOverrideClass}`}>
        {!locationHome ? <Link to="/"><Me className="header_me" /></Link> : null}
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
    scrollValue:state.globalReducer.scrollValue,
  };
}

export default connect(mapStateToProps, null)(Header);
